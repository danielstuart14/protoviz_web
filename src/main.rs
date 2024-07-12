mod utils;

use dioxus::prelude::*;
use dioxus_free_icons::{
    icons::{
        fa_brands_icons::FaGithub,
        fa_solid_icons::{FaCaretDown, FaCaretUp, FaPlus, FaX},
    },
    Icon,
};
use dioxus_logger::tracing::{error, Level};
use hex_color::{Display, HexColor};
use protoviz::descriptor::ProtoDescriptor;

use utils::{create_field_descriptors, download_file, update_field_inputs, update_svg, FieldInput};

fn main() {
    // Init logger
    dioxus_logger::init(Level::INFO).expect("failed to init logger");
    launch(app);
}

#[component]
fn app() -> Element {
    let mut input_fields = use_signal(|| {
        vec![
            FieldInput {
                name: "Field 1".to_string(),
                length: "2".to_string(),
                wrap: false,
                color: None,
            },
            FieldInput {
                name: "Field 2".to_string(),
                length: "N".to_string(),
                wrap: false,
                color: Some(HexColor::rgb(120, 180, 240)),
            },
            FieldInput {
                name: "Field 3".to_string(),
                length: "1".to_string(),
                wrap: false,
                color: Some(HexColor::rgb(240, 180, 120)),
            },
        ]
    });

    let mut file_opened = use_signal(|| String::new());
    let mut descriptor = use_signal(|| ProtoDescriptor::default());
    let mut svg_data = use_signal(|| {
        descriptor.write().fields = create_field_descriptors(&input_fields.read());
        update_svg(&descriptor.read())
    });

    rsx! {
        link { rel: "stylesheet", href: "main.css" }
        div { class: "header",
            h1 { class: "title",
                "ProtoViz"
            },
            div { class: "header_left",
                label { r#for: "file-open", class: "button button_header",
                    "Open"
                },
                input {
                    id: "file-open",
                    r#type: "file",
                    accept: ".json",
                    multiple: false,
                    value: "{*file_opened.read()}",
                    onchange: move |evt| {
                        *file_opened.write() = evt.value();
                        async move {
                            if let Some(files) = evt.files() {
                                match files.files().iter().next() {
                                    Some(file_name) => {
                                        if let Some(file) = files.read_file_to_string(file_name).await {
                                            let new_descriptor: ProtoDescriptor = match serde_json::from_str(&file) {
                                                Ok(descriptor) => descriptor,
                                                Err(e) => {
                                                    error!("Failed to parse file: {}", e);
                                                    gloo_dialogs::alert("Failed to parse file");
                                                    return;
                                                }
                                            };

                                            *descriptor.write() = new_descriptor;
                                            *input_fields.write() = update_field_inputs(&descriptor.read().fields);
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    },
                                    None => {}
                                }
                            }
                            *file_opened.write() = String::new();
                        }
                    },
                }
                button { class: "button button_header",
                    onclick: move |_| {
                        match serde_json::to_string_pretty(&*descriptor.read()) {
                            Ok(json) => {
                                let cur_date = chrono::Local::now();
                                let file_name = cur_date.format("protoviz_%Y-%m-%d_%H-%M-%S.json").to_string();
                                if !download_file(json.as_bytes(), &file_name, "application/json") {
                                    gloo_dialogs::alert("Failed to download file");
                                }
                            },
                            Err(e) => {
                                error!("Failed to serialize descriptor: {}", e);
                                gloo_dialogs::alert("Failed to create json");
                            }
                        }
                    },
                    "Save"
                }
            },
            div { class: "header_right",
                button { class: "button button_header",
                    onclick: move |_| {
                        let cur_date = chrono::Local::now();
                        let file_name = cur_date.format("protoviz_%Y-%m-%d_%H-%M-%S.svg").to_string();
                        if !download_file(svg_data.read().as_bytes(), &file_name, "image/svg+xml") {
                            gloo_dialogs::alert("Failed to download file");
                        }
                    },
                    "Export SVG"
                },
                a { class: "icon_link",
                    href: "https://github.com/danielstuart14/protoviz_web",
                    target: "_blank",
                    Icon {
                        width: 30,
                        height: 30,
                        icon: FaGithub,
                    }
                }
            }
        }
        div { class: "row",
            div { class: "column left_column",
                div { class: "header tab",
                    h3 { "Fields" },
                    button { class: "button circle_button",
                        onclick: move |_| {
                            input_fields.write().push(FieldInput::default());
                            descriptor.write().fields = create_field_descriptors(&input_fields.read());
                            *svg_data.write() = update_svg(&descriptor.read());
                        },
                        Icon {
                            width: 15,
                            height: 15,
                            icon: FaPlus,
                        }
                    }
                },
                div { class: "list",
                    for (i, field) in input_fields.read().iter().enumerate() {
                        div { class: "row list_row",
                            div { class: "column arrow_column",
                                button { class: "button arrow_button",
                                    disabled: i == 0,
                                    onclick: move |_| {
                                        input_fields.write().swap(i, i - 1);
                                        descriptor.write().fields = create_field_descriptors(&input_fields.read());
                                        *svg_data.write() = update_svg(&descriptor.read());
                                    },
                                    Icon {
                                        width: 10,
                                        height: 10,
                                        icon: FaCaretUp,
                                    },
                                },
                                button { class: "button arrow_button",
                                    disabled: i == input_fields.read().len() - 1,
                                    onclick: move |_| {
                                        input_fields.write().swap(i, i + 1);
                                        descriptor.write().fields = create_field_descriptors(&input_fields.read());
                                        *svg_data.write() = update_svg(&descriptor.read());
                                    },
                                    Icon {
                                        width: 10,
                                        height: 10,
                                        icon: FaCaretDown,
                                    },
                                },
                            },
                            input { class: "text_entry", style: "flex: 2;",
                                placeholder: "Field Name",
                                value: field.name.clone(),
                                onchange: move |evt| {
                                    input_fields.write()[i].name = evt.value();
                                    descriptor.write().fields = create_field_descriptors(&input_fields.read());
                                    *svg_data.write() = update_svg(&descriptor.read());
                                }
                            },
                            input { class: "text_entry",
                                placeholder: "Field Length",
                                value: field.length.clone(),
                                onchange: move |evt| {
                                    input_fields.write()[i].length = evt.value();
                                    descriptor.write().fields = create_field_descriptors(&input_fields.read());
                                    *svg_data.write() = update_svg(&descriptor.read());
                                }
                            },
                            label { r#for: "wrap", "Wrap" },
                            input { r#type: "checkbox",
                                checked: field.wrap,
                                name: "wrap",
                                oninput: move |evt| {
                                    if evt.checked() {
                                        input_fields.write()[i].wrap = true;
                                    } else {
                                        input_fields.write()[i].wrap = false;
                                    }
                                    descriptor.write().fields = create_field_descriptors(&input_fields.read());
                                    *svg_data.write() = update_svg(&descriptor.read());
                                }
                            },
                            label { r#for: "color", "Color" },
                            input { r#type: "checkbox",
                                checked: field.color.is_some(),
                                name: "color",
                                oninput: move |evt| {
                                    if evt.checked() {
                                        input_fields.write()[i].color = Some(descriptor.read().style.field_color.clone());
                                    } else {
                                        input_fields.write()[i].color = None;
                                    }
                                    descriptor.write().fields = create_field_descriptors(&input_fields.read());
                                    *svg_data.write() = update_svg(&descriptor.read());
                                }
                            },
                            input {
                                r#type: "color",
                                disabled: field.color.is_none(),
                                value: format!("{}", Display::new(field.color.unwrap_or(descriptor.read().style.field_color.clone()))),
                                onchange: move |evt| {
                                    input_fields.write()[i].color = Some(HexColor::parse_rgb(&evt.value()).unwrap());
                                    descriptor.write().fields = create_field_descriptors(&input_fields.read());
                                    *svg_data.write() = update_svg(&descriptor.read());
                                }
                            },
                            button { class: "button circle_button",
                                onclick: move |_| {
                                    input_fields.write().remove(i);
                                    descriptor.write().fields = create_field_descriptors(&input_fields.read());
                                    *svg_data.write() = update_svg(&descriptor.read());
                                },
                                Icon {
                                    width: 12,
                                    height: 12,
                                    icon: FaX,
                                },
                            }
                        }
                    }
                }
            }
            div { class: "column right_column",
                div { class: "viewport",
                    style: "background-color: #ffffff",
                    dangerous_inner_html: svg_data.read().as_str(),
                }
                div {
                    div { class: "row flex_separator",
                        div { class: "column flex_item options_column",
                            div { class: "header tab",
                                h3 { "Style" },
                            },
                            div { class: "options",
                                div { class: "row list_row list_row_slim",
                                    label { r#for: "back_color", "Background Color" },
                                    input {
                                        r#type: "color",
                                        name: "back_color",
                                        value: format!("{}", Display::new(descriptor.read().style.background_color)),
                                        onchange: move |evt| {
                                            descriptor.write().style.background_color = HexColor::parse_rgb(&evt.value()).unwrap();
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    }
                                },
                                div { class: "row list_row list_row_slim",
                                    label { r#for: "field_color", "Field Color" },
                                    input {
                                        r#type: "color",
                                        name: "field_color",
                                        value: format!("{}", Display::new(descriptor.read().style.field_color)),
                                        onchange: move |evt| {
                                            descriptor.write().style.field_color = HexColor::parse_rgb(&evt.value()).unwrap();
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    }
                                },
                                div { class: "row list_row list_row_slim",
                                    label { r#for: "text_color", "Text Color" },
                                    input {
                                        r#type: "color",
                                        name: "text_color",
                                        value: format!("{}", Display::new(descriptor.read().style.text_color)),
                                        onchange: move |evt| {
                                            descriptor.write().style.text_color = HexColor::parse_rgb(&evt.value()).unwrap();
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    }
                                },
                                div { class: "row list_row list_row_slim",
                                    label { r#for: "sub_color", "Subtitle Color" },
                                    input {
                                        r#type: "color",
                                        name: "sub_color",
                                        value: format!("{}", Display::new(descriptor.read().style.subtitle_color)),
                                        onchange: move |evt| {
                                            descriptor.write().style.subtitle_color = HexColor::parse_rgb(&evt.value()).unwrap();
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    }
                                },
                                div { class: "row list_row list_row_slim",
                                    label { r#for: "unit_width", "Unit Width ({descriptor.read().style.unit_width})" },
                                    input {
                                        r#type: "range",
                                        name: "unit_width",
                                        min: "20",
                                        max: "80",
                                        step: "5",
                                        value: "{descriptor.read().style.unit_width}",
                                        oninput: move |evt| {
                                            descriptor.write().style.unit_width = evt.value().parse().unwrap();
                                        },
                                        onchange: move |_| {
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    }
                                },
                                div { class: "row list_row list_row_slim",
                                    label { r#for: "dyn_units", "Dynamic Units ({descriptor.read().style.dyn_units})" },
                                    input {
                                        r#type: "range",
                                        name: "dyn_units",
                                        min: "3",
                                        max: "32",
                                        step: "1",
                                        value: "{descriptor.read().style.dyn_units}",
                                        oninput: move |evt| {
                                            descriptor.write().style.dyn_units = evt.value().parse().unwrap();
                                            
                                        },
                                        onchange: move |_| {
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    }
                                }
                            }
                        },
                        div { class: "column flex_item options_column",
                            div { class: "header tab",
                                h3 { "Elements" },
                            },
                            div { class: "options",
                                div { class: "row list_row list_row_slim",
                                    label { r#for: "is_network", "Network Order" },
                                    input {
                                        r#type: "checkbox",
                                        name: "is_network",
                                        checked: descriptor.read().elements.network_order,
                                        onchange: move |evt| {
                                            descriptor.write().elements.network_order = evt.checked();
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    }
                                },
                                div { class: "row list_row list_row_slim",
                                    label { r#for: "inner_subs", "Inner Subtitles" },
                                    input {
                                        r#type: "checkbox",
                                        name: "inner_subs",
                                        checked: descriptor.read().elements.inner_subtitles,
                                        onchange: move |evt| {
                                            descriptor.write().elements.inner_subtitles = evt.checked();
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    }
                                },
                                div { class: "row list_row list_row_slim",
                                    label { r#for: "field_pos", "Field Position" },
                                    input {
                                        r#type: "checkbox",
                                        name: "field_pos",
                                        checked: descriptor.read().elements.field_position,
                                        onchange: move |evt| {
                                            descriptor.write().elements.field_position = evt.checked();
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    }
                                },
                                div { class: "row list_row list_row_slim",
                                    label { r#for: "field_len", "Field Length" },
                                    input {
                                        r#type: "checkbox",
                                        name: "field_len",
                                        checked: descriptor.read().elements.field_length,
                                        onchange: move |evt| {
                                            descriptor.write().elements.field_length = evt.checked();
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    }
                                },
                                div { class: "row list_row list_row_slim",
                                    label { r#for: "wrap_line", "Wrap Line" },
                                    input {
                                        r#type: "checkbox",
                                        name: "wrap_line",
                                        checked: descriptor.read().elements.wrap_line,
                                        onchange: move |evt| {
                                            descriptor.write().elements.wrap_line = evt.checked();
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    }
                                },
                                div { class: "row list_row list_row_slim",
                                    label { r#for: "start_symbol", "Start Symbol" },
                                    input {
                                        r#type: "checkbox",
                                        name: "start_symbol",
                                        checked: descriptor.read().elements.start_symbol,
                                        onchange: move |evt| {
                                            descriptor.write().elements.start_symbol = evt.checked();
                                            *svg_data.write() = update_svg(&descriptor.read());
                                        }
                                    }
                                },
                            }
                        }
                    }
                }
            }
        }
    }
}
