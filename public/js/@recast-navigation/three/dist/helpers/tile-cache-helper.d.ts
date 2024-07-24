import { Obstacle, TileCache } from '@recast-navigation/core';
import { Material, Mesh, Object3D } from 'three';
export type TileCacheHelperParams = {
    tileCache: TileCache;
    obstacleMaterial?: Material;
};
export declare class TileCacheHelper extends Object3D {
    tileCache: TileCache;
    obstacleMeshes: Map<Obstacle, Mesh>;
    obstacleMaterial: Material;
    constructor({ tileCache, obstacleMaterial }: TileCacheHelperParams);
    /**
     * Update the obstacle meshes.
     *
     * This should be called after adding or removing obstacles.
     */
    update(): void;
}
