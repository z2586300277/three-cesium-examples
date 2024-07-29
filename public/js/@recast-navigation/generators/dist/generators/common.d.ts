import { OffMeshConnectionParams } from '@recast-navigation/core';
export declare const getBoundingBox: (positions: ArrayLike<number>, indices: ArrayLike<number>) => {
    bbMin: import("@recast-navigation/core").Vector3Tuple;
    bbMax: import("@recast-navigation/core").Vector3Tuple;
};
export declare const dtIlog2: (v: number) => number;
export declare const dtNextPow2: (v: number) => number;
export type OffMeshConnectionGeneratorParams = {
    offMeshConnections?: OffMeshConnectionParams[];
};
