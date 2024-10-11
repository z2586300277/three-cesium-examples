/* tslint:disable */
/* eslint-disable */
/**
* @param {number} x
* @param {number} y
* @param {number} octaves
* @param {number} lacunarity
* @param {number} gain
* @returns {number}
*/
export function fbm(x: number, y: number, octaves: number, lacunarity: number, gain: number): number;
/**
* @returns {Float64Array}
*/
export function performance(): Float64Array;
/**
*/
export class ImprovedNoise {
  free(): void;
/**
*/
  constructor();
/**
* @param {number} x
* @param {number} y
* @param {number} z
* @returns {number}
*/
  noise(x: number, y: number, z: number): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_improvednoise_free: (a: number, b: number) => void;
  readonly improvednoise_new: () => number;
  readonly improvednoise_noise: (a: number, b: number, c: number, d: number) => number;
  readonly fbm: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly performance: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
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
