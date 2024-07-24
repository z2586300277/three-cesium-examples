import type { NavMesh } from './nav-mesh';
import { NavMeshQuery, QueryFilter } from './nav-mesh-query';
import { RawModule } from './raw';
import { Vector3 } from './utils';
export type CrowdAgentParams = {
    /**
     * The radius of the agent.
     * @default 0.5
     */
    radius: number;
    /**
     * The height of the agent.
     * @default 1
     */
    height: number;
    /**
     * The maximum allowed acceleration for the agent.
     * @default 20
     */
    maxAcceleration: number;
    /**
     * The maximum allowed speed for the agent.
     * @default 6
     */
    maxSpeed: number;
    /**
     * Defines how close a collision element must be before it is considered for steering behaviors.
     * [Limits: > 0]
     * @default 2.5
     */
    collisionQueryRange: number;
    /**
     * The path visibility optimization range.
     * [Limit: > 0]
     * @default 0
     */
    pathOptimizationRange: number;
    /**
     * How aggresive the agent manager should be at avoiding collisions with this agent.
     * [Limit: >= 0]
     * @default 0
     */
    separationWeight: number;
    /**
     * Flags that impact steering behavior.
     * @default 7
     */
    updateFlags: number;
    /**
     * The index of the avoidance configuration to use for the agent.
     * [Limits: 0 <= value <= #DT_CROWD_MAX_OBSTAVOIDANCE_PARAMS]
     * @default 0
     */
    obstacleAvoidanceType: number;
    /**
     * The index of the query filter used by this agent.
     * @default 0
     */
    queryFilterType: number;
    /**
     * User defined data attached to the agent.
     * @default 0
     */
    userData: unknown;
};
export declare const crowdAgentParamsDefaults: CrowdAgentParams;
export declare class CrowdAgent implements CrowdAgentParams {
    crowd: Crowd;
    agentIndex: number;
    raw: RawModule.dtCrowdAgent;
    get radius(): number;
    set radius(value: number);
    get height(): number;
    set height(value: number);
    get maxAcceleration(): number;
    set maxAcceleration(value: number);
    get maxSpeed(): number;
    set maxSpeed(value: number);
    get collisionQueryRange(): number;
    set collisionQueryRange(value: number);
    get pathOptimizationRange(): number;
    set pathOptimizationRange(value: number);
    get separationWeight(): number;
    set separationWeight(value: number);
    get updateFlags(): number;
    set updateFlags(value: number);
    get obstacleAvoidanceType(): number;
    set obstacleAvoidanceType(value: number);
    get queryFilterType(): number;
    set queryFilterType(value: number);
    get userData(): unknown;
    set userData(value: unknown);
    /**
     * The interpolated position of the agent.
     *
     * Use this if stepping the crowd with interpolation.
     * This will not be updated if stepping the crowd without interpolation.
     */
    interpolatedPosition: Vector3;
    constructor(crowd: Crowd, agentIndex: number);
    /**
     * Updates the agent's target.
     * @param position The new target position.
     * @returns True if the request was successful.
     */
    requestMoveTarget(position: Vector3): boolean;
    /**
     * Submits a new move request for the specified agent.
     * @param velocity The desired velocity of the agent.
     * @returns True if the request was successful.
     */
    requestMoveVelocity(velocity: Vector3): boolean;
    /**
     * Resets the current move request for the specified agent.
     */
    resetMoveTarget(): void;
    /**
     * Teleports the agent to the specified position.
     * @param position
     */
    teleport(position: Vector3): void;
    /**
     * The position of the agent.
     * @returns
     */
    position(): Vector3;
    /**
     * The actual velocity of the agent. The change from velocityDesiredObstacleAdjusted -> velocity is constrained by max acceleration.
     */
    velocity(): Vector3;
    /**
     * The desired velocity of the agent. Based on the current path, calculated from scratch each frame.
     */
    desiredVelocity(): Vector3;
    /**
     * The desired velocity adjusted by obstacle avoidance, calculated from scratch each frame.
     */
    desiredVelocityObstacleAdjusted(): Vector3;
    /**
     * Returns the state of the agent.
     *
     * 0 = DT_CROWDAGENT_STATE_INVALID
     * 1 = DT_CROWDAGENT_STATE_WALKING
     * 2 = DT_CROWDAGENT_STATE_OFFMESH
     */
    state(): number;
    /**
     * Returns the next target position on the path to the target
     * @returns
     */
    target(): Vector3;
    /**
     * Returns the next target position on the path to the target
     * @returns
     */
    nextTargetInPath(): Vector3;
    /**
     * Returns the local path corridor corners for the agent
     * @returns
     */
    corners(): Vector3[];
    /**
     * Returns the agents parameters.
     * @returns
     */
    parameters(): CrowdAgentParams;
    /**
     * Updates the agent's parameters.
     * Any parameters not specified in the crowdAgentParams object will be unchanged.
     * @param crowdAgentParams agent parameters to update.
     */
    updateParameters(crowdAgentParams: Partial<CrowdAgentParams>): void;
    /**
     * Sets the agent's parameters.
     * Any parameters not specified in the crowdAgentParams object will be set to their default values.
     * @param crowdAgentParams agent parameters
     */
    setParameters(crowdAgentParams: Partial<CrowdAgentParams>): void;
    /**
     * Returns whether the agent is over an off-mesh connection.
     * @returns
     */
    overOffMeshConnection(): boolean;
}
export type CrowdParams = {
    /**
     * The maximum number of agents that can be managed by the crowd.
     * [Limit: >= 1]
     */
    maxAgents: number;
    /**
     * The maximum radius of any agent that will be added to the crowd.
     * [Limit: > 0]
     */
    maxAgentRadius: number;
};
export declare class Crowd {
    raw: RawModule.dtCrowd;
    /**
     * The agents in the crowd.
     */
    agents: {
        [idx: string]: CrowdAgent;
    };
    /**
     * The NavMesh the crowd is interacting with.
     */
    navMesh: NavMesh;
    /**
     * The NavMeshQuery used to find nearest polys for commands
     */
    navMeshQuery: NavMeshQuery;
    /**
     * Accumulator for fixed updates with interpolation
     */
    private accumulator;
    /**
     *
     * @param navMesh the navmesh the crowd will use for planning
     * @param param1 the crowd parameters
     *
     * @example
     * ```ts
     * const crowd = new Crowd(navMesh, {
     *   maxAgents: 100,
     *   maxAgentRadius: 1,
     * });
     * ```
     */
    constructor(navMesh: NavMesh, { maxAgents, maxAgentRadius }: CrowdParams);
    /**
     * Steps the crowd forward in time with a fixed time step.
     *
     * There are two modes. The simple mode is fixed timestepping without interpolation. In this case you only use the first argument. The second case uses interpolation. In that you also provide the time since the function was last used, as well as the maximum fixed timesteps to take.
     *
     * @param dt The fixed time step size to use.
     * @param timeSinceLastCalled The time elapsed since the function was last called.
     * @param maxSubSteps Maximum number of fixed steps to take per function call.
     *
     * @example fixed time stepping
     * ```ts
     * const deltaTime = 1 / 60;
     * crowd.update(deltaTime);
     * ```
     *
     * @example variable time stepping
     * ```ts
     * crowd.update(timeSinceLastUpdate);
     * ```
     *
     * @example fixed time stepping with interpolation
     * ```ts
     * const deltaTime = 1 / 60;
     * const maxSubSteps = 10;
     * crowd.update(deltaTime, timeSinceLastUpdate, maxSubSteps);
     *
     * console.log(agent.interpolatedPosition);
     * ```
     */
    update(dt: number, timeSinceLastCalled?: number, maxSubSteps?: number): void;
    /**
     * Adds a new agent to the crowd.
     */
    addAgent(position: Vector3, crowdAgentParams: Partial<CrowdAgentParams>): CrowdAgent;
    /**
     * Gets the agent for the specified index, or null if no agent has the given index.
     * @param agentIndex
     * @returns
     */
    getAgent(agentIndex: number): CrowdAgent | null;
    /**
     * Removes the agent from the crowd.
     */
    removeAgent(agent: number | CrowdAgent): void;
    /**
     * Returns the maximum number of agents that can be managed by the crowd.
     */
    getAgentCount(): number;
    /**
     * Returns the number of active agents in the crowd.
     */
    getActiveAgentCount(): number;
    /**
     * Returns all the agents managed by the crowd.
     */
    getAgents(): CrowdAgent[];
    /**
     * Gets the query filter for the specified index.
     * @param filterIndex the index of the query filter to retrieve, (min 0, max 15)
     * @returns the query filter
     */
    getFilter(filterIndex: number): QueryFilter;
    /**
     * Destroys the crowd.
     */
    destroy(): void;
}
