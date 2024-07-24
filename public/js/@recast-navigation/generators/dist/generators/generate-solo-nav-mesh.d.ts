import { NavMesh, RecastBuildContext, RecastCompactHeightfield, RecastConfig, RecastContourSet, RecastHeightfield, RecastPolyMesh, RecastPolyMeshDetail } from '@recast-navigation/core';
import { Pretty } from '../types';
import { OffMeshConnectionGeneratorParams } from './common';
export type SoloNavMeshGeneratorConfig = Pretty<Omit<RecastConfig, 'tileSize'> & OffMeshConnectionGeneratorParams>;
export declare const soloNavMeshGeneratorConfigDefaults: SoloNavMeshGeneratorConfig;
export type SoloNavMeshGeneratorIntermediates = {
    type: 'solo';
    buildContext: RecastBuildContext;
    heightfield?: RecastHeightfield;
    compactHeightfield?: RecastCompactHeightfield;
    contourSet?: RecastContourSet;
    polyMesh?: RecastPolyMesh;
    polyMeshDetail?: RecastPolyMeshDetail;
};
type SoloNavMeshGeneratorSuccessResult = {
    navMesh: NavMesh;
    success: true;
    intermediates: SoloNavMeshGeneratorIntermediates;
};
type SoloNavMeshGeneratorFailResult = {
    navMesh: undefined;
    success: false;
    intermediates: SoloNavMeshGeneratorIntermediates;
    error: string;
};
export type SoloNavMeshGeneratorResult = SoloNavMeshGeneratorSuccessResult | SoloNavMeshGeneratorFailResult;
/**
 * Builds a Solo NavMesh from the given positions and indices.
 * @param positions a flat array of positions
 * @param indices a flat array of indices
 * @param navMeshGeneratorConfig optional configuration for the NavMesh generator
 * @param keepIntermediates if true intermediates will be returned
 */
export declare const generateSoloNavMesh: (positions: ArrayLike<number>, indices: ArrayLike<number>, navMeshGeneratorConfig?: Partial<SoloNavMeshGeneratorConfig>, keepIntermediates?: boolean) => SoloNavMeshGeneratorResult;
export {};
