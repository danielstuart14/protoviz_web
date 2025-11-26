use base64::prelude::*;
use dioxus_logger::tracing::error;
use hex_color::HexColor;
use js_sys::wasm_bindgen::{closure::Closure, JsCast, JsValue};
use protoviz::{
    descriptor::{FieldDescriptor, FieldLength, ProtoDescriptor},
    ProtoViz,
};

#[derive(Debug, Default)]
pub struct FieldInput {
    pub name: String,
    pub length: String,
    pub wrap: bool,
    pub color: Option<HexColor>,
}

/// Convert an SVG string into a PNG data URL using the browser's renderer.
pub async fn svg_to_png_bytes(svg_data: &str, width: f64, height: f64) -> Option<Vec<u8>> {
    let window = web_sys::window()?;
    let document = window.document()?;

    // Create an iframe. This is an ugly hack for Chrome/Edge.
    let iframe = document
        .create_element("iframe")
        .ok()?
        .dyn_into::<web_sys::HtmlIFrameElement>()
        .ok()?;

    iframe.style().set_property("display", "none").ok()?;
    iframe
        .set_attribute("sandbox", "allow-same-origin allow-scripts")
        .ok()?;

    document.body()?.append_child(&iframe).ok()?;

    // Convert svg to base64
    let svg_b64 = BASE64_STANDARD.encode(svg_data);

    // Inject HTML into iframe srcdoc
    let html = format!(
        r#"
<!DOCTYPE html>
<html>
<body>
<canvas id="c" width="{w}" height="{h}"></canvas>

<img id="img" src="data:image/svg+xml;base64,{svg_b64}">

<script>
window.onload = async () => {{
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const img = document.getElementById('img');

    await img.decode();  // wait for SVG to load

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Send back PNG data URL to parent
    parent.postMessage({{ png: canvas.toDataURL("image/png") }}, "*");
}};
</script>
</body>
</html>
"#,
        w = width,
        h = height,
        svg_b64 = svg_b64
    );

    iframe.set_srcdoc(&html);

    // Wait for response from iframe
    let promise = js_sys::Promise::new(&mut |resolve, _reject| {
        let resolver = resolve.clone();
        let closure =
            Closure::<dyn FnMut(_)>::wrap(Box::new(move |event: web_sys::MessageEvent| {
                if let Ok(obj) = event.data().dyn_into::<js_sys::Object>() {
                    if let Ok(png_val) = js_sys::Reflect::get(&obj, &JsValue::from_str("png")) {
                        if png_val.is_string() {
                            let _ = resolver.call1(&JsValue::UNDEFINED, &png_val);
                        }
                    }
                }
            }));

        window
            .add_event_listener_with_callback("message", closure.as_ref().unchecked_ref())
            .unwrap();

        closure.forget(); // do NOT drop
    });

    let js_val = wasm_bindgen_futures::JsFuture::from(promise).await.ok()?;
    let data_url = js_val.as_string()?;

    // Decode png
    let base64_data = data_url.split(',').nth(1)?;
    let png_bytes = BASE64_STANDARD.decode(base64_data).ok()?;

    // Cleanup
    let _ = document.body()?.remove_child(&iframe);

    Some(png_bytes)
}

pub fn download_file(data: &[u8], filename: &str, file_type: &str) -> bool {
    let js_byte_array = js_sys::Uint8Array::from(data);
    let js_array = js_sys::Array::new();
    js_array.push(&js_byte_array.buffer());

    let options = web_sys::BlobPropertyBag::new();
    options.set_type(file_type);

    let blob = web_sys::Blob::new_with_u8_array_sequence_and_options(&js_array, &options).unwrap();

    let url = match web_sys::Url::create_object_url_with_blob(&blob) {
        Ok(url) => url,
        Err(e) => {
            error!("Failed to create object URL: {:?}", e);
            return false;
        }
    };

    let document = match web_sys::window().and_then(|window| window.document()) {
        Some(document) => document,
        None => {
            error!("Failed to get document");
            return false;
        }
    };

    let a: web_sys::HtmlElement = match document.create_element("a") {
        Ok(a) => match a.dyn_into() {
            Ok(a) => a,
            Err(e) => {
                error!("Failed to cast anchor element: {:?}", e);
                return false;
            }
        },
        Err(e) => {
            error!("Failed to create anchor element: {:?}", e);
            return false;
        }
    };

    if let Err(e) = a.set_attribute("href", &url) {
        error!("Failed to set href attribute: {:?}", e);
        return false;
    }

    if let Err(e) = a.set_attribute("download", filename) {
        error!("Failed to set download attribute: {:?}", e);
        return false;
    }

    a.click();

    true
}

pub fn create_field_descriptors(input_fields: &[FieldInput]) -> Vec<FieldDescriptor> {
    input_fields
        .iter()
        .map(|field| {
            FieldDescriptor {
                name: field.name.clone(),
                length: if !field.length.is_empty() {
                    match field.length.parse::<usize>() {
                        Ok(len) => FieldLength::Fixed(len),
                        Err(_) => FieldLength::Variable(field.length.clone()),
                    }
                } else {
                    FieldLength::Fixed(1) // If no length is provided, default to 1
                },
                wrap: field.wrap,
                color: field.color,
            }
        })
        .collect()
}

pub fn update_field_inputs(descriptors: &[FieldDescriptor]) -> Vec<FieldInput> {
    descriptors
        .iter()
        .map(|field| FieldInput {
            name: field.name.clone(),
            length: match &field.length {
                FieldLength::Fixed(len) => len.to_string(),
                FieldLength::Variable(len) => len.clone(),
            },
            wrap: field.wrap,
            color: field.color,
        })
        .collect()
}

pub fn update_svg(descriptor: &ProtoDescriptor) -> Option<ProtoViz> {
    if descriptor.fields.is_empty() {
        return None;
    }

    match ProtoViz::render(descriptor) {
        Ok(prtvz) => Some(prtvz),
        Err(e) => {
            error!("Failed to render SVG: {}", e);
            gloo_dialogs::alert(&format!("Failed to render SVG: {:?}", e));
            None
        }
    }
}
