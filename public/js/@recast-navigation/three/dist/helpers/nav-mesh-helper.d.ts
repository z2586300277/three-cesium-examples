import { NavMesh } from '@recast-navigation/core';
import { BufferGeometry, Material, Mesh, Object3D } from 'three';
export type NavMeshHelperParams = {
    navMesh: NavMesh;
    navMeshMaterial?: Material;
};
export declare class NavMeshHelper extends Object3D {
    navMesh: NavMesh;
    navMeshMaterial: Material;
    mesh: Mesh;
    geometry: BufferGeometry;
    constructor({ navMesh, navMeshMaterial }: NavMeshHelperParams);
    /**
     * Update the three debug nav mesh.
     *
     * This should be called after updating the nav mesh.
     */
    update(): void;
}
