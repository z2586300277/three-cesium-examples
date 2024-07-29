import { RawModule } from './raw';
type TypedArray = typeof Int32Array | typeof Uint32Array | typeof Uint8Array | typeof Uint16Array | typeof Float32Array;
declare abstract class BaseArray<RawType extends RawModule.IntArray | RawModule.UnsignedIntArray | RawModule.UnsignedCharArray | RawModule.UnsignedShortArray | RawModule.FloatArray, T extends TypedArray> {
    raw: RawType;
    get size(): number;
    protected abstract typedArrayClass: T;
    constructor(raw: RawType);
    get(i: number): number;
    set(i: number, value: number): void;
    resize(size: number): void;
    copy(data: InstanceType<T> | number[]): void;
    destroy(): void;
    getHeapView(): InstanceType<T>;
    toTypedArray(): InstanceType<T>;
    protected abstract getHeap(): InstanceType<T>;
}
export declare class IntArray extends BaseArray<RawModule.IntArray, typeof Int32Array> {
    typedArrayClass: Int32ArrayConstructor;
    /**
     * Creates a new IntArray.
     */
    constructor();
    /**
     * Creates a wrapper around an existing raw IntArray object.
     */
    constructor(raw: RawModule.IntArray);
    protected getHeap(): Int32Array;
    static fromRaw(raw: RawModule.IntArray): IntArray;
}
export declare class UnsignedIntArray extends BaseArray<RawModule.UnsignedIntArray, typeof Uint32Array> {
    typedArrayClass: Uint32ArrayConstructor;
    /**
     * Creates a new UnsignedIntArray.
     */
    constructor();
    /**
     * Creates a wrapper around an existing raw UnsignedIntArray object.
     */
    constructor(raw: RawModule.UnsignedIntArray);
    protected getHeap(): Uint32Array;
    static fromRaw(raw: RawModule.UnsignedIntArray): UnsignedIntArray;
}
export declare class UnsignedCharArray extends BaseArray<RawModule.UnsignedCharArray, typeof Uint8Array> {
    typedArrayClass: Uint8ArrayConstructor;
    /**
     * Creates a new UnsignedCharArray.
     */
    constructor();
    /**
     * Creates a wrapper around an existing raw UnsignedCharArray object.
     */
    constructor(raw: RawModule.UnsignedCharArray);
    protected getHeap(): Uint8Array;
    static fromRaw(raw: RawModule.UnsignedCharArray): UnsignedCharArray;
}
export declare class UnsignedShortArray extends BaseArray<RawModule.UnsignedShortArray, typeof Uint16Array> {
    typedArrayClass: Uint16ArrayConstructor;
    /**
     * Creates a new UnsignedShortArray.
     */
    constructor();
    /**
     * Creates a wrapper around an existing raw UnsignedShortArray object.
     */
    constructor(raw: RawModule.UnsignedShortArray);
    protected getHeap(): Uint16Array;
    static fromRaw(raw: RawModule.UnsignedShortArray): UnsignedShortArray;
}
export declare class FloatArray extends BaseArray<RawModule.FloatArray, typeof Float32Array> {
    typedArrayClass: Float32ArrayConstructor;
    /**
     * Creates a new FloatArray.
     */
    constructor();
    /**
     * Creates a wrapper around an existing raw FloatArray object.
     */
    constructor(raw: RawModule.FloatArray);
    protected getHeap(): Float32Array;
    static fromRaw(raw: RawModule.FloatArray): FloatArray;
}
export declare const VerticesArray: typeof FloatArray;
export declare const TrianglesArray: typeof IntArray;
export declare const TriangleAreasArray: typeof UnsignedCharArray;
export declare const ChunkIdsArray: typeof IntArray;
export declare const TileCacheData: typeof UnsignedCharArray;
export {};
