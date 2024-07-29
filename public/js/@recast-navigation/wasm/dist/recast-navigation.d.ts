export default Recast;
declare function Recast<T>(target?: T): Promise<T & typeof Recast>;
declare module Recast {
    function destroy(obj: any): void;
    function _malloc(size: number): number;
    function _free(ptr: number): void;
    function wrapPointer<C extends new (...args: any) => any>(ptr: number, Class: C): InstanceType<C>;
    function getPointer(obj: unknown): number;
    function castObject<C extends new (...args: any) => any>(object: unknown, Class: C): InstanceType<C>;
    function compare(object1: unknown, object2: unknown): boolean;
    const HEAP8: Int8Array;
    const HEAP16: Int16Array;
    const HEAP32: Int32Array;
    const HEAPU8: Uint8Array;
    const HEAPU16: Uint16Array;
    const HEAPU32: Uint32Array;
    const HEAPF32: Float32Array;
    const HEAPF64: Float64Array;
    class rcConfig {
        constructor();
        get_width(): number;
        set_width(width: number): void;
        width: number;
        get_height(): number;
        set_height(height: number): void;
        height: number;
        get_tileSize(): number;
        set_tileSize(tileSize: number): void;
        tileSize: number;
        get_borderSize(): number;
        set_borderSize(borderSize: number): void;
        borderSize: number;
        get_cs(): number;
        set_cs(cs: number): void;
        cs: number;
        get_ch(): number;
        set_ch(ch: number): void;
        ch: number;
        get_bmin(index: number): number;
        set_bmin(index: number, bmin: number): void;
        bmin: number;
        get_bmax(index: number): number;
        set_bmax(index: number, bmax: number): void;
        bmax: number;
        get_walkableSlopeAngle(): number;
        set_walkableSlopeAngle(walkableSlopeAngle: number): void;
        walkableSlopeAngle: number;
        get_walkableHeight(): number;
        set_walkableHeight(walkableHeight: number): void;
        walkableHeight: number;
        get_walkableClimb(): number;
        set_walkableClimb(walkableClimb: number): void;
        walkableClimb: number;
        get_walkableRadius(): number;
        set_walkableRadius(walkableRadius: number): void;
        walkableRadius: number;
        get_maxEdgeLen(): number;
        set_maxEdgeLen(maxEdgeLen: number): void;
        maxEdgeLen: number;
        get_maxSimplificationError(): number;
        set_maxSimplificationError(maxSimplificationError: number): void;
        maxSimplificationError: number;
        get_minRegionArea(): number;
        set_minRegionArea(minRegionArea: number): void;
        minRegionArea: number;
        get_mergeRegionArea(): number;
        set_mergeRegionArea(mergeRegionArea: number): void;
        mergeRegionArea: number;
        get_maxVertsPerPoly(): number;
        set_maxVertsPerPoly(maxVertsPerPoly: number): void;
        maxVertsPerPoly: number;
        get_detailSampleDist(): number;
        set_detailSampleDist(detailSampleDist: number): void;
        detailSampleDist: number;
        get_detailSampleMaxError(): number;
        set_detailSampleMaxError(detailSampleMaxError: number): void;
        detailSampleMaxError: number;
    }
    class dtMeshHeader {
        get_magic(): number;
        set_magic(magic: number): void;
        magic: number;
        get_version(): number;
        set_version(version: number): void;
        version: number;
        get_x(): number;
        set_x(x: number): void;
        x: number;
        get_y(): number;
        set_y(y: number): void;
        y: number;
        get_layer(): number;
        set_layer(layer: number): void;
        layer: number;
        get_userId(): number;
        set_userId(userId: number): void;
        userId: number;
        get_polyCount(): number;
        set_polyCount(polyCount: number): void;
        polyCount: number;
        get_vertCount(): number;
        set_vertCount(vertCount: number): void;
        vertCount: number;
        get_maxLinkCount(): number;
        set_maxLinkCount(maxLinkCount: number): void;
        maxLinkCount: number;
        get_detailMeshCount(): number;
        set_detailMeshCount(detailMeshCount: number): void;
        detailMeshCount: number;
        get_detailVertCount(): number;
        set_detailVertCount(detailVertCount: number): void;
        detailVertCount: number;
        get_detailTriCount(): number;
        set_detailTriCount(detailTriCount: number): void;
        detailTriCount: number;
        get_bvNodeCount(): number;
        set_bvNodeCount(bvNodeCount: number): void;
        bvNodeCount: number;
        get_offMeshConCount(): number;
        set_offMeshConCount(offMeshConCount: number): void;
        offMeshConCount: number;
        get_offMeshBase(): number;
        set_offMeshBase(offMeshBase: number): void;
        offMeshBase: number;
        get_walkableHeight(): number;
        set_walkableHeight(walkableHeight: number): void;
        walkableHeight: number;
        get_walkableRadius(): number;
        set_walkableRadius(walkableRadius: number): void;
        walkableRadius: number;
        get_walkableClimb(): number;
        set_walkableClimb(walkableClimb: number): void;
        walkableClimb: number;
        get_bmin(index: number): number;
        set_bmin(index: number, bmin: number): void;
        bmin: number;
        get_bmax(index: number): number;
        set_bmax(index: number, bmax: number): void;
        bmax: number;
        get_bvQuantFactor(): number;
        set_bvQuantFactor(bvQuantFactor: number): void;
        bvQuantFactor: number;
    }
    class dtPoly {
        get_firstLink(): number;
        set_firstLink(firstLink: number): void;
        firstLink: number;
        get_verts(index: number): number;
        set_verts(index: number, verts: number): void;
        verts: number;
        get_neis(index: number): number;
        set_neis(index: number, neis: number): void;
        neis: number;
        get_flags(): number;
        set_flags(flags: number): void;
        flags: number;
        get_vertCount(): number;
        set_vertCount(vertCount: number): void;
        vertCount: number;
        get_areaAndtype(): number;
        set_areaAndtype(areaAndtype: number): void;
        areaAndtype: number;
        setArea(a: number): void;
        setType(a: number): void;
        getType(): number;
        getArea(): number;
    }
    class dtPolyDetail {
        get_vertBase(): number;
        set_vertBase(vertBase: number): void;
        vertBase: number;
        get_triBase(): number;
        set_triBase(triBase: number): void;
        triBase: number;
        get_vertCount(): number;
        set_vertCount(vertCount: number): void;
        vertCount: number;
        get_triCount(): number;
        set_triCount(triCount: number): void;
        triCount: number;
    }
    class dtLink {
        get_ref(): number;
        set_ref(ref: number): void;
        ref: number;
        get_next(): number;
        set_next(next: number): void;
        next: number;
        get_edge(): number;
        set_edge(edge: number): void;
        edge: number;
        get_side(): number;
        set_side(side: number): void;
        side: number;
        get_bmin(): number;
        set_bmin(bmin: number): void;
        bmin: number;
        get_bmax(): number;
        set_bmax(bmax: number): void;
        bmax: number;
    }
    class dtBVNode {
        get_bmin(index: number): number;
        set_bmin(index: number, bmin: number): void;
        bmin: number;
        get_bmax(index: number): number;
        set_bmax(index: number, bmax: number): void;
        bmax: number;
        get_i(): number;
        set_i(i: number): void;
        i: number;
    }
    class dtOffMeshConnection {
        get_pos(index: number): number;
        set_pos(index: number, pos: number): void;
        pos: number;
        get_rad(): number;
        set_rad(rad: number): void;
        rad: number;
        get_poly(): number;
        set_poly(poly: number): void;
        poly: number;
        get_flags(): number;
        set_flags(flags: number): void;
        flags: number;
        get_side(): number;
        set_side(side: number): void;
        side: number;
        get_userId(): number;
        set_userId(userId: number): void;
        userId: number;
    }
    class dtMeshTile {
        get_salt(): number;
        set_salt(salt: number): void;
        salt: number;
        get_linksFreeList(): number;
        set_linksFreeList(linksFreeList: number): void;
        linksFreeList: number;
        get_header(): dtMeshHeader;
        set_header(header: dtMeshHeader): void;
        header: dtMeshHeader;
        get_polys(index: number): dtPoly;
        set_polys(index: number, polys: dtPoly): void;
        polys: dtPoly;
        get_verts(index: number): number;
        set_verts(index: number, verts: number): void;
        verts: number;
        get_links(index: number): dtLink;
        set_links(index: number, links: dtLink): void;
        links: dtLink;
        get_detailMeshes(index: number): dtPolyDetail;
        set_detailMeshes(index: number, detailMeshes: dtPolyDetail): void;
        detailMeshes: dtPolyDetail;
        get_detailVerts(index: number): number;
        set_detailVerts(index: number, detailVerts: number): void;
        detailVerts: number;
        get_detailTris(index: number): number;
        set_detailTris(index: number, detailTris: number): void;
        detailTris: number;
        get_bvTree(index: number): dtBVNode;
        set_bvTree(index: number, bvTree: dtBVNode): void;
        bvTree: dtBVNode;
        get_offMeshCons(index: number): dtOffMeshConnection;
        set_offMeshCons(index: number, offMeshCons: dtOffMeshConnection): void;
        offMeshCons: dtOffMeshConnection;
        get_data(index: number): number;
        set_data(index: number, data: number): void;
        data: number;
        get_dataSize(): number;
        set_dataSize(dataSize: number): void;
        dataSize: number;
        get_flags(): number;
        set_flags(flags: number): void;
        flags: number;
        get_next(): dtMeshTile;
        set_next(next: dtMeshTile): void;
        next: dtMeshTile;
    }
    class dtNavMesh {
    }
    class dtNavMeshCreateParams {
        constructor();
        get_verts(index: number): number;
        set_verts(index: number, verts: number): void;
        readonly verts: number;
        get_vertCount(): number;
        set_vertCount(vertCount: number): void;
        vertCount: number;
        get_polys(index: number): number;
        set_polys(index: number, polys: number): void;
        readonly polys: number;
        get_polyFlags(index: number): number;
        set_polyFlags(index: number, polyFlags: number): void;
        readonly polyFlags: number;
        get_polyAreas(index: number): number;
        set_polyAreas(index: number, polyAreas: number): void;
        readonly polyAreas: number;
        get_polyCount(): number;
        set_polyCount(polyCount: number): void;
        polyCount: number;
        get_nvp(): number;
        set_nvp(nvp: number): void;
        nvp: number;
        get_detailMeshes(index: number): number;
        set_detailMeshes(index: number, detailMeshes: number): void;
        readonly detailMeshes: number;
        get_detailVerts(index: number): number;
        set_detailVerts(index: number, detailVerts: number): void;
        readonly detailVerts: number;
        get_detailVertsCount(): number;
        set_detailVertsCount(detailVertsCount: number): void;
        detailVertsCount: number;
        get_detailTris(index: number): number;
        set_detailTris(index: number, detailTris: number): void;
        readonly detailTris: number;
        get_detailTriCount(): number;
        set_detailTriCount(detailTriCount: number): void;
        detailTriCount: number;
        get_offMeshConVerts(index: number): number;
        set_offMeshConVerts(index: number, offMeshConVerts: number): void;
        readonly offMeshConVerts: number;
        get_offMeshConRad(index: number): number;
        set_offMeshConRad(index: number, offMeshConRad: number): void;
        readonly offMeshConRad: number;
        get_offMeshConFlags(index: number): number;
        set_offMeshConFlags(index: number, offMeshConFlags: number): void;
        readonly offMeshConFlags: number;
        get_offMeshConAreas(index: number): number;
        set_offMeshConAreas(index: number, offMeshConAreas: number): void;
        readonly offMeshConAreas: number;
        get_offMeshConDir(index: number): number;
        set_offMeshConDir(index: number, offMeshConDir: number): void;
        readonly offMeshConDir: number;
        get_offMeshConUserID(index: number): number;
        set_offMeshConUserID(index: number, offMeshConUserID: number): void;
        readonly offMeshConUserID: number;
        get_offMeshConCount(): number;
        set_offMeshConCount(offMeshConCount: number): void;
        offMeshConCount: number;
        get_userId(): number;
        set_userId(userId: number): void;
        userId: number;
        get_tileX(): number;
        set_tileX(tileX: number): void;
        tileX: number;
        get_tileY(): number;
        set_tileY(tileY: number): void;
        tileY: number;
        get_tileLayer(): number;
        set_tileLayer(tileLayer: number): void;
        tileLayer: number;
        get_bmin(index: number): number;
        set_bmin(index: number, bmin: number): void;
        bmin: number;
        get_bmax(index: number): number;
        set_bmax(index: number, bmax: number): void;
        bmax: number;
        get_walkableHeight(): number;
        set_walkableHeight(walkableHeight: number): void;
        walkableHeight: number;
        get_walkableRadius(): number;
        set_walkableRadius(walkableRadius: number): void;
        walkableRadius: number;
        get_walkableClimb(): number;
        set_walkableClimb(walkableClimb: number): void;
        walkableClimb: number;
        get_cs(): number;
        set_cs(cs: number): void;
        cs: number;
        get_ch(): number;
        set_ch(ch: number): void;
        ch: number;
        get_buildBvTree(): boolean;
        set_buildBvTree(buildBvTree: boolean): void;
        buildBvTree: boolean;
    }
    class dtObstacleRef {
    }
    class dtCompressedTileRef {
    }
    class dtNavMeshParams {
        constructor();
        get_orig(index: number): number;
        set_orig(index: number, orig: number): void;
        orig: number;
        get_tileWidth(): number;
        set_tileWidth(tileWidth: number): void;
        tileWidth: number;
        get_tileHeight(): number;
        set_tileHeight(tileHeight: number): void;
        tileHeight: number;
        get_maxTiles(): number;
        set_maxTiles(maxTiles: number): void;
        maxTiles: number;
        get_maxPolys(): number;
        set_maxPolys(maxPolys: number): void;
        maxPolys: number;
    }
    class dtCrowdAgentParams {
        constructor();
        get_radius(): number;
        set_radius(radius: number): void;
        radius: number;
        get_height(): number;
        set_height(height: number): void;
        height: number;
        get_maxAcceleration(): number;
        set_maxAcceleration(maxAcceleration: number): void;
        maxAcceleration: number;
        get_maxSpeed(): number;
        set_maxSpeed(maxSpeed: number): void;
        maxSpeed: number;
        get_collisionQueryRange(): number;
        set_collisionQueryRange(collisionQueryRange: number): void;
        collisionQueryRange: number;
        get_pathOptimizationRange(): number;
        set_pathOptimizationRange(pathOptimizationRange: number): void;
        pathOptimizationRange: number;
        get_separationWeight(): number;
        set_separationWeight(separationWeight: number): void;
        separationWeight: number;
        get_updateFlags(): number;
        set_updateFlags(updateFlags: number): void;
        updateFlags: number;
        get_obstacleAvoidanceType(): number;
        set_obstacleAvoidanceType(obstacleAvoidanceType: number): void;
        obstacleAvoidanceType: number;
        get_queryFilterType(): number;
        set_queryFilterType(queryFilterType: number): void;
        queryFilterType: number;
        get_userData(): unknown;
        set_userData(userData: unknown): void;
        userData: unknown;
    }
    class rcSpan {
        get_smin(): number;
        set_smin(smin: number): void;
        smin: number;
        get_smax(): number;
        set_smax(smax: number): void;
        smax: number;
        get_area(): number;
        set_area(area: number): void;
        area: number;
        get_next(): rcSpan;
        set_next(next: rcSpan): void;
        next: rcSpan;
    }
    class rcSpanPool {
        get_next(): rcSpanPool;
        set_next(next: rcSpanPool): void;
        next: rcSpanPool;
        get_items(index: number): rcSpan;
        set_items(index: number, items: rcSpan): void;
        items: rcSpan;
    }
    class rcHeightfield {
        get_width(): number;
        set_width(width: number): void;
        width: number;
        get_height(): number;
        set_height(height: number): void;
        height: number;
        get_bmin(index: number): number;
        set_bmin(index: number, bmin: number): void;
        bmin: number;
        get_bmax(index: number): number;
        set_bmax(index: number, bmax: number): void;
        bmax: number;
        get_cs(): number;
        set_cs(cs: number): void;
        cs: number;
        get_ch(): number;
        set_ch(ch: number): void;
        ch: number;
        get_spans(index: number): rcSpan;
        set_spans(index: number, spans: rcSpan): void;
        spans: rcSpan;
        get_pools(index: number): rcSpanPool;
        set_pools(index: number, pools: rcSpanPool): void;
        pools: rcSpanPool;
        get_freelist(index: number): rcSpan;
        set_freelist(index: number, freelist: rcSpan): void;
        freelist: rcSpan;
    }
    class rcCompactCell {
        get_index(): number;
        set_index(index: number): void;
        index: number;
        get_count(): number;
        set_count(count: number): void;
        count: number;
    }
    class rcCompactSpan {
        get_y(): number;
        set_y(y: number): void;
        y: number;
        get_reg(): number;
        set_reg(reg: number): void;
        reg: number;
        get_con(): number;
        set_con(con: number): void;
        con: number;
        get_h(): number;
        set_h(h: number): void;
        h: number;
    }
    class rcCompactHeightfield {
        get_width(): number;
        set_width(width: number): void;
        width: number;
        get_height(): number;
        set_height(height: number): void;
        height: number;
        get_spanCount(): number;
        set_spanCount(spanCount: number): void;
        spanCount: number;
        get_walkableHeight(): number;
        set_walkableHeight(walkableHeight: number): void;
        walkableHeight: number;
        get_walkableClimb(): number;
        set_walkableClimb(walkableClimb: number): void;
        walkableClimb: number;
        get_borderSize(): number;
        set_borderSize(borderSize: number): void;
        borderSize: number;
        get_maxDistance(): number;
        set_maxDistance(maxDistance: number): void;
        maxDistance: number;
        get_maxRegions(): number;
        set_maxRegions(maxRegions: number): void;
        maxRegions: number;
        get_bmin(index: number): number;
        set_bmin(index: number, bmin: number): void;
        bmin: number;
        get_bmax(index: number): number;
        set_bmax(index: number, bmax: number): void;
        bmax: number;
        get_cs(): number;
        set_cs(cs: number): void;
        cs: number;
        get_ch(): number;
        set_ch(ch: number): void;
        ch: number;
        get_cells(index: number): rcCompactCell;
        set_cells(index: number, cells: rcCompactCell): void;
        cells: rcCompactCell;
        get_spans(index: number): rcCompactSpan;
        set_spans(index: number, spans: rcCompactSpan): void;
        spans: rcCompactSpan;
        get_dist(index: number): number;
        set_dist(index: number, dist: number): void;
        dist: number;
        get_areas(index: number): number;
        set_areas(index: number, areas: number): void;
        areas: number;
    }
    class rcContour {
        get_verts(index: number): number;
        set_verts(index: number, verts: number): void;
        verts: number;
        get_nverts(): number;
        set_nverts(nverts: number): void;
        nverts: number;
        get_rverts(index: number): number;
        set_rverts(index: number, rverts: number): void;
        rverts: number;
        get_nrverts(): number;
        set_nrverts(nrverts: number): void;
        nrverts: number;
        get_reg(): number;
        set_reg(reg: number): void;
        reg: number;
        get_area(): number;
        set_area(area: number): void;
        area: number;
    }
    class rcContourSet {
        get_conts(index: number): rcContour;
        set_conts(index: number, conts: rcContour): void;
        conts: rcContour;
        get_nconts(): number;
        set_nconts(nconts: number): void;
        nconts: number;
        get_bmin(index: number): number;
        set_bmin(index: number, bmin: number): void;
        bmin: number;
        get_bmax(index: number): number;
        set_bmax(index: number, bmax: number): void;
        bmax: number;
        get_cs(): number;
        set_cs(cs: number): void;
        cs: number;
        get_ch(): number;
        set_ch(ch: number): void;
        ch: number;
        get_width(): number;
        set_width(width: number): void;
        width: number;
        get_height(): number;
        set_height(height: number): void;
        height: number;
        get_borderSize(): number;
        set_borderSize(borderSize: number): void;
        borderSize: number;
        get_maxError(): number;
        set_maxError(maxError: number): void;
        maxError: number;
    }
    class rcHeightfieldLayer {
        get_bmin(index: number): number;
        set_bmin(index: number, bmin: number): void;
        bmin: number;
        get_bmax(index: number): number;
        set_bmax(index: number, bmax: number): void;
        bmax: number;
        get_cs(): number;
        set_cs(cs: number): void;
        cs: number;
        get_ch(): number;
        set_ch(ch: number): void;
        ch: number;
        get_width(): number;
        set_width(width: number): void;
        width: number;
        get_height(): number;
        set_height(height: number): void;
        height: number;
        get_minx(): number;
        set_minx(minx: number): void;
        minx: number;
        get_maxx(): number;
        set_maxx(maxx: number): void;
        maxx: number;
        get_miny(): number;
        set_miny(miny: number): void;
        miny: number;
        get_maxy(): number;
        set_maxy(maxy: number): void;
        maxy: number;
        get_hmin(): number;
        set_hmin(hmin: number): void;
        hmin: number;
        get_hmax(): number;
        set_hmax(hmax: number): void;
        hmax: number;
        get_heights(index: number): number;
        set_heights(index: number, heights: number): void;
        heights: number;
        get_areas(index: number): number;
        set_areas(index: number, areas: number): void;
        areas: number;
        get_cons(index: number): number;
        set_cons(index: number, cons: number): void;
        cons: number;
    }
    class rcHeightfieldLayerSet {
        get_layers(index: number): rcHeightfieldLayer;
        set_layers(index: number, layers: rcHeightfieldLayer): void;
        layers: rcHeightfieldLayer;
        get_nlayers(): number;
        set_nlayers(nlayers: number): void;
        nlayers: number;
    }
    class rcPolyMesh {
        get_verts(index: number): number;
        set_verts(index: number, verts: number): void;
        verts: number;
        get_polys(index: number): number;
        set_polys(index: number, polys: number): void;
        polys: number;
        get_regs(index: number): number;
        set_regs(index: number, regs: number): void;
        regs: number;
        get_flags(index: number): number;
        set_flags(index: number, flags: number): void;
        flags: number;
        get_areas(index: number): number;
        set_areas(index: number, areas: number): void;
        areas: number;
        get_nverts(): number;
        set_nverts(nverts: number): void;
        nverts: number;
        get_npolys(): number;
        set_npolys(npolys: number): void;
        npolys: number;
        get_maxpolys(): number;
        set_maxpolys(maxpolys: number): void;
        maxpolys: number;
        get_nvp(): number;
        set_nvp(nvp: number): void;
        nvp: number;
        get_bmin(index: number): number;
        set_bmin(index: number, bmin: number): void;
        bmin: number;
        get_bmax(index: number): number;
        set_bmax(index: number, bmax: number): void;
        bmax: number;
        get_cs(): number;
        set_cs(cs: number): void;
        cs: number;
        get_ch(): number;
        set_ch(ch: number): void;
        ch: number;
        get_borderSize(): number;
        set_borderSize(borderSize: number): void;
        borderSize: number;
        get_maxEdgeError(): number;
        set_maxEdgeError(maxEdgeError: number): void;
        maxEdgeError: number;
    }
    class rcPolyMeshDetail {
        get_meshes(index: number): number;
        set_meshes(index: number, meshes: number): void;
        meshes: number;
        get_verts(index: number): number;
        set_verts(index: number, verts: number): void;
        verts: number;
        get_tris(index: number): number;
        set_tris(index: number, tris: number): void;
        tris: number;
        get_nmeshes(): number;
        set_nmeshes(nmeshes: number): void;
        nmeshes: number;
        get_nverts(): number;
        set_nverts(nverts: number): void;
        nverts: number;
        get_ntris(): number;
        set_ntris(ntris: number): void;
        ntris: number;
    }
    class Vec3 {
        get_x(): number;
        set_x(x: number): void;
        x: number;
        get_y(): number;
        set_y(y: number): void;
        y: number;
        get_z(): number;
        set_z(z: number): void;
        z: number;
        constructor();
        constructor(x: number, y: number, z: number);
    }
    class NavMeshRemoveTileResult {
        get_status(): number;
        set_status(status: number): void;
        status: number;
        get_data(index: number): number;
        set_data(index: number, data: number): void;
        data: number;
        get_dataSize(): number;
        set_dataSize(dataSize: number): void;
        dataSize: number;
    }
    class NavMeshCalcTileLocResult {
        get_tileX(): number;
        set_tileX(tileX: number): void;
        tileX: number;
        get_tileY(): number;
        set_tileY(tileY: number): void;
        tileY: number;
    }
    class NavMeshGetTilesAtResult {
        get_tiles(index: number): dtMeshTile;
        set_tiles(index: number, tiles: dtMeshTile): void;
        readonly tiles: dtMeshTile;
        get_tileCount(): number;
        set_tileCount(tileCount: number): void;
        tileCount: number;
    }
    class NavMeshGetTileAndPolyByRefResult {
        get_status(): number;
        set_status(status: number): void;
        status: number;
        get_tile(): dtMeshTile;
        set_tile(tile: dtMeshTile): void;
        tile: dtMeshTile;
        get_poly(): dtPoly;
        set_poly(poly: dtPoly): void;
        poly: dtPoly;
    }
    class NavMeshStoreTileStateResult {
        get_status(): number;
        set_status(status: number): void;
        status: number;
        get_data(index: number): number;
        set_data(index: number, data: number): void;
        data: number;
        get_dataSize(): number;
        set_dataSize(dataSize: number): void;
        dataSize: number;
    }
    class NavMesh {
        constructor();
        constructor(navMesh: dtNavMesh);
        get_m_navMesh(): dtNavMesh;
        set_m_navMesh(m_navMesh: dtNavMesh): void;
        m_navMesh: dtNavMesh;
        initSolo(navMeshData: UnsignedCharArray): boolean;
        initTiled(params: dtNavMeshParams): boolean;
        addTile(navMeshData: UnsignedCharArray, flags: number, lastRef: number, tileRef: UnsignedIntRef): number;
        decodePolyId(polyRef: number, salt: UnsignedIntRef, it: UnsignedIntRef, ip: UnsignedIntRef): void;
        encodePolyId(salt: number, it: number, ip: number): number;
        removeTile(ref: number): NavMeshRemoveTileResult;
        getNavMesh(): dtNavMesh;
        calcTileLoc(pos: ReadonlyArray<number>): NavMeshCalcTileLocResult;
        getTileAt(x: number, y: number, layer: number): dtMeshTile;
        getTilesAt(x: number, y: number, maxTiles: number): NavMeshGetTilesAtResult;
        getTileRefAt(x: number, y: number, layer: number): number;
        getTileRef(tile: dtMeshTile): number;
        getTileByRef(ref: number): dtMeshTile;
        getMaxTiles(): number;
        getTile(i: number): dtMeshTile;
        getTileAndPolyByRef(ref: number): NavMeshGetTileAndPolyByRefResult;
        getTileAndPolyByRefUnsafe(ref: number): NavMeshGetTileAndPolyByRefResult;
        isValidPolyRef(ref: number): boolean;
        getPolyRefBase(tile: dtMeshTile): number;
        getOffMeshConnectionPolyEndPoints(prevRef: number, polyRef: number, startPos: Vec3, endPos: Vec3): number;
        getOffMeshConnectionByRef(ref: number): dtOffMeshConnection;
        setPolyFlags(ref: number, flags: number): number;
        getPolyFlags(ref: number, flags: UnsignedShortRef): number;
        setPolyArea(ref: number, area: number): number;
        getPolyArea(ref: number, area: UnsignedCharRef): number;
        getTileStateSize(tile: dtMeshTile): number;
        storeTileState(tile: dtMeshTile, maxDataSize: number): NavMeshStoreTileStateResult;
        restoreTileState(tile: dtMeshTile, data: ReadonlyArray<number>, maxDataSize: number): number;
        destroy(): void;
    }
    class FastRand {
        getSeed(): number;
        setSeed(seed: number): void;
    }
    class dtRaycastHit {
        constructor();
        get_t(): number;
        set_t(t: number): void;
        t: number;
        get_hitNormal(index: number): number;
        set_hitNormal(index: number, hitNormal: number): void;
        hitNormal: number;
        get_hitEdgeIndex(): number;
        set_hitEdgeIndex(hitEdgeIndex: number): void;
        hitEdgeIndex: number;
        get_path(index: number): number;
        set_path(index: number, path: number): void;
        path: number;
        get_pathCount(): number;
        set_pathCount(pathCount: number): void;
        pathCount: number;
        get_maxPath(): number;
        set_maxPath(maxPath: number): void;
        maxPath: number;
        get_pathCost(): number;
        set_pathCost(pathCost: number): void;
        pathCost: number;
    }
    const DT_STRAIGHTPATH_START: number;
    const DT_STRAIGHTPATH_END: number;
    const DT_STRAIGHTPATH_OFFMESH_CONNECTION: number;
    type dtStraightPathFlags = typeof DT_STRAIGHTPATH_START | typeof DT_STRAIGHTPATH_END | typeof DT_STRAIGHTPATH_OFFMESH_CONNECTION;
    function _emscripten_enum_dtStraightPathFlags_DT_STRAIGHTPATH_START(): dtStraightPathFlags;
    function _emscripten_enum_dtStraightPathFlags_DT_STRAIGHTPATH_END(): dtStraightPathFlags;
    function _emscripten_enum_dtStraightPathFlags_DT_STRAIGHTPATH_OFFMESH_CONNECTION(): dtStraightPathFlags;
    const DT_STRAIGHTPATH_AREA_CROSSINGS: number;
    const DT_STRAIGHTPATH_ALL_CROSSINGS: number;
    type dtStraightPathOptions = typeof DT_STRAIGHTPATH_AREA_CROSSINGS | typeof DT_STRAIGHTPATH_ALL_CROSSINGS;
    function _emscripten_enum_dtStraightPathOptions_DT_STRAIGHTPATH_AREA_CROSSINGS(): dtStraightPathOptions;
    function _emscripten_enum_dtStraightPathOptions_DT_STRAIGHTPATH_ALL_CROSSINGS(): dtStraightPathOptions;
    const DT_FINDPATH_ANY_ANGLE: number;
    type dtFindPathOptions = typeof DT_FINDPATH_ANY_ANGLE;
    function _emscripten_enum_dtFindPathOptions_DT_FINDPATH_ANY_ANGLE(): dtFindPathOptions;
    const DT_RAYCAST_USE_COSTS: number;
    type dtRaycastOptions = typeof DT_RAYCAST_USE_COSTS;
    function _emscripten_enum_dtRaycastOptions_DT_RAYCAST_USE_COSTS(): dtRaycastOptions;
    class NavMeshQuery {
        get_m_navQuery(): dtNavMeshQuery;
        set_m_navQuery(m_navQuery: dtNavMeshQuery): void;
        m_navQuery: dtNavMeshQuery;
        constructor();
        constructor(navMeshQuery: dtNavMeshQuery);
        init(navMesh: NavMesh, maxNodes: number): number;
        findPath(startRef: number, endRef: number, startPos: ReadonlyArray<number>, endPos: ReadonlyArray<number>, filter: dtQueryFilter, path: UnsignedIntArray, maxPath: number): number;
        closestPointOnPoly(ref: number, pos: ReadonlyArray<number>, closest: Vec3, posOverPoly: BoolRef): number;
        findClosestPoint(position: ReadonlyArray<number>, halfExtents: ReadonlyArray<number>, filter: dtQueryFilter, resultPolyRef: UnsignedIntRef, resultPoint: Vec3, resultPosOverPoly: BoolRef): number;
        findStraightPath(startPos: ReadonlyArray<number>, endPos: ReadonlyArray<number>, pathPolys: UnsignedIntArray, straightPath: FloatArray, straightPathFlags: UnsignedCharArray, straightPathRefs: UnsignedIntArray, straightPathCountRef: IntRef, maxStraightPath: number, options: number): number;
        findNearestPoly(center: ReadonlyArray<number>, halfExtents: ReadonlyArray<number>, filter: dtQueryFilter, nearestRef: UnsignedIntRef, nearestPt: Vec3, isOverPoly: BoolRef): number;
        findPolysAroundCircle(startRef: number, centerPos: ReadonlyArray<number>, radius: number, filter: dtQueryFilter, resultRef: UnsignedIntArray, resultParent: UnsignedIntArray, resultCost: FloatArray, resultCount: IntRef, maxResult: number): number;
        queryPolygons(center: ReadonlyArray<number>, halfExtents: ReadonlyArray<number>, filter: dtQueryFilter, polys: UnsignedIntArray, polyCount: IntRef, maxPolys: number): number;
        raycast(startRef: number, startPos: ReadonlyArray<number>, endPos: ReadonlyArray<number>, filter: dtQueryFilter, options: number, hit: dtRaycastHit, prevRef: number): number;
        findRandomPointAroundCircle(startRef: number, centerPos: ReadonlyArray<number>, radius: number, filter: dtQueryFilter, resultRandomRef: UnsignedIntRef, resultRandomPoint: Vec3): number;
        moveAlongSurface(startRef: number, startPos: ReadonlyArray<number>, endPos: ReadonlyArray<number>, filter: dtQueryFilter, resultPos: Vec3, visited: UnsignedIntArray, maxVisitedSize: number): number;
        findRandomPoint(filter: dtQueryFilter, resultRandomRef: UnsignedIntRef, resultRandomPoint: Vec3): number;
        getPolyHeight(ref: number, pos: ReadonlyArray<number>, height: FloatRef): number;
        destroy(): void;
    }
    class dtTileCacheParams {
        constructor();
        get_orig(index: number): number;
        set_orig(index: number, orig: number): void;
        orig: number;
        get_cs(): number;
        set_cs(cs: number): void;
        cs: number;
        get_ch(): number;
        set_ch(ch: number): void;
        ch: number;
        get_width(): number;
        set_width(width: number): void;
        width: number;
        get_height(): number;
        set_height(height: number): void;
        height: number;
        get_walkableHeight(): number;
        set_walkableHeight(walkableHeight: number): void;
        walkableHeight: number;
        get_walkableRadius(): number;
        set_walkableRadius(walkableRadius: number): void;
        walkableRadius: number;
        get_walkableClimb(): number;
        set_walkableClimb(walkableClimb: number): void;
        walkableClimb: number;
        get_maxSimplificationError(): number;
        set_maxSimplificationError(maxSimplificationError: number): void;
        maxSimplificationError: number;
        get_maxTiles(): number;
        set_maxTiles(maxTiles: number): void;
        maxTiles: number;
        get_maxObstacles(): number;
        set_maxObstacles(maxObstacles: number): void;
        maxObstacles: number;
    }
    class TileCacheAddTileResult {
        get_status(): number;
        set_status(status: number): void;
        status: number;
        get_tileRef(): number;
        set_tileRef(tileRef: number): void;
        tileRef: number;
    }
    class TileCacheUpdateResult {
        get_status(): number;
        set_status(status: number): void;
        status: number;
        get_upToDate(): boolean;
        set_upToDate(upToDate: boolean): void;
        upToDate: boolean;
    }
    class TileCacheAddObstacleResult {
        get_status(): number;
        set_status(status: number): void;
        status: number;
        get_ref(): dtObstacleRef;
        set_ref(ref: dtObstacleRef): void;
        ref: dtObstacleRef;
    }
    class dtTileCacheCompressor {
    }
    class RecastFastLZCompressor extends dtTileCacheCompressor {
        constructor();
    }
    class TileCacheMeshProcessJsImpl {
        process(params: dtNavMeshCreateParams, polyAreas: UnsignedCharArray, polyFlags: UnsignedShortArray): void;
    }
    class TileCacheMeshProcess extends TileCacheMeshProcessJsImpl {
        constructor();
        process(params: number, polyAreas: number, polyFlags: number): void;
    }
    class dtTileCacheAlloc {
    }
    class RecastLinearAllocator extends dtTileCacheAlloc {
        constructor(cap: number);
    }
    class TileCache {
        constructor();
        init(params: dtTileCacheParams, allocator: RecastLinearAllocator, compressor: RecastFastLZCompressor, meshProcess: TileCacheMeshProcess): boolean;
        addTile(data: UnsignedCharArray, flags: number): TileCacheAddTileResult;
        buildNavMeshTile(ref: dtCompressedTileRef, navMesh: NavMesh): number;
        buildNavMeshTilesAt(tx: number, ty: number, navMesh: NavMesh): number;
        update(navMesh: NavMesh): TileCacheUpdateResult;
        addCylinderObstacle(position: Vec3, radius: number, height: number): TileCacheAddObstacleResult;
        addBoxObstacle(position: Vec3, extent: Vec3, angle: number): TileCacheAddObstacleResult;
        removeObstacle(obstacle: dtObstacleRef): number;
        destroy(): void;
    }
    class CrowdUtils {
        constructor();
        getActiveAgentCount(crowd: dtCrowd): number;
        overOffMeshConnection(crowd: dtCrowd, idx: number): boolean;
        agentTeleport(crowd: dtCrowd, idx: number, destination: ReadonlyArray<number>, halfExtents: ReadonlyArray<number>, filter: dtQueryFilter): void;
    }
    const DT_TILE_FREE_DATA: number;
    type dtTileFlags = typeof DT_TILE_FREE_DATA;
    function _emscripten_enum_dtTileFlags_DT_TILE_FREE_DATA(): dtTileFlags;
    class Detour {
        constructor();
        get_FAILURE(): number;
        set_FAILURE(FAILURE: number): void;
        FAILURE: number;
        get_SUCCESS(): number;
        set_SUCCESS(SUCCESS: number): void;
        SUCCESS: number;
        get_IN_PROGRESS(): number;
        set_IN_PROGRESS(IN_PROGRESS: number): void;
        IN_PROGRESS: number;
        get_STATUS_DETAIL_MASK(): number;
        set_STATUS_DETAIL_MASK(STATUS_DETAIL_MASK: number): void;
        STATUS_DETAIL_MASK: number;
        get_WRONG_MAGIC(): number;
        set_WRONG_MAGIC(WRONG_MAGIC: number): void;
        WRONG_MAGIC: number;
        get_WRONG_VERSION(): number;
        set_WRONG_VERSION(WRONG_VERSION: number): void;
        WRONG_VERSION: number;
        get_OUT_OF_MEMORY(): number;
        set_OUT_OF_MEMORY(OUT_OF_MEMORY: number): void;
        OUT_OF_MEMORY: number;
        get_INVALID_PARAM(): number;
        set_INVALID_PARAM(INVALID_PARAM: number): void;
        INVALID_PARAM: number;
        get_BUFFER_TOO_SMALL(): number;
        set_BUFFER_TOO_SMALL(BUFFER_TOO_SMALL: number): void;
        BUFFER_TOO_SMALL: number;
        get_OUT_OF_NODES(): number;
        set_OUT_OF_NODES(OUT_OF_NODES: number): void;
        OUT_OF_NODES: number;
        get_PARTIAL_RESULT(): number;
        set_PARTIAL_RESULT(PARTIAL_RESULT: number): void;
        PARTIAL_RESULT: number;
        get_ALREADY_OCCUPIED(): number;
        set_ALREADY_OCCUPIED(ALREADY_OCCUPIED: number): void;
        ALREADY_OCCUPIED: number;
        get_VERTS_PER_POLYGON(): number;
        set_VERTS_PER_POLYGON(VERTS_PER_POLYGON: number): void;
        VERTS_PER_POLYGON: number;
        get_NAVMESH_MAGIC(): number;
        set_NAVMESH_MAGIC(NAVMESH_MAGIC: number): void;
        NAVMESH_MAGIC: number;
        get_NAVMESH_VERSION(): number;
        set_NAVMESH_VERSION(NAVMESH_VERSION: number): void;
        NAVMESH_VERSION: number;
        get_NAVMESH_STATE_MAGIC(): number;
        set_NAVMESH_STATE_MAGIC(NAVMESH_STATE_MAGIC: number): void;
        NAVMESH_STATE_MAGIC: number;
        get_NAVMESH_STATE_VERSION(): number;
        set_NAVMESH_STATE_VERSION(NAVMESH_STATE_VERSION: number): void;
        NAVMESH_STATE_VERSION: number;
        get_TILECACHE_MAGIC(): number;
        set_TILECACHE_MAGIC(TILECACHE_MAGIC: number): void;
        TILECACHE_MAGIC: number;
        get_TILECACHE_VERSION(): number;
        set_TILECACHE_VERSION(TILECACHE_VERSION: number): void;
        TILECACHE_VERSION: number;
        get_TILECACHE_NULL_AREA(): number;
        set_TILECACHE_NULL_AREA(TILECACHE_NULL_AREA: number): void;
        TILECACHE_NULL_AREA: number;
        get_TILECACHE_WALKABLE_AREA(): number;
        set_TILECACHE_WALKABLE_AREA(TILECACHE_WALKABLE_AREA: number): void;
        TILECACHE_WALKABLE_AREA: number;
        get_TILECACHE_NULL_IDX(): number;
        set_TILECACHE_NULL_IDX(TILECACHE_NULL_IDX: number): void;
        TILECACHE_NULL_IDX: number;
        get_NULL_LINK(): number;
        set_NULL_LINK(NULL_LINK: number): void;
        NULL_LINK: number;
        get_EXT_LINK(): number;
        set_EXT_LINK(EXT_LINK: number): void;
        EXT_LINK: number;
        get_OFFMESH_CON_BIDIR(): number;
        set_OFFMESH_CON_BIDIR(OFFMESH_CON_BIDIR: number): void;
        OFFMESH_CON_BIDIR: number;
        statusSucceed(status: number): boolean;
        statusFailed(status: number): boolean;
        statusInProgress(status: number): boolean;
        statusDetail(status: number, detail: number): boolean;
        allocCrowd(): dtCrowd;
        freeCrowd(crowd: dtCrowd): void;
    }
    const DT_CROWDAGENT_STATE_INVALID: number;
    const DT_CROWDAGENT_STATE_WALKING: number;
    const DT_CROWDAGENT_STATE_OFFMESH: number;
    type CrowdAgentState = typeof DT_CROWDAGENT_STATE_INVALID | typeof DT_CROWDAGENT_STATE_WALKING | typeof DT_CROWDAGENT_STATE_OFFMESH;
    function _emscripten_enum_CrowdAgentState_DT_CROWDAGENT_STATE_INVALID(): CrowdAgentState;
    function _emscripten_enum_CrowdAgentState_DT_CROWDAGENT_STATE_WALKING(): CrowdAgentState;
    function _emscripten_enum_CrowdAgentState_DT_CROWDAGENT_STATE_OFFMESH(): CrowdAgentState;
    const DT_CROWDAGENT_TARGET_NONE: number;
    const DT_CROWDAGENT_TARGET_FAILED: number;
    const DT_CROWDAGENT_TARGET_VALID: number;
    const DT_CROWDAGENT_TARGET_REQUESTING: number;
    const DT_CROWDAGENT_TARGET_WAITING_FOR_QUEUE: number;
    const DT_CROWDAGENT_TARGET_WAITING_FOR_PATH: number;
    const DT_CROWDAGENT_TARGET_VELOCITY: number;
    type MoveRequestState = typeof DT_CROWDAGENT_TARGET_NONE | typeof DT_CROWDAGENT_TARGET_FAILED | typeof DT_CROWDAGENT_TARGET_VALID | typeof DT_CROWDAGENT_TARGET_REQUESTING | typeof DT_CROWDAGENT_TARGET_WAITING_FOR_QUEUE | typeof DT_CROWDAGENT_TARGET_WAITING_FOR_PATH | typeof DT_CROWDAGENT_TARGET_VELOCITY;
    function _emscripten_enum_MoveRequestState_DT_CROWDAGENT_TARGET_NONE(): MoveRequestState;
    function _emscripten_enum_MoveRequestState_DT_CROWDAGENT_TARGET_FAILED(): MoveRequestState;
    function _emscripten_enum_MoveRequestState_DT_CROWDAGENT_TARGET_VALID(): MoveRequestState;
    function _emscripten_enum_MoveRequestState_DT_CROWDAGENT_TARGET_REQUESTING(): MoveRequestState;
    function _emscripten_enum_MoveRequestState_DT_CROWDAGENT_TARGET_WAITING_FOR_QUEUE(): MoveRequestState;
    function _emscripten_enum_MoveRequestState_DT_CROWDAGENT_TARGET_WAITING_FOR_PATH(): MoveRequestState;
    function _emscripten_enum_MoveRequestState_DT_CROWDAGENT_TARGET_VELOCITY(): MoveRequestState;
    class dtPathCorridor {
        init(maxPath: number): boolean;
        reset(ref: number, pos: ReadonlyArray<number>): void;
    }
    class dtLocalBoundary {
        reset(): void;
    }
    class dtCrowdNeighbour {
        constructor();
        get_idx(): number;
        set_idx(idx: number): void;
        idx: number;
        get_dist(): number;
        set_dist(dist: number): void;
        dist: number;
    }
    class dtCrowdAgent {
        constructor();
        get_active(): boolean;
        set_active(active: boolean): void;
        active: boolean;
        get_state(): number;
        set_state(state: number): void;
        state: number;
        get_corridor(): dtPathCorridor;
        set_corridor(corridor: dtPathCorridor): void;
        readonly corridor: dtPathCorridor;
        get_boundary(): dtLocalBoundary;
        set_boundary(boundary: dtLocalBoundary): void;
        readonly boundary: dtLocalBoundary;
        get_topologyOptTime(): number;
        set_topologyOptTime(topologyOptTime: number): void;
        topologyOptTime: number;
        get_neis(index: number): dtCrowdNeighbour;
        set_neis(index: number, neis: dtCrowdNeighbour): void;
        neis: dtCrowdNeighbour;
        get_nneis(): number;
        set_nneis(nneis: number): void;
        nneis: number;
        get_desiredSpeed(): number;
        set_desiredSpeed(desiredSpeed: number): void;
        desiredSpeed: number;
        get_npos(index: number): number;
        set_npos(index: number, npos: number): void;
        npos: number;
        get_disp(index: number): number;
        set_disp(index: number, disp: number): void;
        disp: number;
        get_dvel(index: number): number;
        set_dvel(index: number, dvel: number): void;
        dvel: number;
        get_nvel(index: number): number;
        set_nvel(index: number, nvel: number): void;
        nvel: number;
        get_vel(index: number): number;
        set_vel(index: number, vel: number): void;
        vel: number;
        get_params(): dtCrowdAgentParams;
        set_params(params: dtCrowdAgentParams): void;
        params: dtCrowdAgentParams;
        get_cornerVerts(index: number): number;
        set_cornerVerts(index: number, cornerVerts: number): void;
        cornerVerts: number;
        get_cornerFlags(index: number): number;
        set_cornerFlags(index: number, cornerFlags: number): void;
        cornerFlags: number;
        get_ncorners(): number;
        set_ncorners(ncorners: number): void;
        ncorners: number;
        get_targetState(): number;
        set_targetState(targetState: number): void;
        targetState: number;
        get_targetRef(): number;
        set_targetRef(targetRef: number): void;
        targetRef: number;
        get_targetPos(index: number): number;
        set_targetPos(index: number, targetPos: number): void;
        targetPos: number;
        get_targetPathqRef(): number;
        set_targetPathqRef(targetPathqRef: number): void;
        targetPathqRef: number;
        get_targetReplan(): boolean;
        set_targetReplan(targetReplan: boolean): void;
        targetReplan: boolean;
        get_targetReplanTime(): number;
        set_targetReplanTime(targetReplanTime: number): void;
        targetReplanTime: number;
    }
    class dtObstacleAvoidanceParams {
        constructor();
        get_velBias(): number;
        set_velBias(velBias: number): void;
        velBias: number;
        get_weightDesVel(): number;
        set_weightDesVel(weightDesVel: number): void;
        weightDesVel: number;
        get_weightCurVel(): number;
        set_weightCurVel(weightCurVel: number): void;
        weightCurVel: number;
        get_weightSide(): number;
        set_weightSide(weightSide: number): void;
        weightSide: number;
        get_weightToi(): number;
        set_weightToi(weightToi: number): void;
        weightToi: number;
        get_horizTime(): number;
        set_horizTime(horizTime: number): void;
        horizTime: number;
        get_gridSize(): number;
        set_gridSize(gridSize: number): void;
        gridSize: number;
        get_adaptiveDivs(): number;
        set_adaptiveDivs(adaptiveDivs: number): void;
        adaptiveDivs: number;
        get_adaptiveRings(): number;
        set_adaptiveRings(adaptiveRings: number): void;
        adaptiveRings: number;
        get_adaptiveDepth(): number;
        set_adaptiveDepth(adaptiveDepth: number): void;
        adaptiveDepth: number;
    }
    class dtObstacleAvoidanceDebugData {
    }
    class dtCrowdAgentDebugInfo {
        constructor();
        get_idx(): number;
        set_idx(idx: number): void;
        idx: number;
        get_optStart(index: number): number;
        set_optStart(index: number, optStart: number): void;
        optStart: number;
        get_optEnd(index: number): number;
        set_optEnd(index: number, optEnd: number): void;
        optEnd: number;
        get_vod(): dtObstacleAvoidanceDebugData;
        set_vod(vod: dtObstacleAvoidanceDebugData): void;
        vod: dtObstacleAvoidanceDebugData;
    }
    class dtQueryFilter {
        constructor();
        getAreaCost(i: number): number;
        setAreaCost(i: number, cost: number): void;
        getIncludeFlags(): number;
        setIncludeFlags(flags: number): void;
        getExcludeFlags(): number;
        setExcludeFlags(flags: number): void;
    }
    class dtNavMeshQuery {
        getAttachedNavMesh(): dtNavMesh;
    }
    class dtCrowd {
        constructor();
        init(maxAgents: number, maxAgentRadius: number, nav: dtNavMesh): boolean;
        setObstacleAvoidanceParams(idx: number, params: dtObstacleAvoidanceParams): void;
        getObstacleAvoidanceParams(idx: number): dtObstacleAvoidanceParams;
        getAgent(idx: number): dtCrowdAgent;
        getEditableAgent(idx: number): dtCrowdAgent;
        getAgentCount(): number;
        addAgent(pos: ReadonlyArray<number>, params: dtCrowdAgentParams): number;
        updateAgentParameters(idx: number, params: dtCrowdAgentParams): void;
        removeAgent(idx: number): void;
        requestMoveTarget(idx: number, ref: number, pos: ReadonlyArray<number>): boolean;
        requestMoveVelocity(idx: number, vel: ReadonlyArray<number>): boolean;
        resetMoveTarget(idx: number): boolean;
        update(dt: number, debug: dtCrowdAgentDebugInfo): void;
        getFilter(i: number): dtQueryFilter;
        getEditableFilter(i: number): dtQueryFilter;
        getNavMeshQuery(): dtNavMeshQuery;
    }
    const RC_CONTOUR_TESS_WALL_EDGES: number;
    const RC_CONTOUR_TESS_AREA_EDGES: number;
    type rcBuildContoursFlags = typeof RC_CONTOUR_TESS_WALL_EDGES | typeof RC_CONTOUR_TESS_AREA_EDGES;
    function _emscripten_enum_rcBuildContoursFlags_RC_CONTOUR_TESS_WALL_EDGES(): rcBuildContoursFlags;
    function _emscripten_enum_rcBuildContoursFlags_RC_CONTOUR_TESS_AREA_EDGES(): rcBuildContoursFlags;
    const RC_LOG_PROGRESS: number;
    const RC_LOG_WARNING: number;
    const RC_LOG_ERROR: number;
    type rcLogCategory = typeof RC_LOG_PROGRESS | typeof RC_LOG_WARNING | typeof RC_LOG_ERROR;
    function _emscripten_enum_rcLogCategory_RC_LOG_PROGRESS(): rcLogCategory;
    function _emscripten_enum_rcLogCategory_RC_LOG_WARNING(): rcLogCategory;
    function _emscripten_enum_rcLogCategory_RC_LOG_ERROR(): rcLogCategory;
    const RC_TIMER_TOTAL: number;
    const RC_TIMER_TEMP: number;
    const RC_TIMER_RASTERIZE_TRIANGLES: number;
    const RC_TIMER_BUILD_COMPACTHEIGHTFIELD: number;
    const RC_TIMER_BUILD_CONTOURS: number;
    const RC_TIMER_BUILD_CONTOURS_TRACE: number;
    const RC_TIMER_BUILD_CONTOURS_SIMPLIFY: number;
    const RC_TIMER_FILTER_BORDER: number;
    const RC_TIMER_FILTER_WALKABLE: number;
    const RC_TIMER_MEDIAN_AREA: number;
    const RC_TIMER_FILTER_LOW_OBSTACLES: number;
    const RC_TIMER_BUILD_POLYMESH: number;
    const RC_TIMER_MERGE_POLYMESH: number;
    const RC_TIMER_ERODE_AREA: number;
    const RC_TIMER_MARK_BOX_AREA: number;
    const RC_TIMER_MARK_CYLINDER_AREA: number;
    const RC_TIMER_MARK_CONVEXPOLY_AREA: number;
    const RC_TIMER_BUILD_DISTANCEFIELD: number;
    const RC_TIMER_BUILD_DISTANCEFIELD_DIST: number;
    const RC_TIMER_BUILD_DISTANCEFIELD_BLUR: number;
    const RC_TIMER_BUILD_REGIONS: number;
    const RC_TIMER_BUILD_REGIONS_WATERSHED: number;
    const RC_TIMER_BUILD_REGIONS_EXPAND: number;
    const RC_TIMER_BUILD_REGIONS_FLOOD: number;
    const RC_TIMER_BUILD_REGIONS_FILTER: number;
    const RC_TIMER_BUILD_LAYERS: number;
    const RC_TIMER_BUILD_POLYMESHDETAIL: number;
    const RC_TIMER_MERGE_POLYMESHDETAIL: number;
    const RC_MAX_TIMERS: number;
    type rcTimerLabel = typeof RC_TIMER_TOTAL | typeof RC_TIMER_TEMP | typeof RC_TIMER_RASTERIZE_TRIANGLES | typeof RC_TIMER_BUILD_COMPACTHEIGHTFIELD | typeof RC_TIMER_BUILD_CONTOURS | typeof RC_TIMER_BUILD_CONTOURS_TRACE | typeof RC_TIMER_BUILD_CONTOURS_SIMPLIFY | typeof RC_TIMER_FILTER_BORDER | typeof RC_TIMER_FILTER_WALKABLE | typeof RC_TIMER_MEDIAN_AREA | typeof RC_TIMER_FILTER_LOW_OBSTACLES | typeof RC_TIMER_BUILD_POLYMESH | typeof RC_TIMER_MERGE_POLYMESH | typeof RC_TIMER_ERODE_AREA | typeof RC_TIMER_MARK_BOX_AREA | typeof RC_TIMER_MARK_CYLINDER_AREA | typeof RC_TIMER_MARK_CONVEXPOLY_AREA | typeof RC_TIMER_BUILD_DISTANCEFIELD | typeof RC_TIMER_BUILD_DISTANCEFIELD_DIST | typeof RC_TIMER_BUILD_DISTANCEFIELD_BLUR | typeof RC_TIMER_BUILD_REGIONS | typeof RC_TIMER_BUILD_REGIONS_WATERSHED | typeof RC_TIMER_BUILD_REGIONS_EXPAND | typeof RC_TIMER_BUILD_REGIONS_FLOOD | typeof RC_TIMER_BUILD_REGIONS_FILTER | typeof RC_TIMER_BUILD_LAYERS | typeof RC_TIMER_BUILD_POLYMESHDETAIL | typeof RC_TIMER_MERGE_POLYMESHDETAIL | typeof RC_MAX_TIMERS;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_TOTAL(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_TEMP(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_RASTERIZE_TRIANGLES(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_COMPACTHEIGHTFIELD(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_CONTOURS(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_CONTOURS_TRACE(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_CONTOURS_SIMPLIFY(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_FILTER_BORDER(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_FILTER_WALKABLE(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_MEDIAN_AREA(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_FILTER_LOW_OBSTACLES(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_POLYMESH(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_MERGE_POLYMESH(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_ERODE_AREA(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_MARK_BOX_AREA(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_MARK_CYLINDER_AREA(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_MARK_CONVEXPOLY_AREA(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_DISTANCEFIELD(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_DISTANCEFIELD_DIST(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_DISTANCEFIELD_BLUR(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_REGIONS(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_REGIONS_WATERSHED(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_REGIONS_EXPAND(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_REGIONS_FLOOD(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_REGIONS_FILTER(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_LAYERS(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_BUILD_POLYMESHDETAIL(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_TIMER_MERGE_POLYMESHDETAIL(): rcTimerLabel;
    function _emscripten_enum_rcTimerLabel_RC_MAX_TIMERS(): rcTimerLabel;
    const DT_COMPRESSEDTILE_FREE_DATA: number;
    type dtCompressedTileFlags = typeof DT_COMPRESSEDTILE_FREE_DATA;
    function _emscripten_enum_dtCompressedTileFlags_DT_COMPRESSEDTILE_FREE_DATA(): dtCompressedTileFlags;
    class rcContext {
        constructor();
        enableLog(state: boolean): void;
        resetLog(): void;
        log(category: rcLogCategory, message: string): void;
        enableTimer(state: boolean): void;
        resetTimers(): void;
        startTimer(label: rcTimerLabel): void;
        stopTimer(label: rcTimerLabel): void;
        getAccumulatedTime(label: rcTimerLabel): number;
    }
    class RecastBuildContextJsImpl {
        resetLog(): void;
        log(category: rcLogCategory, msg: string, len: number): void;
        resetTimers(): void;
        startTimer(label: rcTimerLabel): void;
        stopTimer(label: rcTimerLabel): void;
        getAccumulatedTime(label: rcTimerLabel): number;
    }
    class RecastBuildContextImpl extends RecastBuildContextJsImpl {
        constructor();
        resetLog(): void;
        log(category: number, msg: number, len: number): void;
        resetTimers(): void;
        startTimer(label: number): void;
        stopTimer(label: number): void;
        getAccumulatedTime(label: number): number;
    }
    class RecastBuildContext extends rcContext {
        constructor(impl: RecastBuildContextImpl);
        enableLog(state: boolean): void;
        resetLog(): void;
        log(category: rcLogCategory, message: string): void;
        enableTimer(state: boolean): void;
        resetTimers(): void;
        startTimer(label: rcTimerLabel): void;
        stopTimer(label: rcTimerLabel): void;
        getAccumulatedTime(label: rcTimerLabel): number;
        logEnabled(): boolean;
        timerEnabled(): boolean;
    }
    class RecastCalcBoundsResult {
        get_bmin(index: number): number;
        set_bmin(index: number, bmin: number): void;
        bmin: number;
        get_bmax(index: number): number;
        set_bmax(index: number, bmax: number): void;
        bmax: number;
    }
    class RecastCalcGridSizeResult {
        get_width(): number;
        set_width(width: number): void;
        width: number;
        get_height(): number;
        set_height(height: number): void;
        height: number;
    }
    class Recast {
        constructor();
        get_BORDER_REG(): number;
        set_BORDER_REG(BORDER_REG: number): void;
        BORDER_REG: number;
        get_MULTIPLE_REGS(): number;
        set_MULTIPLE_REGS(MULTIPLE_REGS: number): void;
        MULTIPLE_REGS: number;
        get_BORDER_VERTEX(): number;
        set_BORDER_VERTEX(BORDER_VERTEX: number): void;
        BORDER_VERTEX: number;
        get_AREA_BORDER(): number;
        set_AREA_BORDER(AREA_BORDER: number): void;
        AREA_BORDER: number;
        get_CONTOUR_REG_MASK(): number;
        set_CONTOUR_REG_MASK(CONTOUR_REG_MASK: number): void;
        CONTOUR_REG_MASK: number;
        get_MESH_NULL_IDX(): number;
        set_MESH_NULL_IDX(MESH_NULL_IDX: number): void;
        MESH_NULL_IDX: number;
        get_NULL_AREA(): number;
        set_NULL_AREA(NULL_AREA: number): void;
        NULL_AREA: number;
        get_WALKABLE_AREA(): number;
        set_WALKABLE_AREA(WALKABLE_AREA: number): void;
        WALKABLE_AREA: number;
        get_NOT_CONNECTED(): number;
        set_NOT_CONNECTED(NOT_CONNECTED: number): void;
        NOT_CONNECTED: number;
        calcBounds(verts: FloatArray, nv: number): RecastCalcBoundsResult;
        calcGridSize(bmin: ReadonlyArray<number>, bmax: ReadonlyArray<number>, cs: number): RecastCalcGridSizeResult;
        createHeightfield(ctx: rcContext, hf: rcHeightfield, width: number, height: number, bmin: ReadonlyArray<number>, bmax: ReadonlyArray<number>, cs: number, ch: number): boolean;
        markWalkableTriangles(ctx: rcContext, walkableSlopeAngle: number, verts: FloatArray, nv: number, tris: IntArray, nt: number, areas: UnsignedCharArray): void;
        clearUnwalkableTriangles(ctx: rcContext, walkableSlopeAngle: number, verts: FloatArray, nv: number, tris: IntArray, nt: number, areas: UnsignedCharArray): void;
        rasterizeTriangles(ctx: rcContext, verts: FloatArray, nv: number, tris: IntArray, areas: UnsignedCharArray, nt: number, solid: rcHeightfield, flagMergeThr: number): boolean;
        filterLowHangingWalkableObstacles(ctx: rcContext, walkableClimb: number, solid: rcHeightfield): void;
        filterLedgeSpans(ctx: rcContext, walkableHeight: number, walkableClimb: number, solid: rcHeightfield): void;
        filterWalkableLowHeightSpans(ctx: rcContext, walkableHeight: number, solid: rcHeightfield): void;
        getHeightFieldSpanCount(ctx: rcContext, solid: rcHeightfield): number;
        buildCompactHeightfield(ctx: rcContext, walkableHeight: number, walkableClimb: number, solid: rcHeightfield, chf: rcCompactHeightfield): boolean;
        erodeWalkableArea(ctx: rcContext, radius: number, chf: rcCompactHeightfield): boolean;
        medianFilterWalkableArea(ctx: rcContext, chf: rcCompactHeightfield): boolean;
        markBoxArea(ctx: rcContext, bmin: ReadonlyArray<number>, bmax: ReadonlyArray<number>, areaId: number, chf: rcCompactHeightfield): void;
        markConvexPolyArea(ctx: rcContext, verts: FloatArray, nverts: number, hmin: number, hmax: number, areaId: number, chf: rcCompactHeightfield): void;
        markCylinderArea(ctx: rcContext, pos: ReadonlyArray<number>, r: number, h: number, areaId: number, chf: rcCompactHeightfield): void;
        buildDistanceField(ctx: rcContext, chf: rcCompactHeightfield): boolean;
        buildRegions(ctx: rcContext, chf: rcCompactHeightfield, borderSize: number, minRegionArea: number, mergeRegionArea: number): boolean;
        buildLayerRegions(ctx: rcContext, chf: rcCompactHeightfield, borderSize: number, minRegionArea: number): boolean;
        buildRegionsMonotone(ctx: rcContext, chf: rcCompactHeightfield, borderSize: number, minRegionArea: number, mergeRegionArea: number): boolean;
        setCon(s: rcCompactSpan, dir: number, i: number): void;
        getCon(s: rcCompactSpan, dir: number): number;
        getDirOffsetX(dir: number): number;
        getDirOffsetY(dir: number): number;
        getDirForOffset(x: number, y: number): number;
        buildHeightfieldLayers(ctx: rcContext, chf: rcCompactHeightfield, borderSize: number, walkableHeight: number, lset: rcHeightfieldLayerSet): boolean;
        buildContours(ctx: rcContext, chf: rcCompactHeightfield, maxError: number, maxEdgeLen: number, cset: rcContourSet, buildFlags: number): boolean;
        buildPolyMesh(ctx: rcContext, cset: rcContourSet, nvp: number, mesh: rcPolyMesh): boolean;
        mergePolyMeshes(ctx: rcContext, meshes: ReadonlyArray<rcPolyMesh>, nmeshes: number, mesh: rcPolyMesh): boolean;
        buildPolyMeshDetail(ctx: rcContext, mesh: rcPolyMesh, chf: rcCompactHeightfield, sampleDist: number, sampleMaxError: number, dmesh: rcPolyMeshDetail): boolean;
        copyPolyMesh(ctx: rcContext, src: rcPolyMesh, dst: rcPolyMesh): boolean;
        mergePolyMeshDetails(ctx: rcContext, meshes: ReadonlyArray<rcPolyMeshDetail>, nmeshes: number, dmesh: rcPolyMeshDetail): boolean;
        getHeightfieldLayerHeights(heightfieldLayer: rcHeightfieldLayer): UnsignedCharArray;
        getHeightfieldLayerAreas(heightfieldLayer: rcHeightfieldLayer): UnsignedCharArray;
        getHeightfieldLayerCons(heightfieldLayer: rcHeightfieldLayer): UnsignedCharArray;
        allocHeightfield(): rcHeightfield;
        freeHeightfield(hf: rcHeightfield): void;
        allocCompactHeightfield(): rcCompactHeightfield;
        freeCompactHeightfield(chf: rcCompactHeightfield): void;
        allocHeightfieldLayerSet(): rcHeightfieldLayerSet;
        freeHeightfieldLayerSet(lset: rcHeightfieldLayerSet): void;
        allocContourSet(): rcContourSet;
        freeContourSet(cset: rcContourSet): void;
        allocPolyMesh(): rcPolyMesh;
        freePolyMesh(mesh: rcPolyMesh): void;
        allocPolyMeshDetail(): rcPolyMeshDetail;
        freePolyMeshDetail(dmesh: rcPolyMeshDetail): void;
    }
    class CreateNavMeshDataResult {
        get_success(): boolean;
        set_success(success: boolean): void;
        success: boolean;
        get_navMeshData(): UnsignedCharArray;
        set_navMeshData(navMeshData: UnsignedCharArray): void;
        navMeshData: UnsignedCharArray;
    }
    class DetourNavMeshBuilder {
        constructor();
        setPolyMeshCreateParams(navMeshCreateParams: dtNavMeshCreateParams, polyMesh: rcPolyMesh): void;
        setPolyMeshDetailCreateParams(navMeshCreateParams: dtNavMeshCreateParams, polyMeshDetail: rcPolyMeshDetail): void;
        setOffMeshConnections(navMeshCreateParams: dtNavMeshCreateParams, offMeshConCount: number, offMeshConVerts: ReadonlyArray<number>, offMeshConRad: ReadonlyArray<number>, offMeshConDirs: ReadonlyArray<number>, offMeshConAreas: ReadonlyArray<number>, offMeshConFlags: ReadonlyArray<number>, offMeshConUserId: ReadonlyArray<number>): void;
        createNavMeshData(params: dtNavMeshCreateParams): CreateNavMeshDataResult;
    }
    class dtTileCacheLayer {
    }
    class dtTileCacheContourSet {
    }
    class dtTileCachePolyMesh {
    }
    class dtTileCacheLayerHeader {
        constructor();
        get_magic(): number;
        set_magic(magic: number): void;
        magic: number;
        get_version(): number;
        set_version(version: number): void;
        version: number;
        get_tx(): number;
        set_tx(tx: number): void;
        tx: number;
        get_ty(): number;
        set_ty(ty: number): void;
        ty: number;
        get_tlayer(): number;
        set_tlayer(tlayer: number): void;
        tlayer: number;
        get_bmin(index: number): number;
        set_bmin(index: number, bmin: number): void;
        bmin: number;
        get_bmax(index: number): number;
        set_bmax(index: number, bmax: number): void;
        bmax: number;
        get_hmin(): number;
        set_hmin(hmin: number): void;
        hmin: number;
        get_hmax(): number;
        set_hmax(hmax: number): void;
        hmax: number;
        get_width(): number;
        set_width(width: number): void;
        width: number;
        get_height(): number;
        set_height(height: number): void;
        height: number;
        get_minx(): number;
        set_minx(minx: number): void;
        minx: number;
        get_maxx(): number;
        set_maxx(maxx: number): void;
        maxx: number;
        get_miny(): number;
        set_miny(miny: number): void;
        miny: number;
        get_maxy(): number;
        set_maxy(maxy: number): void;
        maxy: number;
    }
    class DetourTileCacheBuilder {
        constructor();
        buildTileCacheLayer(comp: RecastFastLZCompressor, header: dtTileCacheLayerHeader, heights: UnsignedCharArray, areas: UnsignedCharArray, cons: UnsignedCharArray, tileCacheData: UnsignedCharArray): number;
    }
    class rcChunkyTriMeshNode {
        get_bmin(index: number): number;
        set_bmin(index: number, bmin: number): void;
        bmin: number;
        get_bmax(index: number): number;
        set_bmax(index: number, bmax: number): void;
        bmax: number;
        get_i(): number;
        set_i(i: number): void;
        i: number;
        get_n(): number;
        set_n(n: number): void;
        n: number;
    }
    class rcChunkyTriMesh {
        constructor();
        get_nodes(index: number): rcChunkyTriMeshNode;
        set_nodes(index: number, nodes: rcChunkyTriMeshNode): void;
        nodes: rcChunkyTriMeshNode;
        get_nnodes(): number;
        set_nnodes(nnodes: number): void;
        nnodes: number;
        get_tris(index: number): number;
        set_tris(index: number, tris: number): void;
        tris: number;
        get_ntris(): number;
        set_ntris(ntris: number): void;
        ntris: number;
        get_maxTrisPerChunk(): number;
        set_maxTrisPerChunk(maxTrisPerChunk: number): void;
        maxTrisPerChunk: number;
    }
    class ChunkyTriMeshUtils {
        constructor();
        createChunkyTriMesh(verts: FloatArray, tris: IntArray, ntris: number, trisPerChunk: number, chunkyTriMesh: rcChunkyTriMesh): boolean;
        getChunksOverlappingRect(chunkyTriMesh: rcChunkyTriMesh, bmin: ReadonlyArray<number>, bmax: ReadonlyArray<number>, ids: IntArray, maxIds: number): number;
        getChunkyTriMeshNodeTris(chunkyTriMesh: rcChunkyTriMesh, nodeIndex: number): IntArray;
    }
    class BoolRef {
        constructor();
        get_value(): boolean;
        set_value(value: boolean): void;
        value: boolean;
    }
    class IntRef {
        constructor();
        get_value(): number;
        set_value(value: number): void;
        value: number;
    }
    class UnsignedIntRef {
        constructor();
        get_value(): number;
        set_value(value: number): void;
        value: number;
    }
    class UnsignedCharRef {
        constructor();
        get_value(): number;
        set_value(value: number): void;
        value: number;
    }
    class UnsignedShortRef {
        constructor();
        get_value(): number;
        set_value(value: number): void;
        value: number;
    }
    class FloatRef {
        constructor();
        get_value(): number;
        set_value(value: number): void;
        value: number;
    }
    class IntArray {
        constructor();
        get_data(index: number): number;
        set_data(index: number, data: number): void;
        data: number;
        get_size(): number;
        set_size(size: number): void;
        size: number;
        get_isView(): boolean;
        set_isView(isView: boolean): void;
        isView: boolean;
        resize(size: number): void;
        copy(data: ReadonlyArray<number>, size: number): void;
        free(): void;
        get(i: number): number;
        set(i: number, value: number): void;
        getDataPointer(): any;
    }
    class UnsignedIntArray {
        constructor();
        get_data(index: number): number;
        set_data(index: number, data: number): void;
        data: number;
        get_size(): number;
        set_size(size: number): void;
        size: number;
        get_isView(): boolean;
        set_isView(isView: boolean): void;
        isView: boolean;
        resize(size: number): void;
        copy(data: ReadonlyArray<number>, size: number): void;
        free(): void;
        get(i: number): number;
        set(i: number, value: number): void;
        getDataPointer(): any;
    }
    class UnsignedCharArray {
        constructor();
        get_data(index: number): number;
        set_data(index: number, data: number): void;
        data: number;
        get_size(): number;
        set_size(size: number): void;
        size: number;
        get_isView(): boolean;
        set_isView(isView: boolean): void;
        isView: boolean;
        resize(size: number): void;
        copy(data: ReadonlyArray<number>, size: number): void;
        free(): void;
        get(i: number): number;
        set(i: number, value: number): void;
        getDataPointer(): any;
    }
    class UnsignedShortArray {
        constructor();
        get_data(index: number): number;
        set_data(index: number, data: number): void;
        data: number;
        get_size(): number;
        set_size(size: number): void;
        size: number;
        get_isView(): boolean;
        set_isView(isView: boolean): void;
        isView: boolean;
        resize(size: number): void;
        copy(data: ReadonlyArray<number>, size: number): void;
        free(): void;
        get(i: number): number;
        set(i: number, value: number): void;
        getDataPointer(): any;
    }
    class FloatArray {
        constructor();
        get_data(index: number): number;
        set_data(index: number, data: number): void;
        data: number;
        get_size(): number;
        set_size(size: number): void;
        size: number;
        get_isView(): boolean;
        set_isView(isView: boolean): void;
        isView: boolean;
        resize(size: number): void;
        copy(data: ReadonlyArray<number>, size: number): void;
        free(): void;
        get(i: number): number;
        set(i: number, value: number): void;
        getDataPointer(): any;
    }
    class NavMeshImporterResult {
        get_navMesh(): NavMesh;
        set_navMesh(navMesh: NavMesh): void;
        navMesh: NavMesh;
        get_tileCache(): TileCache;
        set_tileCache(tileCache: TileCache): void;
        tileCache: TileCache;
        get_allocator(): RecastLinearAllocator;
        set_allocator(allocator: RecastLinearAllocator): void;
        allocator: RecastLinearAllocator;
        get_compressor(): RecastFastLZCompressor;
        set_compressor(compressor: RecastFastLZCompressor): void;
        compressor: RecastFastLZCompressor;
    }
    class NavMeshImporter {
        constructor();
        importNavMesh(data: NavMeshExport, meshProcess: TileCacheMeshProcessJsImpl): NavMeshImporterResult;
    }
    class NavMeshExport {
        get_dataPointer(): any;
        set_dataPointer(dataPointer: any): void;
        dataPointer: any;
        get_size(): number;
        set_size(size: number): void;
        size: number;
        constructor();
    }
    class NavMeshExporter {
        constructor();
        exportNavMesh(navMesh: NavMesh, tileCache: TileCache): NavMeshExport;
        freeNavMeshExport(navMeshExport: NavMeshExport): void;
    }
    const DU_DRAW_POINTS: number;
    const DU_DRAW_LINES: number;
    const DU_DRAW_TRIS: number;
    const DU_DRAW_QUADS: number;
    type duDebugDrawPrimitives = typeof DU_DRAW_POINTS | typeof DU_DRAW_LINES | typeof DU_DRAW_TRIS | typeof DU_DRAW_QUADS;
    function _emscripten_enum_duDebugDrawPrimitives_DU_DRAW_POINTS(): duDebugDrawPrimitives;
    function _emscripten_enum_duDebugDrawPrimitives_DU_DRAW_LINES(): duDebugDrawPrimitives;
    function _emscripten_enum_duDebugDrawPrimitives_DU_DRAW_TRIS(): duDebugDrawPrimitives;
    function _emscripten_enum_duDebugDrawPrimitives_DU_DRAW_QUADS(): duDebugDrawPrimitives;
    class duDebugDraw {
    }
    class DebugDraw extends duDebugDraw {
    }
    class DebugDrawImpl extends DebugDraw {
        constructor();
        handleDepthMask(state: number): void;
        handleTexture(state: number): void;
        handleBegin(prim: number, size: number): void;
        handleVertexWithColor(x: number, y: number, z: number, color: number): void;
        handleVertexWithColorAndUV(x: number, y: number, z: number, color: number, u: number, v: number): void;
        handleEnd(): void;
    }
    class RecastDebugDraw {
        constructor();
        debugDrawHeightfieldSolid(dd: duDebugDraw, hf: rcHeightfield): void;
        debugDrawHeightfieldWalkable(dd: duDebugDraw, hf: rcHeightfield): void;
        debugDrawCompactHeightfieldSolid(dd: duDebugDraw, chf: rcCompactHeightfield): void;
        debugDrawCompactHeightfieldRegions(dd: duDebugDraw, chf: rcCompactHeightfield): void;
        debugDrawCompactHeightfieldDistance(dd: duDebugDraw, chf: rcCompactHeightfield): void;
        debugDrawHeightfieldLayer(dd: duDebugDraw, layer: rcHeightfieldLayer, idx: number): void;
        debugDrawHeightfieldLayers(dd: duDebugDraw, lset: rcHeightfieldLayerSet): void;
        debugDrawRegionConnections(dd: duDebugDraw, cset: rcContourSet, alpha: number): void;
        debugDrawRawContours(dd: duDebugDraw, cset: rcContourSet, alpha: number): void;
        debugDrawContours(dd: duDebugDraw, cset: rcContourSet, alpha: number): void;
        debugDrawPolyMesh(dd: duDebugDraw, mesh: rcPolyMesh): void;
        debugDrawPolyMeshDetail(dd: duDebugDraw, dmesh: rcPolyMeshDetail): void;
    }
    class DetourDebugDraw {
        constructor();
        debugDrawNavMesh(dd: duDebugDraw, mesh: dtNavMesh, flags: number): void;
        debugDrawNavMeshWithClosedList(dd: duDebugDraw, mesh: dtNavMesh, query: dtNavMeshQuery, flags: number): void;
        debugDrawNavMeshNodes(dd: duDebugDraw, query: dtNavMeshQuery): void;
        debugDrawNavMeshBVTree(dd: duDebugDraw, mesh: dtNavMesh): void;
        debugDrawNavMeshPortals(dd: duDebugDraw, mesh: dtNavMesh): void;
        debugDrawNavMeshPolysWithFlags(dd: duDebugDraw, mesh: dtNavMesh, flags: number, col: number): void;
        debugDrawNavMeshPoly(dd: duDebugDraw, mesh: dtNavMesh, ref: number, col: number): void;
        debugDrawTileCacheLayerAreas(dd: duDebugDraw, layer: dtTileCacheLayer, cs: number, ch: number): void;
        debugDrawTileCacheLayerRegions(dd: duDebugDraw, layer: dtTileCacheLayer, cs: number, ch: number): void;
        debugDrawTileCacheContours(dd: duDebugDraw, lcset: dtTileCacheContourSet, orig: ReadonlyArray<number>, cs: number, ch: number): void;
        debugDrawTileCachePolyMesh(dd: duDebugDraw, pmesh: dtTileCachePolyMesh, orig: ReadonlyArray<number>, cs: number, ch: number): void;
    }
}