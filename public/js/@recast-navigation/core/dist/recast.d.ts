import { Vector3Tuple } from 'three';
import { FloatArray, IntArray, UnsignedCharArray } from './arrays';
import { type RawModule } from './raw';
import { Vector2Tuple, Vector3 } from './utils';
export type RecastConfig = {
    /**
     * The size of the non-navigable border around the heightfield.
     * [Limit: >=0] [Units: vx]
     * @default 0
     */
    borderSize: number;
    /**
     * The width/height size of tile's on the xz-plane.
     * [Limit: >= 0] [Units: vx]
     * @default 0
     */
    tileSize: number;
    /**
     * The xz-plane cell size to use for fields.
     * [Limit: > 0] [Units: wu]
     * @default 0.2
     */
    cs: number;
    /**
     * The y-axis cell size to use for fields.
     * Limit: > 0] [Units: wu]
     * @default 0.2
     */
    ch: number;
    /**
     * The maximum slope that is considered walkable.
     * [Limits: 0 <= value < 90] [Units: Degrees]
     * @default 60
     */
    walkableSlopeAngle: number;
    /**
     * Minimum floor to 'ceiling' height that will still allow the floor area to be considered walkable.
     * [Limit: >= 3] [Units: vx]
     * @default 2
     */
    walkableHeight: number;
    /**
     * Maximum ledge height that is considered to still be traversable.
     * [Limit: >=0] [Units: vx]
     * @default 2
     */
    walkableClimb: number;
    /**
     * The distance to erode/shrink the walkable area of the heightfield away from obstructions.
     * [Limit: >=0] [Units: vx]
     * @default 0.5
     */
    walkableRadius: number;
    /**
     * The maximum allowed length for contour edges along the border of the mesh.
     * [Limit: >=0] [Units: vx]
     * @default 12
     */
    maxEdgeLen: number;
    /**
     * The maximum distance a simplfied contour's border edges should deviate the original raw contour.
     * [Limit: >=0] [Units: vx]
     * @default 1.3
     */
    maxSimplificationError: number;
    /**
     * The minimum number of cells allowed to form isolated island areas.
     * [Limit: >=0] [Units: vx]
     * @default 8
     */
    minRegionArea: number;
    /**
     * Any regions with a span count smaller than this value will, if possible, be merged with larger regions.
     * [Limit: >=0] [Units: vx]
     * @default 20
     */
    mergeRegionArea: number;
    /**
     * The maximum number of vertices allowed for polygons generated during the be merged with larger regions.
     * [Limit: >=0] [Units: vx]
     * @default 6
     */
    maxVertsPerPoly: number;
    /**
     * Sets the sampling distance to use when generating the detail mesh. (For height detail only.)
     * [Limits: 0 or >= 0.9] [Units: wu]
     * @default 6
     */
    detailSampleDist: number;
    /**
     * The maximum distance the detail mesh surface should deviate from heightfield data. (For height detail only.)
     * [Limit: >=0] [Units: wu]
     * @default 1
     */
    detailSampleMaxError: number;
};
export declare const recastConfigDefaults: RecastConfig;
export declare const createRcConfig: (partialConfig: Partial<RecastConfig>) => RawModule.rcConfig;
export declare const cloneRcConfig: (rcConfig: RawModule.rcConfig) => RawModule.rcConfig;
export declare class RecastBuildContext {
    raw: RawModule.RecastBuildContext;
    logs: Array<{
        category: number;
        msg: string;
    }>;
    startTimes: {
        [label: string]: number;
    };
    accumulatedTimes: {
        [label: string]: number;
    };
    constructor(timersAndLogsEnabled?: boolean);
    log(category: number, msg: string): void;
    resetLog(): void;
    startTimer(label: number): void;
    stopTimer(label: number): void;
    getAccumulatedTime(label: number): number;
    resetTimers(): void;
}
export declare class RecastChunkyTriMesh {
    raw: RawModule.rcChunkyTriMesh;
    /**
     * Creates a new RecastChunkyTriMesh.
     */
    constructor();
    /**
     * Creates a wrapper around an existing raw RecastChunkyTriMesh object.
     */
    constructor(raw: RawModule.rcChunkyTriMesh);
    init(verts: FloatArray, tris: IntArray, ntris: number, trisPerChunk: number): boolean;
    getChunksOverlappingRect(boundsMin: Vector2Tuple, boundsMax: Vector2Tuple, chunks: IntArray, maxChunks: number): number;
    getNodeTris(nodeId: number): IntArray;
    nodes(index: number): RawModule.rcChunkyTriMeshNode;
    maxTrisPerChunk(): number;
}
export declare class RecastSpan {
    raw: RawModule.rcSpan;
    constructor(raw: RawModule.rcSpan);
    smin(): number;
    smax(): number;
    area(): number;
    next(): RecastSpan | null;
}
export declare class RecastSpanPool {
    raw: RawModule.rcSpanPool;
    constructor(raw: RawModule.rcSpanPool);
    next(): RecastSpanPool | null;
    items(index: number): RecastSpan;
}
export declare class RecastHeightfield {
    raw: RawModule.rcHeightfield;
    constructor(raw: RawModule.rcHeightfield);
    width(): number;
    height(): number;
    bmin(): Vector3;
    bmax(): Vector3;
    cs(): number;
    ch(): number;
    spans(index: number): RecastSpan;
    pools(index: number): RecastSpanPool;
    freelist(index: number): RecastSpan;
}
export declare class RecastCompactCell {
    raw: RawModule.rcCompactCell;
    constructor(raw: RawModule.rcCompactCell);
    index(): number;
    count(): number;
}
export declare class RecastCompactSpan {
    raw: RawModule.rcCompactSpan;
    constructor(raw: RawModule.rcCompactSpan);
    y(): number;
    reg(): number;
    con(): number;
    h(): number;
}
export declare class RecastCompactHeightfield {
    raw: RawModule.rcCompactHeightfield;
    constructor(raw: RawModule.rcCompactHeightfield);
    width(): number;
    height(): number;
    spanCount(): number;
    walkableHeight(): number;
    walkableClimb(): number;
    borderSize(): number;
    maxDistance(): number;
    maxRegions(): number;
    bmin(): Vector3;
    bmax(): Vector3;
    cs(): number;
    ch(): number;
    cells(index: number): RecastCompactCell;
    spans(index: number): RecastCompactSpan;
    dist(index: number): number;
    areas(index: number): number;
}
export declare class RecastContour {
    raw: RawModule.rcContour;
    constructor(raw: RawModule.rcContour);
    verts(index: number): number;
    nverts(): number;
    rverts(index: number): number;
    nrverts(): number;
    reg(): number;
    area(): number;
}
export declare class RecastContourSet {
    raw: RawModule.rcContourSet;
    constructor(raw: RawModule.rcContourSet);
    conts(index: number): RecastContour;
    nconts(): number;
    bmin(): Vector3;
    bmax(): Vector3;
    cs(): number;
    ch(): number;
    width(): number;
    height(): number;
    borderSize(): number;
    maxError(): number;
}
export declare class RecastHeightfieldLayer {
    raw: RawModule.rcHeightfieldLayer;
    constructor(raw: RawModule.rcHeightfieldLayer);
    bmin(): Vector3;
    bmax(): Vector3;
    cs(): number;
    ch(): number;
    width(): number;
    height(): number;
    minx(): number;
    maxx(): number;
    miny(): number;
    maxy(): number;
    hmin(): number;
    hmax(): number;
    heights(index: number): number;
    areas(index: number): number;
    cons(index: number): number;
}
export declare class RecastHeightfieldLayerSet {
    raw: RawModule.rcHeightfieldLayerSet;
    constructor(raw: RawModule.rcHeightfieldLayerSet);
    layers(index: number): RecastHeightfieldLayer;
    nlayers(): number;
}
export declare class RecastPolyMesh {
    raw: RawModule.rcPolyMesh;
    constructor(raw: RawModule.rcPolyMesh);
    verts(index: number): number;
    polys(index: number): number;
    regs(index: number): number;
    flags(index: number): number;
    setFlags(index: number, value: number): void;
    areas(index: number): number;
    setAreas(index: number, value: number): void;
    nverts(): number;
    npolys(): number;
    maxpolys(): number;
    nvp(): number;
    bmin(): Vector3;
    bmax(): Vector3;
    cs(): number;
    ch(): number;
    borderSize(): number;
    maxEdgeError(): number;
}
export declare class RecastPolyMeshDetail {
    raw: RawModule.rcPolyMeshDetail;
    constructor(raw: RawModule.rcPolyMeshDetail);
    meshes(index: number): number;
    verts(index: number): number;
    tris(index: number): number;
    nmeshes(): number;
    nverts(): number;
    ntris(): number;
}
export declare const calcBounds: (verts: FloatArray, nv: number) => RawModule.RecastCalcBoundsResult;
export declare const calcGridSize: (bmin: Vector3Tuple, bmax: Vector3Tuple, cs: number) => RawModule.RecastCalcGridSizeResult;
export declare const createHeightfield: (buildContext: RecastBuildContext, heightfield: RecastHeightfield, width: number, height: number, bmin: Vector3Tuple, bmax: Vector3Tuple, cs: number, ch: number) => boolean;
export declare const markWalkableTriangles: (buildContext: RecastBuildContext, walkableSlopeAngle: number, verts: FloatArray, nv: number, tris: IntArray, nt: number, areas: UnsignedCharArray) => void;
export declare const clearUnwalkableTriangles: (buildContext: RecastBuildContext, walkableSlopeAngle: number, verts: FloatArray, nv: number, tris: IntArray, nt: number, areas: UnsignedCharArray) => void;
export declare const rasterizeTriangles: (buildContext: RecastBuildContext, verts: FloatArray, nv: number, tris: IntArray, areas: UnsignedCharArray, nt: number, heightfield: RecastHeightfield, flagMergeThreshold?: number) => boolean;
export declare const filterLowHangingWalkableObstacles: (buildContext: RecastBuildContext, walkableClimb: number, heightfield: RecastHeightfield) => void;
export declare const filterLedgeSpans: (buildContext: RecastBuildContext, walkableHeight: number, walkableClimb: number, heightfield: RecastHeightfield) => void;
export declare const filterWalkableLowHeightSpans: (buildContext: RecastBuildContext, walkableHeight: number, heightfield: RecastHeightfield) => void;
export declare const getHeightFieldSpanCount: (buildContext: RecastBuildContext, heightfield: RecastHeightfield) => number;
export declare const buildCompactHeightfield: (buildContext: RecastBuildContext, walkableHeight: number, walkableClimb: number, heightfield: RecastHeightfield, compactHeightfield: RecastCompactHeightfield) => boolean;
export declare const erodeWalkableArea: (buildContext: RecastBuildContext, radius: number, compactHeightfield: RecastCompactHeightfield) => boolean;
export declare const medianFilterWalkableArea: (buildContext: RecastBuildContext, compactHeightfield: RecastCompactHeightfield) => boolean;
export declare const markBoxArea: (buildContext: RecastBuildContext, bmin: Vector3Tuple, bmax: Vector3Tuple, areaId: number, compactHeightfield: RecastCompactHeightfield) => void;
export declare const markConvexPolyArea: (buildContext: RecastBuildContext, verts: FloatArray, nverts: number, hmin: number, hmax: number, areaId: number, compactHeightfield: RecastCompactHeightfield) => void;
export declare const markCylinderArea: (buildContext: RecastBuildContext, pos: Vector3Tuple, radius: number, height: number, areaId: number, compactHeightfield: RecastCompactHeightfield) => void;
export declare const buildDistanceField: (buildContext: RecastBuildContext, compactHeightfield: RecastCompactHeightfield) => boolean;
export declare const buildRegions: (buildContext: RecastBuildContext, compactHeightfield: RecastCompactHeightfield, borderSize: number, minRegionArea: number, mergeRegionArea: number) => boolean;
export declare const buildLayerRegions: (buildContext: RecastBuildContext, compactHeightfield: RecastCompactHeightfield, borderSize: number, minRegionArea: number) => boolean;
export declare const buildRegionsMonotone: (buildContext: RecastBuildContext, compactHeightfield: RecastCompactHeightfield, borderSize: number, minRegionArea: number, mergeRegionArea: number) => boolean;
export declare const setCon: (compactSpan: RecastCompactSpan, dir: number, i: number) => void;
export declare const getCon: (compactSpan: RecastCompactSpan, dir: number) => number;
export declare const getDirOffsetX: (dir: number) => number;
export declare const getDirOffsetY: (dir: number) => number;
export declare const getDirForOffset: (x: number, y: number) => number;
export declare const buildHeightfieldLayers: (buildContext: RecastBuildContext, compactHeightfield: RecastCompactHeightfield, borderSize: number, walkableHeight: number, heightfieldLayerSet: RecastHeightfieldLayerSet) => boolean;
export declare const buildContours: (buildContext: RecastBuildContext, compactHeightfield: RecastCompactHeightfield, maxError: number, maxEdgeLen: number, contourSet: RecastContourSet, buildFlags?: number) => boolean;
export declare const buildPolyMesh: (buildContext: RecastBuildContext, contourSet: RecastContourSet, nvp: number, polyMesh: RecastPolyMesh) => boolean;
export declare const mergePolyMeshes: (buildContext: RecastBuildContext, meshes: RecastPolyMesh[], outPolyMesh: RecastPolyMesh) => boolean;
export declare const buildPolyMeshDetail: (buildContext: RecastBuildContext, mesh: RecastPolyMesh, compactHeightfield: RecastCompactHeightfield, sampleDist: number, sampleMaxError: number, polyMeshDetail: RecastPolyMeshDetail) => boolean;
export declare const copyPolyMesh: (buildContext: RecastBuildContext, src: RecastPolyMesh, dest: RecastPolyMesh) => boolean;
export declare const mergePolyMeshDetails: (buildContext: RecastBuildContext, meshes: RecastPolyMeshDetail[], out: RecastPolyMeshDetail) => boolean;
export declare const getHeightfieldLayerHeights: (heightfieldLayer: RecastHeightfieldLayer) => UnsignedCharArray;
export declare const getHeightfieldLayerAreas: (heightfieldLayer: RecastHeightfieldLayer) => UnsignedCharArray;
export declare const getHeightfieldLayerCons: (heightfieldLayer: RecastHeightfieldLayer) => UnsignedCharArray;
export declare const allocHeightfield: () => RecastHeightfield;
export declare const freeHeightfield: (heightfield: RecastHeightfield) => void;
export declare const allocCompactHeightfield: () => RecastCompactHeightfield;
export declare const freeCompactHeightfield: (compactHeightfield: RecastCompactHeightfield) => void;
export declare const allocHeightfieldLayerSet: () => RecastHeightfieldLayerSet;
export declare const freeHeightfieldLayerSet: (heightfieldLayerSet: RecastHeightfieldLayerSet) => void;
export declare const allocContourSet: () => RecastContourSet;
export declare const freeContourSet: (contourSet: RecastContourSet) => void;
export declare const allocPolyMesh: () => RecastPolyMesh;
export declare const freePolyMesh: (polyMesh: RecastPolyMesh) => void;
export declare const allocPolyMeshDetail: () => RecastPolyMeshDetail;
export declare const freePolyMeshDetail: (polyMeshDetail: RecastPolyMeshDetail) => void;
