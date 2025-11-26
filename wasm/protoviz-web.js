import { getMetaContents } from './snippets/dioxus-cli-config-e5fab7f8a0eb9fbb/inline0.js';
import { RawInterpreter } from './snippets/dioxus-interpreter-js-267e64abc8a52eaa/inline0.js';
import { setAttributeInner } from './snippets/dioxus-interpreter-js-267e64abc8a52eaa/src/js/set_attribute.js';
import { get_select_data } from './snippets/dioxus-web-807c31b5ece9dd6a/inline0.js';
import { WebDioxusChannel } from './snippets/dioxus-web-807c31b5ece9dd6a/src/js/eval.js';
import * as __wbg_star0 from './snippets/dioxus-interpreter-js-267e64abc8a52eaa/src/js/patch_console.js';

let wasm;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

function passStringToWasm0(arg, malloc, realloc) {

    if (typeof(arg) !== 'string') throw new Error(`expected a string argument, found ${typeof(arg)}`);

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);
        if (ret.read !== arg.length) throw new Error('failed to pass whole string');
        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function _assertBigInt(n) {
    if (typeof(n) !== 'bigint') throw new Error(`expected a bigint argument, found ${typeof(n)}`);
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error(`expected a boolean argument, found ${typeof(n)}`);
    }
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error(`expected a number argument, found ${typeof(n)}`);
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => state.dtor(state.a, state.b));

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            state.dtor(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            state.dtor(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}
function _ZN12wasm_bindgen7convert8closures1_6invoke17h672295912c53585dE(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._ZN12wasm_bindgen7convert8closures1_6invoke17h672295912c53585dE(arg0, arg1, arg2);
}

function _ZN12wasm_bindgen7convert8closures1_6invoke17h07b8eea502b82467E(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._ZN12wasm_bindgen7convert8closures1_6invoke17h07b8eea502b82467E(arg0, arg1);
}

function _ZN12wasm_bindgen7convert8closures1_6invoke17hb400d5e77403ff52E(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._ZN12wasm_bindgen7convert8closures1_6invoke17hb400d5e77403ff52E(arg0, arg1, arg2);
}

function _ZN12wasm_bindgen7convert8closures1_6invoke17hb224fb73184eed06E(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._ZN12wasm_bindgen7convert8closures1_6invoke17hb224fb73184eed06E(arg0, arg1, arg2);
}

function _ZN12wasm_bindgen7convert8closures1_6invoke17hb0aedbcf2e00cdf2E(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._ZN12wasm_bindgen7convert8closures1_6invoke17hb0aedbcf2e00cdf2E(arg0, arg1, arg2);
}

function _ZN12wasm_bindgen7convert8closures1_1_6invoke17h2ae677d0f41eca15E(arg0, arg1, arg2) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._ZN12wasm_bindgen7convert8closures1_1_6invoke17h2ae677d0f41eca15E(arg0, arg1, arg2);
}

function _ZN12wasm_bindgen7convert8closures1_6invoke17h135d7158a74fb20eE(arg0, arg1) {
    _assertNum(arg0);
    _assertNum(arg1);
    const ret = wasm._ZN12wasm_bindgen7convert8closures1_6invoke17h135d7158a74fb20eE(arg0, arg1);
    return ret !== 0;
}

function _ZN12wasm_bindgen7convert8closures1_6invoke17h95190d62b5feb4efE(arg0, arg1, arg2, arg3) {
    _assertNum(arg0);
    _assertNum(arg1);
    wasm._ZN12wasm_bindgen7convert8closures1_6invoke17h95190d62b5feb4efE(arg0, arg1, arg2, arg3);
}

const __wbindgen_enum_ScrollBehavior = ["auto", "instant", "smooth"];

const __wbindgen_enum_ScrollLogicalPosition = ["start", "center", "end", "nearest"];

const __wbindgen_enum_ScrollRestoration = ["auto", "manual"];

const JSOwnerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_jsowner_free(ptr >>> 0, 1));

