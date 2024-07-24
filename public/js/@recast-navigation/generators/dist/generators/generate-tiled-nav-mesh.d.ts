import { NavMesh, RecastBuildContext, RecastChunkyTriMesh, RecastCompactHeightfield, RecastConfig, RecastContourSet, RecastHeightfield, RecastPolyMesh, RecastPolyMeshDetail } from '@recast-navigation/core';
import { Pretty } from '../types';
import { OffMeshConnectionGeneratorParams } from './common';
export type TiledNavMeshGeneratorConfig = Pretty<RecastConfig & OffMeshConnectionGeneratorParams>;
export declare const tiledNavMeshGeneratorConfigDefaults: TiledNavMeshGeneratorConfig;
type TileIntermediates = {
    tileX: number;
    tileY: number;
    heightfield?: RecastHeightfield;
    compactHeightfield?: RecastCompactHeightfield;
    contourSet?: RecastContourSet;
    polyMesh?: RecastPolyMesh;
    polyMeshDetail?: RecastPolyMeshDetail;
};
export type TiledNavMeshGeneratorIntermediates = {
    type: 'tiled';
    buildContext: RecastBuildContext;
    chunkyTriMesh?: RecastChunkyTriMesh;
    tileIntermediates: TileIntermediates[];
};
type TiledNavMeshGeneratorSuccessResult = {
    navMesh: NavMesh;
    success: true;
    intermediates: TiledNavMeshGeneratorIntermediates;
};
type TiledNavMeshGeneratorFailResult = {
    navMesh: undefined;
    success: false;
    intermediates: TiledNavMeshGeneratorIntermediates;
    error: string;
};
export type TiledNavMeshGeneratorResult = TiledNavMeshGeneratorSuccessResult | TiledNavMeshGeneratorFailResult;
/**
 * Builds a Tiled NavMesh
 * @param positions a flat array of positions
 * @param indices a flat array of indices
 * @param navMeshGeneratorConfig optional configuration for the NavMesh generator
 * @param keepIntermediates if true intermediates will be returned
 */
export declare const generateTiledNavMesh: (positions: ArrayLike<number>, indices: ArrayLike<number>, navMeshGeneratorConfig?: Partial<TiledNavMeshGeneratorConfig>, keepIntermediates?: boolean) => TiledNavMeshGeneratorResult;
export {};
