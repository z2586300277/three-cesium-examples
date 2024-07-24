import { type RawModule } from './raw';
export type Vector3 = {
    x: number;
    y: number;
    z: number;
};
export type Vector3Tuple = [number, number, number];
export type Vector2 = {
    x: number;
    y: number;
};
export type Vector2Tuple = [x: number, y: number];
export declare const vec3: {
    toRaw: ({ x, y, z }: Vector3, existing?: RawModule.Vec3) => RawModule.Vec3;
    fromRaw: (vec3: RawModule.Vec3) => {
        x: number;
        y: number;
        z: number;
    };
    fromArray: ([x, y, z]: number[]) => {
        x: number;
        y: number;
        z: number;
    };
    toArray: ({ x, y, z }: Vector3) => Vector3Tuple;
    lerp: (a: Vector3, b: Vector3, t: number, out?: Vector3) => void;
    copy: (source: Vector3, out?: Vector3) => void;
};
export declare const array: <T>(getter: (index: number) => T, count: number) => T[];
