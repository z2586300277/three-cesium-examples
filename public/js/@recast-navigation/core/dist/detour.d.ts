import { UnsignedCharArray } from './arrays';
import { type RawModule } from './raw';
import { RecastPolyMesh, RecastPolyMeshDetail } from './recast';
import { Vector3, Vector3Tuple } from './utils';
export declare const statusSucceed: (status: number) => boolean;
export declare const statusFailed: (status: number) => boolean;
export declare const statusInProgress: (status: number) => boolean;
export declare const statusDetail: (status: number, detail: number) => boolean;
export declare const statusToReadableString: (status: number) => string;
export declare class DetourPolyDetail {
    raw: RawModule.dtPolyDetail;
    constructor(raw: RawModule.dtPolyDetail);
    vertBase(): number;
    triBase(): number;
    vertCount(): number;
    triCount(): number;
}
export declare class DetourLink {
    raw: RawModule.dtLink;
    constructor(raw: RawModule.dtLink);
    ref(): number;
    next(): number;
    edge(): number;
    side(): number;
    bmin(): number;
    bmax(): number;
}
export declare class DetourBVNode {
    raw: RawModule.dtBVNode;
    constructor(raw: RawModule.dtBVNode);
    bmin(): Vector3;
    bmax(): Vector3;
    i(): number;
}
export declare class DetourOffMeshConnection {
    raw: RawModule.dtOffMeshConnection;
    constructor(raw: RawModule.dtOffMeshConnection);
    pos(index: number): number;
    rad(): number;
    poly(): number;
    flags(): number;
    side(): number;
    userId(): number;
}
export declare class DetourMeshHeader {
    raw: RawModule.dtMeshHeader;
    constructor(raw: RawModule.dtMeshHeader);
    magic(): number;
    version(): number;
    x(): number;
    y(): number;
    layer(): number;
    userId(): number;
    polyCount(): number;
    vertCount(): number;
    maxLinkCount(): number;
    detailMeshCount(): number;
    detailVertCount(): number;
    detailTriCount(): number;
    bvNodeCount(): number;
    offMeshConCount(): number;
    offMeshBase(): number;
    walkableHeight(): number;
    walkableRadius(): number;
    walkableClimb(): number;
    bmin(index: number): number;
    bmax(index: number): number;
    bvQuantFactor(): number;
}
export declare class DetourPoly {
    raw: RawModule.dtPoly;
    constructor(raw: RawModule.dtPoly);
    firstLink(): number;
    verts(index: number): number;
    neis(index: number): number;
    flags(): number;
    vertCount(): number;
    areaAndType(): number;
    getType(): number;
}
export declare class DetourMeshTile {
    raw: RawModule.dtMeshTile;
    constructor(raw: RawModule.dtMeshTile);
    salt(): number;
    linksFreeList(): number;
    header(): DetourMeshHeader | null;
    polys(index: number): DetourPoly;
    verts(index: number): number;
    links(index: number): DetourLink;
    detailMeshes(index: number): DetourPolyDetail;
    detailVerts(index: number): number;
    detailTris(index: number): number;
    bvTree(index: number): DetourBVNode;
    offMeshCons(index: number): DetourOffMeshConnection;
    data(index: number): number;
    dataSize(): number;
    flags(): number;
    next(): DetourMeshTile;
}
export declare const createNavMeshData: (navMeshCreateParams: NavMeshCreateParams) => {
    success: boolean;
    navMeshData: UnsignedCharArray;
};
export type OffMeshConnectionParams = {
    startPosition: Vector3;
    endPosition: Vector3;
    radius: number;
    bidirectional: boolean;
    /**
     * @default 0
     */
    area?: number;
    /**
     * @default 1
     */
    flags?: number;
    userId?: number;
};
export declare class NavMeshCreateParams {
    raw: RawModule.dtNavMeshCreateParams;
    /**
     * Creates a new NavMeshCreateParams object.
     */
    constructor();
    /**
     * Creates a wrapper around an existing raw NavMeshCreateParams object.
     */
    constructor(raw: RawModule.dtNavMeshCreateParams);
    setPolyMeshCreateParams(polyMesh: RecastPolyMesh): void;
    setPolyMeshDetailCreateParams(polyMeshDetail: RecastPolyMeshDetail): void;
    setOffMeshConnections(offMeshConnections: OffMeshConnectionParams[]): void;
    verts(index: number): number;
    setVerts(index: number, value: number): void;
    vertCount(): number;
    polys(index: number): number;
    setPolys(index: number, value: number): void;
    polyAreas(index: number): number;
    setPolyAreas(index: number, value: number): void;
    polyFlags(index: number): number;
    setPolyFlags(index: number, value: number): void;
    polyCount(): number;
    nvp(): number;
    setNvp(value: number): void;
    detailMeshes(index: number): number;
    setDetailMeshes(index: number, value: number): void;
    detailVerts(index: number): number;
    setDetailVerts(index: number, value: number): void;
    detailVertsCount(): number;
    detailTris(index: number): number;
    setDetailTris(index: number, value: number): void;
    detailTriCount(): number;
    offMeshConVerts(index: number): number;
    offMeshConRad(index: number): number;
    offMeshConDir(index: number): number;
    offMeshConAreas(index: number): number;
    offMeshConFlags(index: number): number;
    offMeshConUserID(index: number): number;
    offMeshConCount(): number;
    userId(): number;
    tileX(): number;
    setTileX(value: number): void;
    tileY(): number;
    setTileY(value: number): void;
    tileLayer(): number;
    setTileLayer(value: number): void;
    boundsMin(): Vector3Tuple;
    setBoundsMin(value: Vector3Tuple): void;
    boundsMax(): Vector3Tuple;
    setBoundsMax(value: Vector3Tuple): void;
    walkableHeight(): number;
    setWalkableHeight(value: number): void;
    walkableRadius(): number;
    setWalkableRadius(value: number): void;
    walkableClimb(): number;
    setWalkableClimb(value: number): void;
    cellSize(): number;
    setCellSize(value: number): void;
    cellHeight(): number;
    setCellHeight(value: number): void;
    buildBvTree(): boolean;
    setBuildBvTree(value: boolean): void;
}
