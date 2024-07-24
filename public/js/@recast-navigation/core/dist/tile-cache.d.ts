import { UnsignedCharArray, UnsignedShortArray } from './arrays';
import { NavMeshCreateParams } from './detour';
import { NavMesh } from './nav-mesh';
import { type RawModule } from './raw';
import { Vector3 } from './utils';
export type ObstacleRef = RawModule.dtObstacleRef;
export type BoxObstacle = {
    type: 'box';
    ref: ObstacleRef;
    position: Vector3;
    halfExtents: Vector3;
    angle: number;
};
export type CylinderObstacle = {
    type: 'cylinder';
    ref: ObstacleRef;
    position: Vector3;
    radius: number;
    height: number;
};
export type AddObstacleResult<T> = {
    success: true;
    status: number;
    obstacle: T;
} | {
    success: false;
    status: number;
    obstacle?: T;
};
export type RemoveObstacleResult = {
    success: boolean;
    status: number;
};
export type Obstacle = BoxObstacle | CylinderObstacle;
export type TileCacheParamsType = {
    orig: ReadonlyArray<number>;
    cs: number;
    ch: number;
    width: number;
    height: number;
    walkableHeight: number;
    walkableRadius: number;
    walkableClimb: number;
    maxSimplificationError: number;
    maxTiles: number;
    maxObstacles: number;
};
export declare class DetourTileCacheParams {
    raw: RawModule.dtTileCacheParams;
    constructor(raw: RawModule.dtTileCacheParams);
    static create(config: TileCacheParamsType): DetourTileCacheParams;
}
export type TileCacheUpdateResult = {
    success: boolean;
    status: number;
    upToDate: boolean;
};
export declare class TileCache {
    raw: RawModule.TileCache;
    obstacles: Map<ObstacleRef, Obstacle>;
    /**
     * Constructs a new TileCache
     */
    constructor();
    /**
     * Creates a wrapper around a raw TileCache object
     * @param raw raw object
     */
    constructor(raw: RawModule.TileCache);
    /**
     * Initialises the TileCache
     * @param params
     */
    init(params: DetourTileCacheParams, alloc: RawModule.RecastLinearAllocator, compressor: RawModule.RecastFastLZCompressor, meshProcess: TileCacheMeshProcess): boolean;
    /**
     * Updates the tile cache by rebuilding tiles touched by unfinished obstacle requests.
     *
     * After adding or removing obstacles you can call `tileCache.update(navMesh)` to rebuild navmesh tiles.
     *
     * Adding or removing an obstacle will internally create an "obstacle request".
     * TileCache supports queuing up to 64 obstacle requests.
     *
     * The `tileCache.update` method returns `upToDate`, whether the tile cache is fully up to date with obstacle requests and tile rebuilds.
     * Each update call processes up to 64 tiles touched by added or removed obstacles.
     * If the tile cache isn't up to date another call will continue processing obstacle requests and tile rebuilds; otherwise it will have no effect.
     *
     * If not many obstacle requests occur between updates, an easy pattern is to call `tileCache.update` periodically, such as every game update.
     * If many obstacle requests have been made and you need to avoid reaching the 64 obstacle request limit, you can call `tileCache.update` multiple times, bailing out when `upToDate` is true or after a maximum number of updates.
     *
     * @example
     * ```ts
     * const { success, status, upToDate } = tileCache.update(navMesh);
     * ```
     */
    update(navMesh: NavMesh): TileCacheUpdateResult;
    /**
     * Creates a cylinder obstacle and adds it to the navigation mesh.
     */
    addCylinderObstacle(position: Vector3, radius: number, height: number): AddObstacleResult<CylinderObstacle>;
    /**
     * Creates a box obstacle and adds it to the navigation mesh.
     */
    addBoxObstacle(position: Vector3, halfExtents: Vector3, angle: number): AddObstacleResult<BoxObstacle>;
    /**
     * Removes an obstacle from the navigation mesh.
     */
    removeObstacle(obstacle: Obstacle | ObstacleRef): RemoveObstacleResult;
    addTile(data: UnsignedCharArray, flags?: number): RawModule.TileCacheAddTileResult;
    buildNavMeshTile(ref: RawModule.dtCompressedTileRef, navMesh: NavMesh): number;
    buildNavMeshTilesAt(tx: number, ty: number, navMesh: NavMesh): number;
    destroy(): void;
}
export declare class TileCacheMeshProcess {
    raw: RawModule.TileCacheMeshProcess;
    constructor(process: (navMeshCreateParams: NavMeshCreateParams, polyAreasArray: UnsignedCharArray, polyFlagsArray: UnsignedShortArray) => void);
}
export declare const buildTileCacheLayer: (comp: RawModule.RecastFastLZCompressor, header: RawModule.dtTileCacheLayerHeader, heights: UnsignedCharArray, areas: UnsignedCharArray, cons: UnsignedCharArray, tileCacheData: UnsignedCharArray) => number;
