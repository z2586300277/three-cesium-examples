import { Crowd } from '@recast-navigation/core';
import { Material, Mesh, Object3D } from 'three';
export type CrowdHelperParams = {
    crowd: Crowd;
    agentMaterial?: Material;
};
export declare class CrowdHelper extends Object3D {
    agentMeshes: Map<number, Mesh>;
    recastCrowd: Crowd;
    agentMaterial: Material;
    constructor({ crowd, agentMaterial }: CrowdHelperParams);
    /**
     * Update the three debug view of the crowd agents.
     *
     * This should be called after updating the crowd.
     */
    update(): void;
    private createAgentMesh;
    private updateAgentGeometry;
}
