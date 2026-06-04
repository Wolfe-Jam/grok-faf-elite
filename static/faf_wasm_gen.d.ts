/* tslint:disable */
/* eslint-disable */

/**
 * Generate project.faf (faf-cli v6.8 / faf_version "3.3") from repo metadata.
 *
 * # Parameters
 * - `repo_name`: Repository name (e.g., "grok-1")
 * - `owner`: Repository owner (e.g., "xai-org")
 * - `description`: Optional repository description
 * - `readme`: Optional README.md content
 * - `dependency_file`: Optional dependency file (package.json, pyproject.toml, Cargo.toml)
 * - `language`: Optional primary language from the GitHub API
 *
 * # Returns
 * project.faf YAML (no embedded score — faf-cli computes it on read).
 */
export function generate_faf(repo_name: string, owner: string, description?: string | null, readme?: string | null, dependency_file?: string | null, language?: string | null): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly generate_faf: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
    readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
    readonly __wbindgen_export: (a: number, b: number) => number;
    readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_export3: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
