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
/**
 * Get SDK version
 * @returns {string}
 */
export function sdk_version() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.sdk_version();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
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

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
 * Standalone validate function
 * @param {string} yaml_content
 * @returns {boolean}
 */
export function validate_faf(yaml_content) {
    const ptr0 = passStringToWasm0(yaml_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.faf_validate(ptr0, len0);
    return ret !== 0;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
/**
 * Standalone score function - returns JSON
 * @param {string} yaml_content
 * @returns {string}
 */
export function score_faf(yaml_content) {
    let deferred3_0;
    let deferred3_1;
    try {
        const ptr0 = passStringToWasm0(yaml_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.score_faf(ptr0, len0);
        var ptr2 = ret[0];
        var len2 = ret[1];
        if (ret[3]) {
            ptr2 = 0; len2 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
    }
}

let cachedFloat32ArrayMemory0 = null;

function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getFloat32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * @param {Float32Array} weights
 * @param {number} base
 * @returns {number}
 */
export function score_weights(weights, base) {
    const ptr0 = passArrayF32ToWasm0(weights, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.score_weights(ptr0, len0, base);
    return ret;
}

/**
 * @param {Float32Array} weights
 * @param {Float32Array} values
 * @returns {number}
 */
export function score_weights_fast(weights, values) {
    const ptr0 = passArrayF32ToWasm0(weights, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF32ToWasm0(values, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.score_weights_fast(ptr0, len0, ptr1, len1);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
/**
 * Generate metadata-only .faf for private repos (when README/package.json unavailable)
 * @param {string} repo_name
 * @param {string} owner
 * @param {string | null} [description]
 * @param {string | null} [language]
 * @returns {string}
 */
export function generate_faf_minimal(repo_name, owner, description, language) {
    let deferred6_0;
    let deferred6_1;
    try {
        const ptr0 = passStringToWasm0(repo_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(owner, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(description) ? 0 : passStringToWasm0(description, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ptr3 = isLikeNone(language) ? 0 : passStringToWasm0(language, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len3 = WASM_VECTOR_LEN;
        const ret = wasm.generate_faf_minimal(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        var ptr5 = ret[0];
        var len5 = ret[1];
        if (ret[3]) {
            ptr5 = 0; len5 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred6_0 = ptr5;
        deferred6_1 = len5;
        return getStringFromWasm0(ptr5, len5);
    } finally {
        wasm.__wbindgen_free(deferred6_0, deferred6_1, 1);
    }
}

/**
 * Generate project.faf content (builder.faf.one template)
 * This is the UNIVERSAL template (not xAI-specific), optimized for 85%+ initial scores
 * @param {string} repo_name
 * @param {string} owner
 * @param {string | null} [description]
 * @param {string | null} [readme]
 * @param {string | null} [dependency_file]
 * @param {string | null} [language]
 * @returns {string}
 */
export function generate_faf(repo_name, owner, description, readme, dependency_file, language) {
    let deferred8_0;
    let deferred8_1;
    try {
        const ptr0 = passStringToWasm0(repo_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(owner, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(description) ? 0 : passStringToWasm0(description, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        var ptr3 = isLikeNone(readme) ? 0 : passStringToWasm0(readme, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len3 = WASM_VECTOR_LEN;
        var ptr4 = isLikeNone(dependency_file) ? 0 : passStringToWasm0(dependency_file, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len4 = WASM_VECTOR_LEN;
        var ptr5 = isLikeNone(language) ? 0 : passStringToWasm0(language, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len5 = WASM_VECTOR_LEN;
        const ret = wasm.generate_faf(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5);
        var ptr7 = ret[0];
        var len7 = ret[1];
        if (ret[3]) {
            ptr7 = 0; len7 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred8_0 = ptr7;
        deferred8_1 = len7;
        return getStringFromWasm0(ptr7, len7);
    } finally {
        wasm.__wbindgen_free(deferred8_0, deferred8_1, 1);
    }
}

const FAFFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_faf_free(ptr >>> 0, 1));
/**
 * FAF - Main entry point for WASM
 */
export class FAF {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FAFFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_faf_free(ptr, 0);
    }
    /**
     * Get Mk3 filled slots count
     * @returns {number}
     */
    get mk3_filled() {
        const ret = wasm.faf_mk3_filled(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Export score as JSON
     * @returns {string}
     */
    score_json() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.faf_score_json(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get Mk3 display string
     * @returns {string}
     */
    mk3_display() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.faf_mk3_display(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get Mk3 breakdown string
     * @returns {string}
     */
    mk3_breakdown() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.faf_mk3_breakdown(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get score with language bonus
     * @param {string} language
     * @returns {number}
     */
    score_with_bonus(language) {
        const ptr0 = passStringToWasm0(language, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.faf_score_with_bonus(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Create FAF from YAML content
     * @param {string} yaml_content
     */
    constructor(yaml_content) {
        const ptr0 = passStringToWasm0(yaml_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.faf_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        FAFFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get project name
     * @returns {string | undefined}
     */
    get name() {
        const ret = wasm.faf_name(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Get project stack
     * @returns {string | undefined}
     */
    get stack() {
        const ret = wasm.faf_stack(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Get display string
     * @returns {string}
     */
    display() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.faf_display(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get version
     * @returns {string}
     */
    static version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.faf_version();
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get Mk3 tier emoji
     * @returns {string}
     */
    get mk3_tier() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.faf_mk3_tier(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Validate FAF content (returns true if valid)
     * @param {string} yaml_content
     * @returns {boolean}
     */
    static validate(yaml_content) {
        const ptr0 = passStringToWasm0(yaml_content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.faf_validate(ptr0, len0);
        return ret !== 0;
    }
    /**
     * Get Mk3 slot-based score (0-100)
     * @returns {number}
     */
    get mk3_score() {
        const ret = wasm.faf_mk3_score(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get Mk3 total slots count
     * @returns {number}
     */
    get mk3_total() {
        const ret = wasm.faf_mk3_total(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) FAF.prototype[Symbol.dispose] = FAF.prototype.free;

const FafScoreFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_fafscore_free(ptr >>> 0, 1));
/**
 * Mk3 Compiler Engine Tier System (OFFICIAL - DO NOT CHANGE)
 * 100%: Championship | 99%+: Gold | 95%+: Silver | 85%+: Bronze
 * 70%+: Green | 55%+: Yellow | <55%: Red
 * FAF Score result - fully transparent
 */
export class FafScore {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FafScore.prototype);
        obj.__wbg_ptr = ptr;
        FafScoreFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FafScoreFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fafscore_free(ptr, 0);
    }
    /**
     * Get truth tier emoji (Mk3 Compiler Engine - OFFICIAL)
     * @returns {string}
     */
    truth_tier() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.fafscore_truth_tier(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Apply language bonus
     * @param {string} language
     * @returns {number}
     */
    with_bonus(language) {
        const ptr0 = passStringToWasm0(language, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.fafscore_with_bonus(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Get completeness score (0-100)
     * @returns {number}
     */
    get completeness() {
        const ret = wasm.fafscore_completeness(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create new score
     * @param {number} completeness
     * @param {number} clarity
     * @param {number} structure
     * @param {number} metadata
     * @returns {FafScore}
     */
    static new(completeness, clarity, structure, metadata) {
        const ret = wasm.fafscore_new(completeness, clarity, structure, metadata);
        return FafScore.__wrap(ret);
    }
    /**
     * Get tier emoji (Mk3 Compiler Engine - OFFICIAL)
     * @returns {string}
     */
    tier() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.fafscore_tier(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get truth score (unweighted average)
     * @returns {number}
     */
    truth() {
        const ret = wasm.fafscore_truth(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get clarity score (0-100)
     * @returns {number}
     */
    get clarity() {
        const ret = wasm.fafscore_clarity(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get full display string
     * @returns {string}
     */
    display() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.fafscore_display(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Export as JSON for JS
     * @returns {string}
     */
    to_json() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.fafscore_to_json(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get metadata score (0-100)
     * @returns {number}
     */
    get metadata() {
        const ret = wasm.fafscore_metadata(this.__wbg_ptr);
        return ret;
    }
    /**
     * Calculate weighted score
     * @returns {number}
     */
    weighted() {
        const ret = wasm.fafscore_weighted(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get structure score (0-100)
     * @returns {number}
     */
    get structure() {
        const ret = wasm.fafscore_structure(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) FafScore.prototype[Symbol.dispose] = FafScore.prototype.free;

const Mk3ScoreFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_mk3score_free(ptr >>> 0, 1));
/**
 * Mk3 Score result - slot-based (filled/total)
 */
export class Mk3Score {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Mk3ScoreFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mk3score_free(ptr, 0);
    }
    /**
     * Get tier emoji (Mk3 official)
     * @returns {string}
     */
    get tier() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.mk3score_tier(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get percentage score (0-100)
     * @returns {number}
     */
    get score() {
        const ret = wasm.mk3score_score(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get total slot count
     * @returns {number}
     */
    get total() {
        const ret = wasm.mk3score_total(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get filled slot count
     * @returns {number}
     */
    get filled() {
        const ret = wasm.mk3score_filled(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Display string
     * @returns {string}
     */
    display() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.mk3score_display(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get breakdown as string
     * @returns {string}
     */
    breakdown() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.mk3score_breakdown(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) Mk3Score.prototype[Symbol.dispose] = Mk3Score.prototype.free;

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
    imports.wbg.__wbg___wbindgen_throw_b855445ff6a94295 = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_getTime_14776bfb48a1bff9 = function(arg0) {
        const ret = arg0.getTime();
        return ret;
    };
    imports.wbg.__wbg_new_0_f9740686d739025c = function() {
        const ret = new Date();
        return ret;
    };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(arg0, arg1) {
        // Cast intrinsic for `Ref(String) -> Externref`.
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
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

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedFloat32ArrayMemory0 = null;
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
        module_or_path = new URL('faf_wasm_sdk_bg.wasm', import.meta.url);
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
