/* tslint:disable */
/* eslint-disable */
/**
 * Get SDK version
 */
export function sdk_version(): string;
/**
 * Standalone score function - returns JSON
 */
export function score_faf(yaml_content: string): string;
/**
 * Standalone validate function
 */
export function validate_faf(yaml_content: string): boolean;
export function score_weights_fast(weights: Float32Array, values: Float32Array): number;
export function score_weights(weights: Float32Array, base: number): number;
/**
 * Generate project.faf content (builder.faf.one template)
 * This is the UNIVERSAL template (not xAI-specific), optimized for 85%+ initial scores
 */
export function generate_faf(repo_name: string, owner: string, description?: string | null, readme?: string | null, package_json?: string | null): string;
/**
 * Generate metadata-only .faf for private repos (when README/package.json unavailable)
 */
export function generate_faf_minimal(repo_name: string, owner: string, description?: string | null, language?: string | null): string;
/**
 * FAF - Main entry point for WASM
 */
export class FAF {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Export score as JSON
   */
  score_json(): string;
  /**
   * Get Mk3 display string
   */
  mk3_display(): string;
  /**
   * Get Mk3 breakdown string
   */
  mk3_breakdown(): string;
  /**
   * Get score with language bonus
   */
  score_with_bonus(language: string): number;
  /**
   * Create FAF from YAML content
   */
  constructor(yaml_content: string);
  /**
   * Get display string
   */
  display(): string;
  /**
   * Get version
   */
  static version(): string;
  /**
   * Validate FAF content (returns true if valid)
   */
  static validate(yaml_content: string): boolean;
  /**
   * Get Mk3 filled slots count
   */
  readonly mk3_filled: number;
  /**
   * Get project name
   */
  readonly name: string | undefined;
  /**
   * Get project stack
   */
  readonly stack: string | undefined;
  /**
   * Get Mk3 tier emoji
   */
  readonly mk3_tier: string;
  /**
   * Get Mk3 slot-based score (0-100)
   */
  readonly mk3_score: number;
  /**
   * Get Mk3 total slots count
   */
  readonly mk3_total: number;
}
/**
 * Mk3 Compiler Engine Tier System (OFFICIAL - DO NOT CHANGE)
 * 100%: Championship | 99%+: Gold | 95%+: Silver | 85%+: Bronze
 * 70%+: Green | 55%+: Yellow | <55%: Red
 * FAF Score result - fully transparent
 */
export class FafScore {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Get truth tier emoji (Mk3 Compiler Engine - OFFICIAL)
   */
  truth_tier(): string;
  /**
   * Apply language bonus
   */
  with_bonus(language: string): number;
  /**
   * Create new score
   */
  static new(completeness: number, clarity: number, structure: number, metadata: number): FafScore;
  /**
   * Get tier emoji (Mk3 Compiler Engine - OFFICIAL)
   */
  tier(): string;
  /**
   * Get truth score (unweighted average)
   */
  truth(): number;
  /**
   * Get full display string
   */
  display(): string;
  /**
   * Export as JSON for JS
   */
  to_json(): string;
  /**
   * Calculate weighted score
   */
  weighted(): number;
  /**
   * Get completeness score (0-100)
   */
  readonly completeness: number;
  /**
   * Get clarity score (0-100)
   */
  readonly clarity: number;
  /**
   * Get metadata score (0-100)
   */
  readonly metadata: number;
  /**
   * Get structure score (0-100)
   */
  readonly structure: number;
}
/**
 * Mk3 Score result - slot-based (filled/total)
 */
export class Mk3Score {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Display string
   */
  display(): string;
  /**
   * Get breakdown as string
   */
  breakdown(): string;
  /**
   * Get tier emoji (Mk3 official)
   */
  readonly tier: string;
  /**
   * Get percentage score (0-100)
   */
  readonly score: number;
  /**
   * Get total slot count
   */
  readonly total: number;
  /**
   * Get filled slot count
   */
  readonly filled: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_faf_free: (a: number, b: number) => void;
  readonly __wbg_fafscore_free: (a: number, b: number) => void;
  readonly __wbg_mk3score_free: (a: number, b: number) => void;
  readonly faf_display: (a: number) => [number, number];
  readonly faf_mk3_breakdown: (a: number) => [number, number];
  readonly faf_mk3_display: (a: number) => [number, number];
  readonly faf_mk3_filled: (a: number) => number;
  readonly faf_mk3_score: (a: number) => number;
  readonly faf_mk3_tier: (a: number) => [number, number];
  readonly faf_mk3_total: (a: number) => number;
  readonly faf_name: (a: number) => [number, number];
  readonly faf_new: (a: number, b: number) => [number, number, number];
  readonly faf_score_json: (a: number) => [number, number];
  readonly faf_score_with_bonus: (a: number, b: number, c: number) => number;
  readonly faf_stack: (a: number) => [number, number];
  readonly faf_validate: (a: number, b: number) => number;
  readonly faf_version: () => [number, number];
  readonly fafscore_clarity: (a: number) => number;
  readonly fafscore_completeness: (a: number) => number;
  readonly fafscore_display: (a: number) => [number, number];
  readonly fafscore_metadata: (a: number) => number;
  readonly fafscore_new: (a: number, b: number, c: number, d: number) => number;
  readonly fafscore_structure: (a: number) => number;
  readonly fafscore_tier: (a: number) => [number, number];
  readonly fafscore_to_json: (a: number) => [number, number];
  readonly fafscore_truth: (a: number) => number;
  readonly fafscore_truth_tier: (a: number) => [number, number];
  readonly fafscore_weighted: (a: number) => number;
  readonly fafscore_with_bonus: (a: number, b: number, c: number) => number;
  readonly generate_faf: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => [number, number, number, number];
  readonly generate_faf_minimal: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number, number, number];
  readonly mk3score_breakdown: (a: number) => [number, number];
  readonly mk3score_display: (a: number) => [number, number];
  readonly mk3score_filled: (a: number) => number;
  readonly mk3score_score: (a: number) => number;
  readonly mk3score_tier: (a: number) => [number, number];
  readonly mk3score_total: (a: number) => number;
  readonly score_faf: (a: number, b: number) => [number, number, number, number];
  readonly score_weights: (a: number, b: number, c: number) => number;
  readonly score_weights_fast: (a: number, b: number, c: number, d: number) => number;
  readonly validate_faf: (a: number, b: number) => number;
  readonly sdk_version: () => [number, number];
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
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
