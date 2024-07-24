import { FloatArray, UnsignedCharArray, UnsignedIntArray } from './arrays';
import { NavMesh } from './nav-mesh';
import { type RawModule } from './raw';
import { Vector3 } from './utils';
export declare class QueryFilter {
    raw: RawModule.dtQueryFilter;
    get includeFlags(): number;
    set includeFlags(flags: number);
    get excludeFlags(): number;
    set excludeFlags(flags: number);
    /**
     * Constructs a new query filter object.
     */
    constructor();
    /**
     * Constructs a query filter wrapper for a raw dtQueryFilter object.
     * @param raw
     */
    constructor(raw: RawModule.dtQueryFilter);
    getAreaCost(i: number): number;
    setAreaCost(i: number, cost: number): void;
}
export type NavMeshQueryParams = {
    /**
     * @default 2048
     */
    maxNodes?: number;
    /**
     * Default query filter.
     *
     * If omitted, the default filter will include all flags and exclude none.
     *
     * ```ts
     * this.defaultFilter = new QueryFilter();
     * this.defaultFilter.includeFlags = 0xffff;
     * this.defaultFilter.excludeFlags = 0;
     * ```
     */
    defaultQueryFilter?: QueryFilter;
};
export declare class NavMeshQuery {
    raw: RawModule.NavMeshQuery;
    /**
     * Default query filter.
     */
    defaultFilter: QueryFilter;
    /**
     * Default search distance along each axis.
     */
    defaultQueryHalfExtents: {
        x: number;
        y: number;
        z: number;
    };
    /**
     * Constructs a new navigation mesh query object.
     * @param navMesh the navigation mesh to use for the query
     * @param params optional additional parameters
     *
     * @example
     * ```ts
     * const query = new NavMeshQuery(navMesh);
     * ```
     *
     * @example
     * ```ts
     * const query = new NavMeshQuery(navMesh, { maxNodes: 2048 });
     * ```
     */
    constructor(navMesh: NavMesh, params?: NavMeshQueryParams);
    /**
     * Constructs a navigation mesh query object from a raw object.
     * @param raw
     */
    constructor(raw: RawModule.NavMeshQuery);
    /**
     * Finds the polygon nearest to the given position.
     */
    findNearestPoly(position: Vector3, options?: {
        /**
         * The polygon filter to apply to the query.
         * @default this.defaultFilter
         */
        filter?: QueryFilter;
        /**
         * The search distance along each axis. [(x, y, z)]
         * @default this.defaultQueryHalfExtents
         */
        halfExtents?: Vector3;
    }): {
        success: boolean;
        status: number;
        nearestRef: number;
        nearestPoint: {
            x: number;
            y: number;
            z: number;
        };
        isOverPoly: boolean;
    };
    /**
     * Finds the polygons along the navigation graph that touch the specified circle.
     * @param startRef Reference of polygon to start search from
     * @param centerPos Center of circle
     * @param radius Radius of circle
     * @param options
     */
    findPolysAroundCircle(startRef: number, centerPos: Vector3, radius: number, options?: {
        /**
         * The polygon filter to apply to the query.
         * @default this.defaultFilter
         */
        filter?: QueryFilter;
        /**
         * The maximum number of polygons the result arrays can hold.
         * @default 256
         */
        maxPolys?: number;
    }): {
        success: boolean;
        status: number;
        resultRefs: number[];
        resultParents: number[];
        resultCost: number[];
        resultCount: number;
    };
    /**
     * Finds polygons that overlap the search box.
     * @param center The center of the search box
     * @param halfExtents The search distance along each axis
     * @param options
     */
    queryPolygons(center: Vector3, halfExtents: Vector3, options?: {
        /**
         * The polygon filter to apply to the query.
         * @default this.defaultFilter
         */
        filter?: QueryFilter;
        /**
         * The maximum number of polygons the search result can hold.
         * @default 256
         */
        maxPolys?: number;
    }): {
        success: boolean;
        status: number;
        polyRefs: number[];
        polyCount: number;
    };
    /**
     * Returns the closest point on the given polygon to the given position.
     *
     * @param polyRef The reference of the polygon
     * @param position The position to find the closest point to
     */
    closestPointOnPoly(polyRef: number, position: Vector3): {
        success: boolean;
        status: number;
        closestPoint: {
            x: number;
            y: number;
            z: number;
        };
        isPointOverPoly: boolean;
    };
    /**
     * Finds the closest point on the NavMesh to the given position.
     * @param position the position to find the closest point to
     * @param options additional options
     * @returns the result of the find closest point operation
     */
    findClosestPoint(position: Vector3, options?: {
        /**
         * The polygon filter to apply to the query.
         * @default this.defaultFilter
         */
        filter?: QueryFilter;
        /**
         * The search distance along each axis. [(x, y, z)]
         * @default this.defaultQueryHalfExtents
         */
        halfExtents?: Vector3;
    }): {
        success: boolean;
        status: number;
        polyRef: number;
        point: {
            x: number;
            y: number;
            z: number;
        };
        isPointOverPoly: boolean;
    };
    /**
     * Returns a random point on the NavMesh within the given radius of the given position.
     *
     * @param position the center of the search circle
     * @param radius the radius of the search circle
     * @param options additional options
     */
    findRandomPointAroundCircle(position: Vector3, radius: number, options?: {
        /**
         * The reference id of the polygon to start the search from.
         * If not provided, the nearest polygon to the position will be used.
         */
        startRef?: number;
        /**
         * The polygon filter to apply to the query.
         * @default this.defaultFilter
         */
        filter?: QueryFilter;
        /**
         * The search distance along each axis. [(x, y, z)]
         * @default this.defaultQueryHalfExtents
         */
        halfExtents?: Vector3;
    }): {
        success: boolean;
        status: number;
        randomPolyRef: number;
        randomPoint: Vector3;
    };
    /**
     * Moves from the start to the end position constrained to the navigation mesh.
     *
     * @param startRef the reference id of the start polygon.
     * @param startPosition a position of the mover within the start polygon.
     * @param endPosition the desired end position of the mover.
     *
     * @returns The result of the move along surface operation.
     */
    moveAlongSurface(startRef: number, startPosition: Vector3, endPosition: Vector3, options?: {
        /**
         * The polygon filter to apply to the query.
         * @default this.defaultFilter
         */
        filter?: QueryFilter;
        /**
         * The maximum number of polygons the output visited array can hold.
         * @default 256
         */
        maxVisitedSize?: number;
    }): {
        success: boolean;
        status: number;
        resultPosition: {
            x: number;
            y: number;
            z: number;
        };
        visited: number[];
    };
    /**
     * Returns a random point on the navmesh.
     * @param options additional options
     * @returns a random point on the navmesh
     */
    findRandomPoint(options?: {
        /**
         * The polygon filter to apply to the query.
         * @default this.defaultFilter
         */
        filter?: QueryFilter;
    }): {
        success: boolean;
        status: number;
        randomPolyRef: number;
        randomPoint: {
            x: number;
            y: number;
            z: number;
        };
    };
    /**
     * Gets the height of the polygon at the provided position using the height detail.
     *
     * @param polyRef the reference id of the polygon.
     * @param position a position within the xz-bounds of the polygon.
     */
    getPolyHeight(polyRef: number, position: Vector3): {
        success: boolean;
        status: number;
        height: number;
    };
    /**
     * Finds a straight path from the start position to the end position.
     *
     * @param start the start position
     * @param end the end position
     * @param options additional options
     *
     * @returns an array of Vector3 positions that make up the path, or an empty array if no path was found.
     */
    computePath(start: Vector3, end: Vector3, options?: {
        /**
         * The polygon filter to apply to the query.
         * @default this.defaultFilter
         */
        filter?: QueryFilter;
        /**
         * The search distance along each axis. [(x, y, z)]
         * @default this.defaultQueryHalfExtents
         */
        halfExtents?: Vector3;
        /**
         * The maximum number of polygons the path array can hold. [Limit: >= 1]
         * @default 256
         */
        maxPathPolys?: number;
        /**
         * The maximum number of points the straight path arrays can hold. [Limit: > 0]
         * @default 256
         */
        maxStraightPathPoints?: number;
    }): {
        /**
         * Whether a path was successfully computed.
         */
        success: boolean;
        /**
         * Error information if the path computation failed.
         */
        error?: {
            /**
             * Description of the error.
             */
            name: string;
            /**
             * A dtStatus status code if relevant.
             */
            status?: number;
        };
        /**
         * The result path.
         */
        path: Vector3[];
    };
    /**
     * Finds a path from the start polygon to the end polygon.
     * @param startRef the reference id of the start polygon.
     * @param endRef the reference id of the end polygon.
     * @param startPosition position within the start polygon.
     * @param endPosition position within the end polygon.
     * @param options additional options
     * @returns
     *
     * The `polys` array returned must be freed after use.
     *
     * ```ts
     * findPathResult.polys.destroy();
     * ```
     */
    findPath(startRef: number, endRef: number, startPosition: Vector3, endPosition: Vector3, options?: {
        /**
         * The polygon filter to apply to the query.
         * @default this.defaultFilter
         */
        filter?: QueryFilter;
        /**
         * The maximum number of polygons the path array can hold. [Limit: >= 1]
         * @default 256
         */
        maxPathPolys?: number;
    }): {
        success: boolean;
        status: number;
        polys: UnsignedIntArray;
    };
    /**
     * Finds the straight path from the start to the end position within the polygon corridor.
     *
     * This method peforms what is often called 'string pulling'.
     *
     * The start position is clamped to the first polygon in the path, and the
     * end position is clamped to the last. So the start and end positions should
     * normally be within or very near the first and last polygons respectively.
     *
     * The returned polygon references represent the reference id of the polygon
     * that is entered at the associated path position. The reference id associated
     * with the end point will always be zero.  This allows, for example, matching
     * off-mesh link points to their representative polygons.
     *
     * If the provided result arrays are too small for the entire result set,
     * they will be filled as far as possible from the start toward the end
     * position.
     *
     * @param start path start position
     * @param end path end position
     * @param path an array of polygon references that represent the path corridor
     * @param options additional options
     * @returns the straight path result
     *
     * The straightPath, straightPathFlags, and straightPathRefs arrays returned must be freed after use.
     *
     * ```ts
     * findStraightPathResult.straightPath.destroy();
     * findStraightPathResult.straightPathFlags.destroy();
     * findStraightPathResult.straightPathRefs.destroy();
     * ```
     */
    findStraightPath(start: Vector3, end: Vector3, path: number[] | UnsignedIntArray, options?: {
        /**
         * The maximum number of points the straight path arrays can hold. [Limit: > 0]
         * @default 256
         */
        maxStraightPathPoints?: number;
        /**
         * Options for dtNavMeshQuery::findStraightPath
         *
         * Add a vertex at every polygon edge crossing where area changes.
         * DT_STRAIGHTPATH_AREA_CROSSINGS = 1
         *
         * Add a vertex at every polygon edge crossing.
         * DT_STRAIGHTPATH_ALL_CROSSINGS = 2
         *
         * @default 0
         */
        straightPathOptions?: number;
    }): {
        success: boolean;
        status: number;
        /**
         * The straight path points.
         */
        straightPath: FloatArray;
        /**
         * The straight path flags.
         */
        straightPathFlags: UnsignedCharArray;
        /**
         * The reference ids of the visited polygons.
         *
         * Detour.DT_STRAIGHTPATH_START
         * Detour.DT_STRAIGHTPATH_END
         * Detour.DT_STRAIGHTPATH_OFFMESH_CONNECTION
         */
        straightPathRefs: UnsignedIntArray;
        /**
         * The number of points in the straight path.
         */
        straightPathCount: number;
    };
    /**
     * Casts a 'walkability' ray along the surface of the navigation mesh from the start position toward the end position.
     *
     * This method is meant to be used for quick, short distance checks.
     *
     * If the path array is too small to hold the result, it will be filled as far as possible from the start postion toward the end position.
     *
     * The raycast ignores the y-value of the end position. (2D check.) This places significant limits on how it can be used.
     *
     * <b>Using the Hit Parameter (t)</b>
     *
     * If the hit parameter is a very high value, then the ray has hit
     * the end position. In this case the path represents a valid corridor to the
     * end position and the value of hitNormal is undefined.
     *
     * If the hit parameter is zero, then the start position is on the wall that
     * was hit and the value of hitNormal is undefined.
     *
     * If 0 < t < 1.0 then the following applies:
     *
     * ```
     * distanceToHitBorder = distanceToEndPosition * t
     * hitPoint = startPos + (endPos - startPos) * t
     * ```
     *
     * <b>Use Case Restriction</b>
     *
     * Consider a scene where there is a main floor with a second floor balcony that hangs over the main floor.
     * So the first floor mesh extends below the balcony mesh.
     * The start position is somewhere on the first floor.
     * The end position is on the balcony.
     *
     * The raycast will search toward the end position along the first floor mesh.
     * If it reaches the end position's xz-coordinates it will indicate FLT_MAX,(no wall hit), meaning it reached the end position.
     * This is one example of why this method is meant for short distance checks.
     *
     * @param startRef the reference id of the start polygon.
     * @param startPosition a position within the start polygon representing the start of the ray
     * @param endPosition the position to cast the ray toward.
     * @param options additional options
     */
    raycast(startRef: number, startPosition: Vector3, endPosition: Vector3, options?: {
        /**
         * The polygon filter to apply to the query.
         * @default this.defaultFilter
         */
        filter?: QueryFilter;
        /**
         * Determines how the raycast behaves.
         *
         * // Raycast should calculate movement cost along the ray and fill RaycastHit::cost
         * DT_RAYCAST_USE_COSTS = 1
         *
         * @default 0
         */
        raycastOptions?: number;
        /**
         * Optional parent of start ref. Used during for cost calculation.
         */
        prevRef?: number;
    }): {
        /**
         * Whether the raycast was successful.
         */
        success: boolean;
        /**
         * The status of the raycast.
         */
        status: number;
        /**
         * The hit parameter.
         */
        t: number;
        /**
         * The normal of the nearest wall hit.
         */
        hitNormal: Vector3;
        /**
         * The index of the edge on the final polygon where the wall was hit.
         */
        hitEdgeIndex: number;
        /**
         * The reference ids of the visited polygons.
         */
        path: number[];
        /**
         * The maximum number of polygons the path can contain.
         */
        maxPath: number;
        /**
         * The cost of the path until hit.
         */
        pathCost: number;
    };
    /**
     * Destroys the NavMeshQuery instance
     */
    destroy(): void;
}
