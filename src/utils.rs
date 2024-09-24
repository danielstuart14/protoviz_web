use dioxus_logger::tracing::error;
use hex_color::HexColor;
use js_sys::wasm_bindgen::JsCast;
use protoviz::descriptor::{FieldDescriptor, FieldLength, ProtoDescriptor};

#[derive(Debug, Default)]
pub struct FieldInput {
    pub name: String,
    pub length: String,
    pub wrap: bool,
    pub color: Option<HexColor>,
}

pub fn download_file(data: &[u8], filename: &str, file_type: &str) -> bool {
    let js_byte_array = js_sys::Uint8Array::from(data);
    let js_array = js_sys::Array::new();
    js_array.push(&js_byte_array.buffer());

    let options = web_sys::BlobPropertyBag::new();
    options.set_type(file_type);

    let blob = web_sys::Blob::new_with_u8_array_sequence_and_options(
        &js_array,
        &options,
    )
    .unwrap();

    let url = match web_sys::Url::create_object_url_with_blob(&blob) {
        Ok(url) => url,
        Err(e) => {
            error!("Failed to create object URL: {:?}", e);
            return false;
        }
    };

    let document = match web_sys::window().map(|window| window.document()).flatten() {
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

pub fn update_svg(descriptor: &ProtoDescriptor) -> String {
    if descriptor.fields.is_empty() {
        return String::new();
    }

    match protoviz::render(&descriptor) {
        Ok(svg) => svg,
        Err(e) => {
            error!("Failed to render SVG: {}", e);
            gloo_dialogs::alert(&format!("Failed to render SVG: {:?}", e));
            String::new()
        }
    }
}
