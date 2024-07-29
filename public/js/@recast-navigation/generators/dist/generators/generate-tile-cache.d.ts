import { NavMesh, RecastBuildContext, RecastChunkyTriMesh, RecastCompactHeightfield, RecastConfig, RecastHeightfield, RecastHeightfieldLayerSet, TileCache, TileCacheMeshProcess } from '@recast-navigation/core';
import { Pretty } from '../types';
type TileCacheRecastConfig = Omit<RecastConfig, 'minRegionArea' | 'maxEdgeLen'>;
export type TileCacheGeneratorConfig = Pretty<TileCacheRecastConfig & {
    /**
     * How many layers (or "floors") each navmesh tile is expected to have.
     */
    expectedLayersPerTile: number;
    /**
     * The max number of obstacles
     */
    maxObstacles: number;
    /**
     * The tile cache mesh process implementation.
     * If not provided, a default one is created via `createDefaultTileCacheMeshProcess()`
     * @default createDefaultTileCacheMeshProcess()
     */
    tileCacheMeshProcess?: TileCacheMeshProcess;
}>;
export declare const tileCacheGeneratorConfigDefaults: TileCacheGeneratorConfig;
export type TileCacheGeneratorTileIntermediates = {
    tileX: number;
    tileY: number;
    heightfield?: RecastHeightfield;
    compactHeightfield?: RecastCompactHeightfield;
    heightfieldLayerSet?: RecastHeightfieldLayerSet;
};
export type TileCacheGeneratorIntermediates = {
    type: 'tilecache';
    buildContext: RecastBuildContext;
    chunkyTriMesh?: RecastChunkyTriMesh;
    tileIntermediates: TileCacheGeneratorTileIntermediates[];
};
type TileCacheGeneratorSuccessResult = {
    tileCache: TileCache;
    navMesh: NavMesh;
    success: true;
    intermediates: TileCacheGeneratorIntermediates;
};
type TileCacheGeneratorFailResult = {
    tileCache: undefined;
    navMesh: undefined;
    success: false;
    error: string;
    intermediates: TileCacheGeneratorIntermediates;
};
export type TileCacheGeneratorResult = TileCacheGeneratorSuccessResult | TileCacheGeneratorFailResult;
export declare const createDefaultTileCacheMeshProcess: () => TileCacheMeshProcess;
/**
 * Builds a TileCache and NavMesh from the given positions and indices.
 * TileCache assumes small tiles (around 32-64 squared) and does some tricks to make the update fast.
 * @param positions a flat array of positions
 * @param indices a flat array of indices
 * @param navMeshConfig optional configuration for the NavMesh
 * @param keepIntermediates if true intermediates will be returned
 */
export declare const generateTileCache: (positions: ArrayLike<number>, indices: ArrayLike<number>, navMeshGeneratorConfig?: Partial<TileCacheGeneratorConfig>, keepIntermediates?: boolean) => TileCacheGeneratorResult;
export {};
