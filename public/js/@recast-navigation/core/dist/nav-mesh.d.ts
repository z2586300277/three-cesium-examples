import { UnsignedCharArray } from './arrays';
import { DetourMeshTile, DetourOffMeshConnection, DetourPoly } from './detour';
import { type RawModule } from './raw';
import { Vector3 } from './utils';
export declare class NavMeshGetTilesAtResult {
    raw: RawModule.NavMeshGetTilesAtResult;
    constructor(raw: RawModule.NavMeshGetTilesAtResult);
    tiles(index: number): DetourMeshTile;
    tileCount(): number;
}
export declare class NavMeshRemoveTileResult {
    raw: RawModule.NavMeshRemoveTileResult;
    constructor(raw: RawModule.NavMeshRemoveTileResult);
    data(): number[];
    dataSize(): number;
}
export declare class NavMeshCalcTileLocResult {
    raw: RawModule.NavMeshCalcTileLocResult;
    constructor(raw: RawModule.NavMeshCalcTileLocResult);
    tileX(): number;
    tileY(): number;
}
export declare class NavMeshStoreTileStateResult {
    raw: RawModule.NavMeshStoreTileStateResult;
    constructor(raw: RawModule.NavMeshStoreTileStateResult);
    data(): number[];
    dataSize(): number;
}
export type NavMeshDecodePolyIdResult = {
    /**
     * The tile's salt value.
     */
    tileSalt: number;
    /**
     * The index of the tile. `it` in the C++ api.
     */
    tileIndex: number;
    /**
     * The index of the polygon within the tile. `ip` in the C++ api.
     */
    tilePolygonIndex: number;
};
export type NavMeshParamsType = {
    orig: Vector3;
    tileWidth: number;
    tileHeight: number;
    maxTiles: number;
    maxPolys: number;
};
export declare class NavMeshParams {
    raw: RawModule.dtNavMeshParams;
    constructor(raw: RawModule.dtNavMeshParams);
    static create(params: NavMeshParamsType): NavMeshParams;
    clone(): NavMeshParams;
}
export declare class NavMesh {
    raw: RawModule.NavMesh;
    /**
     * Constructs a new NavMesh
     */
    constructor();
    /**
     * Creates a wrapper around a raw NavMesh object
     * @param raw raw object
     */
    constructor(raw: RawModule.NavMesh);
    /**
     * Initializes the NavMesh for use with a single tile.
     * @param navMeshData the nav mesh data
     * @returns the status of the operation
     */
    initSolo(navMeshData: UnsignedCharArray): boolean;
    /**
     * Initializes the NavMesh for use with multiple tiles.
     * @param params parameters for the NavMesh
     * @returns the status of the operation
     */
    initTiled(params: NavMeshParams): boolean;
    /**
     * Adds a tile to the NavMesh.
     * @param navMeshData the nav mesh data
     * @param flags the flags to use when building the nav mesh
     * @param lastRef
     * @returns the status of the operation and the reference of the added tile
     */
    addTile(navMeshData: UnsignedCharArray, flags: number, lastRef: number): {
        status: number;
        tileRef: number;
    };
    /**
     * Decodes a standard polygon reference.
     * @param polyRef The polygon reference to decode
     * @returns the decoded polygon reference
     */
    decodePolyId(polyRef: number): NavMeshDecodePolyIdResult;
    /**
     * Derives a standard polygon reference.
     * @param salt The tile's salt value.
     * @param tileIndex The index of the tile. `it` in the C++ api.
     * @param tilePolygonIndex The index of the polygon within the tile. `ip` in the C++ api.
     * @returns the derived polygon reference
     */
    encodePolyId(salt: number, tileIndex: number, tilePolygonIndex: number): number;
    /**
     * Removes a tile from the NavMesh
     * @param ref the tile ref
     * @returns the nav mesh data, so it can be added back later
     */
    removeTile(ref: number): NavMeshRemoveTileResult;
    /**
     * Calculates the tile grid location for the specified world position.
     * @param pos The world position for the query. [(x, y, z)]
     * @returns
     */
    calcTileLoc(pos: Vector3): NavMeshCalcTileLocResult;
    /**
     * Gets the tile at the specified grid location.
     * @param x The tile's x-location. (x, y, layer)
     * @param y The tile's y-location. (x, y, layer)
     * @param layer The tile's layer. (x, y, layer)
     * @returns The tile, or null if the tile does not exist.
     */
    getTileAt(x: number, y: number, layer: number): DetourMeshTile | null;
    /**
     * Gets all tiles at the specified grid location. (All layers.)
     * @param x The tile's x-location. (x, y)
     * @param y The tile's y-location. (x, y)
     * @param maxTiles The maximum tiles the tiles parameter can hold.
     */
    getTilesAt(x: number, y: number, maxTiles: number): NavMeshGetTilesAtResult;
    /**
     * Gets the tile reference for the tile at specified grid location.
     * @param x The tile's x-location. (x, y, layer)
     * @param y The tile's y-location. (x, y, layer)
     * @param layer The tile's layer. (x, y, layer)
     * @returns The tile reference of the tile, or 0 if there is none.
     */
    getTileRefAt(x: number, y: number, layer: number): number;
    /**
     * Gets the tile reference for the specified tile.
     * @param tile
     * @returns
     */
    getTileRef(tile: DetourMeshTile): number;
    /**
     * Gets the tile for the specified tile reference.
     * @param ref The tile reference of the tile to retrieve.
     * @returns The tile for the specified reference, or null if the reference is invalid.
     */
    getTileByRef(ref: number): DetourMeshTile | null;
    /**
     * Returns the maximum number of tiles supported by the navigation mesh.
     */
    getMaxTiles(): number;
    /**
     * Gets the tile at the specified index.
     * @param i the tile index. [Limit: 0 >= index < #getMaxTiles()]
     * @returns
     */
    getTile(i: number): DetourMeshTile;
    /**
     * Gets the tile and polygon for the specified polygon reference.
     * @param ref The reference for the a polygon.
     * @returns
     */
    getTileAndPolyByRef(ref: number): {
        success: boolean;
        status: number;
        tile: DetourMeshTile;
        poly: DetourPoly;
    };
    /**
     * Gets the tile and polygon for the specified polygon reference.
     * @param ref A known valid reference for a polygon.
     * @returns
     */
    getTileAndPolyByRefUnsafe(ref: number): {
        tile: DetourMeshTile;
        poly: DetourPoly;
    };
    /**
     * Checks the validity of a polygon reference.
     * @param ref
     * @returns
     */
    isValidPolyRef(ref: number): boolean;
    /**
     * Gets the polygon reference for the tile's base polygon.
     * @param tile
     * @returns
     */
    getPolyRefBase(tile: DetourMeshTile): number;
    /**
     * Gets the endpoints for an off-mesh connection, ordered by "direction of travel".
     * @param prevRef The reference of the polygon before the connection.
     * @param polyRef The reference of the off-mesh connection polygon.
     * @returns
     */
    getOffMeshConnectionPolyEndPoints(prevRef: number, polyRef: number): {
        success: boolean;
        status: number;
        start: {
            x: number;
            y: number;
            z: number;
        };
        end: {
            x: number;
            y: number;
            z: number;
        };
    };
    /**
     * Gets the specified off-mesh connection.
     * @param ref The polygon reference of the off-mesh connection.
     * @returns
     */
    getOffMeshConnectionByRef(ref: number): DetourOffMeshConnection;
    /**
     * Sets the user defined flags for the specified polygon.
     * @param ref The polygon reference.
     * @param flags The new flags for the polygon.
     */
    setPolyFlags(ref: number, flags: number): number;
    /**
     * Gets the user defined flags for the specified polygon.
     * @param ref The polygon reference.
     * @returns
     */
    getPolyFlags(ref: number): {
        status: number;
        flags: number;
    };
    /**
     * Sets the user defined area for the specified polygon.
     * @param ref The polygon reference.
     * @param flags The new flags for the polygon.
     */
    setPolyArea(ref: number, area: number): number;
    /**
     * Gets the user defined area for the specified polygon.
     * @param ref The polygon reference.
     * @returns
     */
    getPolyArea(ref: number): {
        status: number;
        area: number;
    };
    /**
     * Gets the size of the buffer required by #storeTileState to store the specified tile's state.
     * @param tile
     * @returns The size of the buffer required to store the state.
     */
    getTileStateSize(tile: DetourMeshTile): number;
    /**
     * Stores the non-structural state of the tile in the specified buffer. (Flags, area ids, etc.)
     * @param tile The tile.
     * @param maxDataSize The size of the data buffer. [Limit: >= #getTileStateSize]
     * @returns
     */
    storeTileState(tile: DetourMeshTile, maxDataSize: number): NavMeshStoreTileStateResult;
    /**
     * Restores the state of the tile.
     * @param tile The tile.
     * @param data The new state. (Obtained from @see storeTileState)
     * @param maxDataSize The size of the state within the data buffer.
     * @returns
     */
    restoreTileState(tile: DetourMeshTile, data: number[], maxDataSize: number): number;
    /**
     * Returns a triangle mesh that can be used to visualize the NavMesh.
     */
    getDebugNavMesh(): [positions: number[], indices: number[]];
    /**
     * Destroys the NavMesh.
     */
    destroy(): void;
}
