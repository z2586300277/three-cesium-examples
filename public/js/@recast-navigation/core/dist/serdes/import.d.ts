import { NavMesh } from '../nav-mesh';
import { type RawModule } from '../raw';
import { TileCache, TileCacheMeshProcess } from '../tile-cache';
export type ImportNavMeshResult = {
    navMesh: NavMesh;
};
export declare const importNavMesh: (data: Uint8Array) => ImportNavMeshResult;
export type ImportTileCacheResult = {
    navMesh: NavMesh;
    tileCache: TileCache;
    allocator: RawModule.RecastLinearAllocator;
    compressor: RawModule.RecastFastLZCompressor;
};
export declare const importTileCache: (data: Uint8Array, tileCacheMeshProcess: TileCacheMeshProcess) => ImportTileCacheResult;