export class JSOwner {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(JSOwner.prototype);
        obj.__wbg_ptr = ptr;
        JSOwnerFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        JSOwnerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsowner_free(ptr, 0);
    }
}
if (Symbol.dispose) JSOwner.prototype[Symbol.dispose] = JSOwner.prototype.free;

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_Error_e83987f665cf5504 = function() { return logError(function (arg0, arg1) {
        const ret = Error(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_String_8f0eb39a4a4c2f66 = function() { return logError(function (arg0, arg1) {
        const ret = String(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg___wbindgen_bigint_get_as_i64_f3ebc5a755000afd = function(arg0, arg1) {
        const v = arg1;
        const ret = typeof(v) === 'bigint' ? v : undefined;
        if (!isLikeNone(ret)) {
            _assertBigInt(ret);
        }
        getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbg___wbindgen_boolean_get_6d5a1ee65bab5f68 = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? v : undefined;
        if (!isLikeNone(ret)) {
            _assertBoolean(ret);
        }
        return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
    };
    imports.wbg.__wbg___wbindgen_debug_string_df47ffb5e35e6763 = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg___wbindgen_exports_49fc9ef20d936c88 = function() {
        const ret = wasm;
        return ret;
    };
    imports.wbg.__wbg___wbindgen_function_table_cc7e33c00e7c1206 = function() {
        const ret = wasm.__wbindgen_export;
        return ret;
    };
    imports.wbg.__wbg___wbindgen_in_bb933bd9e1b3bc0f = function(arg0, arg1) {
        const ret = arg0 in arg1;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_bigint_cb320707dcd35f0b = function(arg0) {
        const ret = typeof(arg0) === 'bigint';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_function_ee8a6c5833c90377 = function(arg0) {
        const ret = typeof(arg0) === 'function';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_object_c818261d21f283a4 = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_string_fbb76cb2940daafd = function(arg0) {
        const ret = typeof(arg0) === 'string';
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_is_undefined_2d472862bd29a478 = function(arg0) {
        const ret = arg0 === undefined;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_jsval_eq_6b13ab83478b1c50 = function(arg0, arg1) {
        const ret = arg0 === arg1;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_jsval_loose_eq_b664b38a2f582147 = function(arg0, arg1) {
        const ret = arg0 == arg1;
        _assertBoolean(ret);
        return ret;
    };
    imports.wbg.__wbg___wbindgen_memory_27faa6e0e73716bd = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbg___wbindgen_number_get_a20bf9b85341449d = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        if (!isLikeNone(ret)) {
            _assertNum(ret);
        }
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbg___wbindgen_string_get_e4f06c90489ad01b = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg___wbindgen_throw_b855445ff6a94295 = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg__wbg_cb_unref_2454a539ea5790d9 = function() { return logError(function (arg0) {
        arg0._wbg_cb_unref();
    }, arguments) };
    imports.wbg.__wbg_addEventListener_7a418931447b2eae = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_alert_d3cd45b8012d46c7 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.alert(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_altKey_1afb1a12d93938b0 = function() { return logError(function (arg0) {
        const ret = arg0.altKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_altKey_9197d08820dda2ae = function() { return logError(function (arg0) {
        const ret = arg0.altKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_altKey_ab1e889cd83cf088 = function() { return logError(function (arg0) {
        const ret = arg0.altKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_animationName_0808e655eec89630 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.animationName;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_appendChild_aec7a8a4bd6cac61 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.appendChild(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_arrayBuffer_5930938a049abc90 = function() { return logError(function (arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_arrayBuffer_b375eccb84b4ddf3 = function() { return handleError(function (arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_back_20a82c084a25ed83 = function() { return handleError(function (arg0) {
        arg0.back();
    }, arguments) };
    imports.wbg.__wbg_blockSize_f20a7ec2c5bcce10 = function() { return logError(function (arg0) {
        const ret = arg0.blockSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_blur_8d22d76019f9d6a0 = function() { return handleError(function (arg0) {
        arg0.blur();
    }, arguments) };
    imports.wbg.__wbg_body_8c26b54829a0c4cb = function() { return logError(function (arg0) {
        const ret = arg0.body;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_borderBoxSize_5ef3cd4a3748921a = function() { return logError(function (arg0) {
        const ret = arg0.borderBoxSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_boundingClientRect_f70d116825c0b83e = function() { return logError(function (arg0) {
        const ret = arg0.boundingClientRect;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_bubbles_f8ef5186046e39ae = function() { return logError(function (arg0) {
        const ret = arg0.bubbles;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buffer_83ef46cd84885a60 = function() { return logError(function (arg0) {
        const ret = arg0.buffer;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buffer_ccc4520b36d3ccf4 = function() { return logError(function (arg0) {
        const ret = arg0.buffer;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_button_cd095d6d829d3270 = function() { return logError(function (arg0) {
        const ret = arg0.button;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_buttons_d85fdbc554f20017 = function() { return logError(function (arg0) {
        const ret = arg0.buttons;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_byteLength_eb3438154e05658e = function() { return logError(function (arg0) {
        const ret = arg0.byteLength;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_525440f72fbfc0ea = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_e762c39fa8ea36bf = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_changedTouches_42c07e8d12d1bbcc = function() { return logError(function (arg0) {
        const ret = arg0.changedTouches;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_charCodeAt_291b921e27833f8e = function() { return logError(function (arg0, arg1) {
        const ret = arg0.charCodeAt(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_checkValidity_deb26b5fa57a7f78 = function() { return logError(function (arg0) {
        const ret = arg0.checkValidity();
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_checked_385e7aee6e569db9 = function() { return logError(function (arg0) {
        const ret = arg0.checked;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clearData_84efa422a6aea502 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.clearData(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_clearData_b78b13020032f1f2 = function() { return handleError(function (arg0) {
        arg0.clearData();
    }, arguments) };
    imports.wbg.__wbg_clearTimeout_5a54f8841c30079a = function() { return logError(function (arg0) {
        const ret = clearTimeout(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_click_b7f7dcb2842a8754 = function() { return logError(function (arg0) {
        arg0.click();
    }, arguments) };
    imports.wbg.__wbg_clientHeight_03b616d39b2ab49d = function() { return logError(function (arg0) {
        const ret = arg0.clientHeight;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clientWidth_8379f04ef4ca9040 = function() { return logError(function (arg0) {
        const ret = arg0.clientWidth;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clientX_1166635f13c2a22e = function() { return logError(function (arg0) {
        const ret = arg0.clientX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clientX_97c1ab5b7abf71d4 = function() { return logError(function (arg0) {
        const ret = arg0.clientX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clientY_6b2560a0984b55af = function() { return logError(function (arg0) {
        const ret = arg0.clientY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_clientY_d0eab302753c17d9 = function() { return logError(function (arg0) {
        const ret = arg0.clientY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_code_08c1919c85e18f9d = function() { return logError(function (arg0, arg1) {
        const ret = arg1.code;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_code_20d453b11b200026 = function() { return logError(function (arg0) {
        const ret = arg0.code;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_contentBoxSize_554560be57215ee6 = function() { return logError(function (arg0) {
        const ret = arg0.contentBoxSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createComment_813fd28a7ca9d732 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.createComment(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createElementNS_78de14b111af2832 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.createElementNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createElement_964ab674a0176cd8 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createObjectURL_6c6dec873acec30b = function() { return handleError(function (arg0, arg1) {
        const ret = URL.createObjectURL(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_createTask_9ac11a42c24ef284 = function() { return handleError(function (arg0, arg1) {
        const ret = console.createTask(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createTextNode_d36767f8fcba8973 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.createTextNode(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_ctrlKey_5621e1a6fd6decc2 = function() { return logError(function (arg0) {
        const ret = arg0.ctrlKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_ctrlKey_566441f821ad6b91 = function() { return logError(function (arg0) {
        const ret = arg0.ctrlKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_ctrlKey_c983829d0035e680 = function() { return logError(function (arg0) {
        const ret = arg0.ctrlKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_dataTransfer_ac196d77762b90f5 = function() { return logError(function (arg0) {
        const ret = arg0.dataTransfer;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_data_375e6b6c9e4e372b = function() { return logError(function (arg0, arg1) {
        const ret = arg1.data;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_data_ee4306d069f24f2d = function() { return logError(function (arg0) {
        const ret = arg0.data;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_deltaMode_07ce5244f9725729 = function() { return logError(function (arg0) {
        const ret = arg0.deltaMode;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_deltaX_52dbec35cfc88ef2 = function() { return logError(function (arg0) {
        const ret = arg0.deltaX;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_deltaY_533a14decfb96f6b = function() { return logError(function (arg0) {
        const ret = arg0.deltaY;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_deltaZ_61cc5a5b288d23b9 = function() { return logError(function (arg0) {
        const ret = arg0.deltaZ;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_detail_a1e0dae890dc998d = function() { return logError(function (arg0) {
        const ret = arg0.detail;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_documentElement_7679895b140c1fbd = function() { return logError(function (arg0) {
        const ret = arg0.documentElement;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_document_725ae06eb442a6db = function() { return logError(function (arg0) {
        const ret = arg0.document;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_done_2042aa2670fb1db1 = function() { return logError(function (arg0) {
        const ret = arg0.done;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_dropEffect_3396f8286e8969a9 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.dropEffect;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_effectAllowed_24de23e35b06c689 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.effectAllowed;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_elapsedTime_84c139fa361bf3c2 = function() { return logError(function (arg0) {
        const ret = arg0.elapsedTime;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_elapsedTime_e757da95ff217552 = function() { return logError(function (arg0) {
        const ret = arg0.elapsedTime;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_entries_c5ab92107ae520b5 = function() { return logError(function (arg0) {
        const ret = arg0.entries();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_entries_e171b586f8f6bdbf = function() { return logError(function (arg0) {
        const ret = Object.entries(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_error_7fb1503fba2b1cf6 = function() { return logError(function (arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_error_a7f8fbb0523dae15 = function() { return logError(function (arg0) {
        console.error(arg0);
    }, arguments) };
    imports.wbg.__wbg_eval_89be3645cf120ed3 = function() { return handleError(function (arg0, arg1) {
        const ret = eval(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_fetch_cf02cfa16eaaaae8 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.fetch(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_files_b3322d9a4bdc60ef = function() { return logError(function (arg0) {
        const ret = arg0.files;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_files_fa5e206b28f24ddc = function() { return logError(function (arg0) {
        const ret = arg0.files;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_focus_f18e304f287a2dd3 = function() { return handleError(function (arg0) {
        arg0.focus();
    }, arguments) };
    imports.wbg.__wbg_force_eb1a0ff68a50a61d = function() { return logError(function (arg0) {
        const ret = arg0.force;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_forward_515d76914849af0e = function() { return handleError(function (arg0) {
        arg0.forward();
    }, arguments) };
    imports.wbg.__wbg_getAsFile_84dc9fd7ecaa3d20 = function() { return handleError(function (arg0) {
        const ret = arg0.getAsFile();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getAttribute_a0d65fabc2f0d559 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.getAttribute(getStringFromWasm0(arg2, arg3));
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_getBoundingClientRect_eb2f68e504025fb4 = function() { return logError(function (arg0) {
        const ret = arg0.getBoundingClientRect();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getData_3788e2545bd763f8 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.getData(getStringFromWasm0(arg2, arg3));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_getElementById_c365dd703c4a88c3 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getMetaContents_b992706b68d86a75 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = getMetaContents(getStringFromWasm0(arg1, arg2));
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_getNode_1586e634eb98d0e8 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.getNode(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getTime_14776bfb48a1bff9 = function() { return logError(function (arg0) {
        const ret = arg0.getTime();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getTimezoneOffset_d391cb11d54969f8 = function() { return logError(function (arg0) {
        const ret = arg0.getTimezoneOffset();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_3069852592aa5a9c = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_get_6657bdb7125f55e6 = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_get_7bed016f185add81 = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_e87449b189af3c78 = function() { return logError(function (arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_get_efcb449f58ec27c2 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_select_data_56101cc94891dace = function() { return logError(function (arg0, arg1) {
        const ret = get_select_data(arg1);
        const ptr1 = passArrayJsValueToWasm0(ret, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_grow_b1c62042ef3a93d9 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.grow(arg1 >>> 0);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_grow_f8ff562147b57eb1 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.grow(arg1 >>> 0);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_hash_2aa6a54fb8342cef = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.hash;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_head_9cc5af7a8c996fad = function() { return logError(function (arg0) {
        const ret = arg0.head;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_height_4ec1d9540f62ef0a = function() { return logError(function (arg0) {
        const ret = arg0.height;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_height_5d040431806ee14e = function() { return logError(function (arg0) {
        const ret = arg0.height;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_height_ba3edd16b1f48a4a = function() { return logError(function (arg0) {
        const ret = arg0.height;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_history_bf649e08118bb039 = function() { return handleError(function (arg0) {
        const ret = arg0.history;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_host_42828f818b9dc26c = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.host;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_identifier_62287c55f12f8d26 = function() { return logError(function (arg0) {
        const ret = arg0.identifier;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_initialize_85ebb02ae491b77d = function() { return logError(function (arg0, arg1, arg2) {
        arg0.initialize(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_inlineSize_917f52e805414525 = function() { return logError(function (arg0) {
        const ret = arg0.inlineSize;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_ArrayBuffer_70beb1189ca63b38 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Blob_23b3322f66e5a83b = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Blob;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Document_c741de15f1a592fa = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Document;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_DragEvent_ac7586eed83b91a2 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof DragEvent;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Element_437534ce3e96fe49 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Element;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_File_b7e4dbeba5bb2cd0 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof File;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlElement_e20a729df22f9e1c = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlFormElement_4d0725782bc3375c = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLFormElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlIFrameElement_73b52c32302f7690 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLIFrameElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlInputElement_b8672abb32fe4ab7 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLInputElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlSelectElement_6b571cc4aa3fe771 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLSelectElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlTextAreaElement_743907ba80ca20b2 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLTextAreaElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Map_8579b5e2ab5437c7 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Map;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Node_80ed745e9f9b24e4 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Node;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Object_10bb762262230c68 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Object;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Uint8Array_20c8e73002f7af98 = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_Window_4846dbb3de56c84c = function() { return logError(function (arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instantiate_7fd09dd759aa2158 = function() { return logError(function (arg0, arg1) {
        const ret = WebAssembly.instantiate(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_intersectionRatio_0818a6e1df8b5fe8 = function() { return logError(function (arg0) {
        const ret = arg0.intersectionRatio;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_intersectionRect_395c4c442b52130b = function() { return logError(function (arg0) {
        const ret = arg0.intersectionRect;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isArray_96e0af9891d0945d = function() { return logError(function (arg0) {
        const ret = Array.isArray(arg0);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isComposing_880aefe4b7c1f188 = function() { return logError(function (arg0) {
        const ret = arg0.isComposing;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isIntersecting_434c47c6eae1495c = function() { return logError(function (arg0) {
        const ret = arg0.isIntersecting;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isPrimary_5d01ddcd71552576 = function() { return logError(function (arg0) {
        const ret = arg0.isPrimary;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isSafeInteger_d216eda7911dde36 = function() { return logError(function (arg0) {
        const ret = Number.isSafeInteger(arg0);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_item_e0cfb7db1926e7dd = function() { return logError(function (arg0, arg1) {
        const ret = arg0.item(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_items_6f6ee442137b5379 = function() { return logError(function (arg0) {
        const ret = arg0.items;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_iterator_e5822695327a3c39 = function() { return logError(function () {
        const ret = Symbol.iterator;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_key_32aa43e1cae08d29 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.key;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_keys_b4d27b02ad14f4be = function() { return logError(function (arg0) {
        const ret = Object.keys(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_kind_c8e7a7f279f05ef8 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.kind;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_lastModified_8a42a70c9d48f5d1 = function() { return logError(function (arg0) {
        const ret = arg0.lastModified;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_left_899de713c50d5346 = function() { return logError(function (arg0) {
        const ret = arg0.left;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_69bca3cb64fc8748 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_7ac941be82f614bb = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_7b84328ffb2e7b44 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_84d8751e9d1868a5 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_a95b69f903b746c4 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_cdd215e10d9dd507 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_length_dc1fcbb3c4169df7 = function() { return logError(function (arg0) {
        const ret = arg0.length;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_location_d199d70225b79bbc = function() { return logError(function (arg0) {
        const ret = arg0.location;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_location_ef1665506d996dd9 = function() { return logError(function (arg0) {
        const ret = arg0.location;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_log_0cc1b7768397bcfe = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.log(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_log_cb9e190acc5753fb = function() { return logError(function (arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.log(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_mark_7438147ce31e9d4b = function() { return logError(function (arg0, arg1) {
        performance.mark(getStringFromWasm0(arg0, arg1));
    }, arguments) };
    imports.wbg.__wbg_measure_fb7825c11612c823 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        let deferred0_0;
        let deferred0_1;
        let deferred1_0;
        let deferred1_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            deferred1_0 = arg2;
            deferred1_1 = arg3;
            performance.measure(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_metaKey_455415b74e8724f0 = function() { return logError(function (arg0) {
        const ret = arg0.metaKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_metaKey_5e1cfce6326629a8 = function() { return logError(function (arg0) {
        const ret = arg0.metaKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_metaKey_a1cde9a816929936 = function() { return logError(function (arg0) {
        const ret = arg0.metaKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_name_2922909227d511f5 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.name;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_name_d871cf2c5271c34a = function() { return logError(function (arg0, arg1) {
        const ret = arg1.name;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_new_0_f9740686d739025c = function() { return logError(function () {
        const ret = new Date();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_1acc0b6eea89d040 = function() { return logError(function () {
        const ret = new Object();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_264dbec33b8d1ae7 = function() { return handleError(function () {
        const ret = new DataTransfer();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_3c3d849046688a66 = function() { return logError(function (arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return _ZN12wasm_bindgen7convert8closures1_6invoke17h95190d62b5feb4efE(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    }, arguments) };
    imports.wbg.__wbg_new_5a79be3ab53b8aa5 = function() { return logError(function (arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_68651c719dcda04e = function() { return logError(function () {
        const ret = new Map();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_881c4fe631eee9ad = function() { return handleError(function (arg0, arg1) {
        const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_8877f0fdb78fd48d = function() { return handleError(function () {
        const ret = new FileReader();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_93d9417ed3fb115d = function() { return logError(function (arg0) {
        const ret = new Date(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_9b6224a5e43bef40 = function() { return logError(function () {
        const ret = new Error();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_b5668af12fa1c399 = function() { return logError(function (arg0) {
        const ret = new RawInterpreter(arg0 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_bd77e24c418ec9b3 = function() { return handleError(function (arg0, arg1) {
        const ret = new WebAssembly.Global(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_e17d9f43105b08be = function() { return logError(function () {
        const ret = new Array();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_efe83f8fe74fae63 = function() { return logError(function (arg0) {
        const ret = new WebDioxusChannel(JSOwner.__wrap(arg0));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_from_slice_92f4d78ca282a2d2 = function() { return logError(function (arg0, arg1) {
        const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_no_args_ee98eee5275000a4 = function() { return logError(function (arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_with_args_02cbc439ce3fd7db = function() { return logError(function (arg0, arg1, arg2, arg3) {
        const ret = new Function(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_with_form_8b3616b0fccfbfce = function() { return handleError(function (arg0) {
        const ret = new FormData(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_with_u8_array_sequence_and_options_0c1d0bd56d93d25a = function() { return handleError(function (arg0, arg1) {
        const ret = new Blob(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_020810e0ae8ebcb0 = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_next_2c826fe5dfec6b6a = function() { return logError(function (arg0) {
        const ret = arg0.next;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_offsetX_4bd247aa56ff346f = function() { return logError(function (arg0) {
        const ret = arg0.offsetX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_offsetY_2edf7781ad0674a1 = function() { return logError(function (arg0) {
        const ret = arg0.offsetY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_ok_5749966cb2b8535e = function() { return logError(function (arg0) {
        const ret = arg0.ok;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_ownerDocument_97467e60bac98081 = function() { return logError(function (arg0) {
        const ret = arg0.ownerDocument;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_pageX_e04b9e80a33764bb = function() { return logError(function (arg0) {
        const ret = arg0.pageX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_pageX_f7fbfe584fac577c = function() { return logError(function (arg0) {
        const ret = arg0.pageX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_pageY_03aaf381e3f7c742 = function() { return logError(function (arg0) {
        const ret = arg0.pageY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_pageY_7d4ee55c76495977 = function() { return logError(function (arg0) {
        const ret = arg0.pageY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_parentElement_cd50d7fc96356492 = function() { return logError(function (arg0) {
        const ret = arg0.parentElement;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_pathname_64db68c363ed9ab1 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.pathname;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_pointerId_e2ed3a97cf912a58 = function() { return logError(function (arg0) {
        const ret = arg0.pointerId;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_pointerType_deb5719d69581038 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.pointerType;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_pressure_979a5de3808728d0 = function() { return logError(function (arg0) {
        const ret = arg0.pressure;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_preventDefault_1f362670ce7ef430 = function() { return logError(function (arg0) {
        arg0.preventDefault();
    }, arguments) };
    imports.wbg.__wbg_propertyName_8e6b57181fbd79d1 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.propertyName;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_protocol_3fa0fc2db8145bfb = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.protocol;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_prototypesetcall_2a6620b6922694b2 = function() { return logError(function (arg0, arg1, arg2) {
        Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
    }, arguments) };
    imports.wbg.__wbg_pseudoElement_09b78cf098e0deb1 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.pseudoElement;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_pseudoElement_8d739563b3960399 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.pseudoElement;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_pushState_0189199a2abc6ca2 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.pushState(arg1, getStringFromWasm0(arg2, arg3), arg4 === 0 ? undefined : getStringFromWasm0(arg4, arg5));
    }, arguments) };
    imports.wbg.__wbg_push_df81a39d04db858c = function() { return logError(function (arg0, arg1) {
        const ret = arg0.push(arg1);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_querySelectorAll_e1a6c50956fdb6a2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.querySelectorAll(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_34d692c25c47d05b = function() { return logError(function (arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_9d76cacb20c84d58 = function() { return logError(function (arg0) {
        queueMicrotask(arg0);
    }, arguments) };
    imports.wbg.__wbg_radiusX_afae0135ee3ac26c = function() { return logError(function (arg0) {
        const ret = arg0.radiusX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_radiusY_50410a224bd9a013 = function() { return logError(function (arg0) {
        const ret = arg0.radiusY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_random_babe96ffc73e60a2 = function() { return logError(function () {
        const ret = Math.random();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_readAsArrayBuffer_5c4a07e9a73655a8 = function() { return handleError(function (arg0, arg1) {
        arg0.readAsArrayBuffer(arg1);
    }, arguments) };
    imports.wbg.__wbg_readAsText_e28027b7dfff1256 = function() { return handleError(function (arg0, arg1) {
        arg0.readAsText(arg1);
    }, arguments) };
    imports.wbg.__wbg_reload_d4d4530886435319 = function() { return handleError(function (arg0) {
        arg0.reload();
    }, arguments) };
    imports.wbg.__wbg_removeChild_d50f6c79984abd06 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.removeChild(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_repeat_e07ac42a0fa905a3 = function() { return logError(function (arg0) {
        const ret = arg0.repeat;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_replaceState_7f1e98a37cbc7559 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.replaceState(arg1, getStringFromWasm0(arg2, arg3), arg4 === 0 ? undefined : getStringFromWasm0(arg4, arg5));
    }, arguments) };
    imports.wbg.__wbg_requestAnimationFrame_7ecf8bfece418f08 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.requestAnimationFrame(arg1);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_resolve_caf97c30b83f7053 = function() { return logError(function (arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_result_f97bdbdd536e2ab7 = function() { return handleError(function (arg0) {
        const ret = arg0.result;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_rootBounds_728fddf373be6f15 = function() { return logError(function (arg0) {
        const ret = arg0.rootBounds;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_rotationAngle_89488273c91417e2 = function() { return logError(function (arg0) {
        const ret = arg0.rotationAngle;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_run_e5e1ecccf06974b2 = function() { return logError(function (arg0, arg1, arg2) {
        try {
            var state0 = {a: arg1, b: arg2};
            var cb0 = () => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return _ZN12wasm_bindgen7convert8closures1_6invoke17h135d7158a74fb20eE(a, state0.b, );
                } finally {
                    state0.a = a;
                }
            };
            const ret = arg0.run(cb0);
            _assertBoolean(ret);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    }, arguments) };
    imports.wbg.__wbg_run_f514522c17ede007 = function() { return logError(function (arg0) {
        arg0.run();
    }, arguments) };
    imports.wbg.__wbg_rustRecv_eee9572db82d5d20 = function() { return logError(function (arg0) {
        const ret = arg0.rustRecv();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_rustSend_b3452ec85fd4c7de = function() { return logError(function (arg0, arg1) {
        arg0.rustSend(arg1);
    }, arguments) };
    imports.wbg.__wbg_saveTemplate_a492d3edc24f61e2 = function() { return logError(function (arg0, arg1, arg2, arg3) {
        var v0 = getArrayJsValueFromWasm0(arg1, arg2).slice();
        wasm.__wbindgen_free(arg1, arg2 * 4, 4);
        arg0.saveTemplate(v0, arg3);
    }, arguments) };
    imports.wbg.__wbg_screenX_933f3170d4c96370 = function() { return logError(function (arg0) {
        const ret = arg0.screenX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_screenX_c1e2bc918641a856 = function() { return logError(function (arg0) {
        const ret = arg0.screenX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_screenY_a35a1ced7bf30d24 = function() { return logError(function (arg0) {
        const ret = arg0.screenY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_screenY_f4877164c1bcbf72 = function() { return logError(function (arg0) {
        const ret = arg0.screenY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scrollHeight_9520845d7d357ac4 = function() { return logError(function (arg0) {
        const ret = arg0.scrollHeight;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scrollIntoView_8dbb6024889d2f4a = function() { return logError(function (arg0, arg1) {
        arg0.scrollIntoView(arg1);
    }, arguments) };
    imports.wbg.__wbg_scrollLeft_f93df4741cd1cb2b = function() { return logError(function (arg0) {
        const ret = arg0.scrollLeft;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scrollTo_3ba9fecedac26abd = function() { return logError(function (arg0, arg1, arg2) {
        arg0.scrollTo(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_scrollTop_c8c11d10202a7190 = function() { return logError(function (arg0) {
        const ret = arg0.scrollTop;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scrollWidth_0b8d48222007c266 = function() { return logError(function (arg0) {
        const ret = arg0.scrollWidth;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scrollX_b44e96f475473dee = function() { return handleError(function (arg0) {
        const ret = arg0.scrollX;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scrollY_a11d3ce67776f8e1 = function() { return handleError(function (arg0) {
        const ret = arg0.scrollY;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_scroll_0783c9d258ed5220 = function() { return logError(function (arg0, arg1) {
        arg0.scroll(arg1);
    }, arguments) };
    imports.wbg.__wbg_search_86f864580e97479d = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.search;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_setAttributeInner_348387774c4e85cc = function() { return logError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        setAttributeInner(arg0, getStringFromWasm0(arg1, arg2), arg3, arg4 === 0 ? undefined : getStringFromWasm0(arg4, arg5));
    }, arguments) };
    imports.wbg.__wbg_setAttribute_9bad76f39609daac = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setData_f94e11b461ce0cfe = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setData(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setProperty_7b188d7e71d4aca8 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setTimeout_780ac15e3df4c663 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.setTimeout(arg1, arg2);
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setTimeout_db2dbaeefb6f39c7 = function() { return handleError(function (arg0, arg1) {
        const ret = setTimeout(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_3f1d0b984ed272ed = function() { return logError(function (arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    }, arguments) };
    imports.wbg.__wbg_set_907fb406c34a251d = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.set(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_behavior_750f1b1b393189f7 = function() { return logError(function (arg0, arg1) {
        arg0.behavior = __wbindgen_enum_ScrollBehavior[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_behavior_e4981c0eb24abdcc = function() { return logError(function (arg0, arg1) {
        arg0.behavior = __wbindgen_enum_ScrollBehavior[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_block_d9e0e11dae027066 = function() { return logError(function (arg0, arg1) {
        arg0.block = __wbindgen_enum_ScrollLogicalPosition[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_c213c871859d6500 = function() { return logError(function (arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    }, arguments) };
    imports.wbg.__wbg_set_c2abbebe8b9ebee1 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_dropEffect_695fce78e97010c3 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.dropEffect = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_effectAllowed_8f42bd93aef9980c = function() { return logError(function (arg0, arg1, arg2) {
        arg0.effectAllowed = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_href_5ef0faaa3d2eab0d = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.href = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_inline_6960bb5112dd818a = function() { return logError(function (arg0, arg1) {
        arg0.inline = __wbindgen_enum_ScrollLogicalPosition[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_left_4d9452757fe2e7fb = function() { return logError(function (arg0, arg1) {
        arg0.left = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onclose_c09e4f7422de8dae = function() { return logError(function (arg0, arg1) {
        arg0.onclose = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onload_e1aadd996e755e9c = function() { return logError(function (arg0, arg1) {
        arg0.onload = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onmessage_8661558551a89792 = function() { return logError(function (arg0, arg1) {
        arg0.onmessage = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_onopen_efccb9305427b907 = function() { return logError(function (arg0, arg1) {
        arg0.onopen = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_scrollRestoration_2995c6cbd698068e = function() { return handleError(function (arg0, arg1) {
        arg0.scrollRestoration = __wbindgen_enum_ScrollRestoration[arg1];
    }, arguments) };
    imports.wbg.__wbg_set_srcdoc_408576814f51d97e = function() { return logError(function (arg0, arg1, arg2) {
        arg0.srcdoc = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_textContent_12af0b0f84feb710 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.textContent = arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_set_top_fdc92c16b1529d88 = function() { return logError(function (arg0, arg1) {
        arg0.top = arg1;
    }, arguments) };
    imports.wbg.__wbg_set_type_63fa4c18251f6545 = function() { return logError(function (arg0, arg1, arg2) {
        arg0.type = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_shiftKey_02a93ca3ce31a4f4 = function() { return logError(function (arg0) {
        const ret = arg0.shiftKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_shiftKey_47e95d448080dc0e = function() { return logError(function (arg0) {
        const ret = arg0.shiftKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_shiftKey_e0b189884cc0d006 = function() { return logError(function (arg0) {
        const ret = arg0.shiftKey;
        _assertBoolean(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_size_0a5a003dbf5dfee8 = function() { return logError(function (arg0) {
        const ret = arg0.size;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_stack_65e90b10c5412189 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_state_9f444e82026e687d = function() { return handleError(function (arg0) {
        const ret = arg0.state;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_static_accessor_GLOBAL_89e1d9ac6a1b250e = function() { return logError(function () {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_8b530f326a9e48ac = function() { return logError(function () {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_SELF_6fdf4b64710cc91b = function() { return logError(function () {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_static_accessor_WINDOW_b45bfc5a37f6cfa2 = function() { return logError(function () {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_statusText_f84c3ce029ec4040 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.statusText;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_stringify_b5fb28f6465d9c3e = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_style_763a7ccfd47375da = function() { return logError(function (arg0) {
        const ret = arg0.style;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_tangentialPressure_e61c1a5bd9e825be = function() { return logError(function (arg0) {
        const ret = arg0.tangentialPressure;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_targetTouches_869fa0f345903b9f = function() { return logError(function (arg0) {
        const ret = arg0.targetTouches;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_target_1447f5d3a6fa6fe0 = function() { return logError(function (arg0) {
        const ret = arg0.target;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_textContent_5f62e83b3244a091 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.textContent;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_then_4f46f6544e6b4a28 = function() { return logError(function (arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_then_70d05cf780a18d77 = function() { return logError(function (arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_tiltX_cffd6ff5ad2c3d41 = function() { return logError(function (arg0) {
        const ret = arg0.tiltX;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_tiltY_750e9b331778be10 = function() { return logError(function (arg0) {
        const ret = arg0.tiltY;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_time_41fde8c76d1339ea = function() { return logError(function (arg0) {
        const ret = arg0.time;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_top_e4eeead6b19051fb = function() { return logError(function (arg0) {
        const ret = arg0.top;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_touches_bec8a0e164b02c16 = function() { return logError(function (arg0) {
        const ret = arg0.touches;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_twist_9c59ea21c186ba3e = function() { return logError(function (arg0) {
        const ret = arg0.twist;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_type_34f8b5fab1df4985 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_type_6ec4563941c672e4 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_type_d5d4dbe840f65b14 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_update_memory_dfeeaac636c0fe13 = function() { return logError(function (arg0, arg1) {
        arg0.update_memory(arg1);
    }, arguments) };
    imports.wbg.__wbg_value_18a0f1c3623b964f = function() { return logError(function (arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_value_692627309814bb8c = function() { return logError(function (arg0) {
        const ret = arg0.value;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_value_998b2dfe93506065 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_value_f470db44e5a60ad8 = function() { return logError(function (arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_weak_95f1d4c4d5fddc92 = function() { return logError(function (arg0) {
        const ret = arg0.weak();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_width_9454dd4813cef036 = function() { return logError(function (arg0) {
        const ret = arg0.width;
        _assertNum(ret);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_width_cd308a6e89422ce8 = function() { return logError(function (arg0) {
        const ret = arg0.width;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_width_d02e5c8cc6e335b7 = function() { return logError(function (arg0) {
        const ret = arg0.width;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_x_8bfc286ecbf6dc99 = function() { return logError(function (arg0) {
        const ret = arg0.x;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_y_68281a8e7cf6f00d = function() { return logError(function (arg0) {
        const ret = arg0.y;
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_04efd53660026700 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 644, function: Function { arguments: [Ref(NamedExternref("Event"))], shim_idx: 645, ret: Unit, inner_ret: Some(Unit) }, mutable: false }) -> Externref`.
        const ret = makeClosure(arg0, arg1, wasm._ZN12wasm_bindgen7closure7destroy17hac507b12d4b9642cE, _ZN12wasm_bindgen7convert8closures1_1_6invoke17h2ae677d0f41eca15E);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Ref(String) -> Externref`.
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_300a500de1ebb1f7 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 1233, function: Function { arguments: [Externref], shim_idx: 1234, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm._ZN12wasm_bindgen7closure7destroy17h881ec164d59bacc4E, _ZN12wasm_bindgen7convert8closures1_6invoke17hb0aedbcf2e00cdf2E);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_4625c577ab2ec9ee = function() { return logError(function (arg0) {
        // Cast intrinsic for `U64 -> Externref`.
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_468562b062cdc599 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 653, function: Function { arguments: [NamedExternref("Event")], shim_idx: 654, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm._ZN12wasm_bindgen7closure7destroy17h5a0624520a14d392E, _ZN12wasm_bindgen7convert8closures1_6invoke17h672295912c53585dE);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_4a3804d46b3517a5 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 900, function: Function { arguments: [], shim_idx: 901, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm._ZN12wasm_bindgen7closure7destroy17h4e29eecb1ce068ffE, _ZN12wasm_bindgen7convert8closures1_6invoke17h07b8eea502b82467E);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_55acd15a24dba1d6 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 650, function: Function { arguments: [NamedExternref("MessageEvent")], shim_idx: 651, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm._ZN12wasm_bindgen7closure7destroy17hbd8901086dea6cc6E, _ZN12wasm_bindgen7convert8closures1_6invoke17hb400d5e77403ff52E);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_9ae0607507abb057 = function() { return logError(function (arg0) {
        // Cast intrinsic for `I64 -> Externref`.
        const ret = arg0;
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_ccf3e2f88b0cd3e8 = function() { return logError(function (arg0, arg1) {
        // Cast intrinsic for `Closure(Closure { dtor_idx: 647, function: Function { arguments: [NamedExternref("CloseEvent")], shim_idx: 648, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
        const ret = makeMutClosure(arg0, arg1, wasm._ZN12wasm_bindgen7closure7destroy17h40338cbf6ecaa307E, _ZN12wasm_bindgen7convert8closures1_6invoke17hb224fb73184eed06E);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_cast_d6cd19b81560fd6e = function() { return logError(function (arg0) {
        // Cast intrinsic for `F64 -> Externref`.
        const ret = arg0;
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports['./snippets/dioxus-interpreter-js-267e64abc8a52eaa/src/js/patch_console.js'] = __wbg_star0;

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('protoviz-web_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;

globalThis.__wasm_split_main_initSync = initSync;

// Actually perform the load
__wbg_init({module_or_path: "/protoviz_web/wasm/protoviz-web_bg.wasm"}).then((wasm) => {
    // assign this module to be accessible globally
    globalThis.__dx_mainWasm = wasm;
    globalThis.__dx_mainInit = __wbg_init;
    globalThis.__dx_mainInitSync = initSync;
    globalThis.__dx___wbg_get_imports = __wbg_get_imports;

    if (wasm.__wbindgen_start == undefined) {
        wasm.main();
    }
});

