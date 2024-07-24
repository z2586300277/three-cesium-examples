# @recast-navigation/three

Three.js nav mesh generation and visualisation helpers for [`recast-navigation`](https://github.com/isaac-mason/recast-navigation-js/tree/main/packages/recast-navigation).

## Installation

```bash
> npm install @recast-navigation/three recast-navigation
```

## Usage

### Importing

To import the three.js glue, you can either use the `three` entrypoint in `recast-navigation`:

```ts
import { init } from 'recast-navigation'
import { ... } from 'recast-navigation/three';
```

Or you can use the packages directly:

```ts
import { init } from '@recast-navigation/core'
import { ... } from '@recast-navigation/three';
```

### Initialization

Before you can use the library, you must initialize it. This is an asynchronous operation.

Calling `init()` after the library has already been initialized will return a promise that resolves immediately.

```ts
import { init } from 'recast-navigation';

await init();
```

### Generating a NavMesh

This package provides convenience functions for generating nav meshes from THREE.Mesh objects.

```ts
import { init } from 'recast-navigation';
import { threeToSoloNavMesh, threeToTiledNavMesh, threeToTileCache } from 'recast-navigation/three';
import * as THREE from 'three';

/* initialize the library */
await init();

/* create your scene */
const scene = new THREE.Scene();
// ...

/* get meshes to generate the navmesh from */
const meshes: THREE.Mesh[] = [];
scene.traverse((child) => {
  if (child instanceof THREE.Mesh) {
    meshes.push(child);
  }
});

/* generate a solo navmesh */
const { success, navMesh } = threeToSoloNavMesh(meshes, {
  // ... nav mesh generation config ...
}});

/* generate a tiled navmesh */
const { success, navMesh } = threeToTiledNavMesh(meshes, {
  tileSize: 16,
  // ... nav mesh generation config ...
}});

/* generate a tile cache with support for temporary obstacles */
const { success, navMesh, tileCache } = threeToTileCache(meshes, {
  tileSize: 16,
  // ... nav mesh generation config ...
}});
```

### Interacting with a NavMesh

You can documentation for interacting with the generated navmesh in the core library README:

https://github.com/isaac-mason/recast-navigation-js

This library provides helpers that are used in conjunction with the core library.

### Debug Drawer

This package provides a `DebugDrawer` utility that can visualise a navmesh and other generation intermediates.

```ts
import { DebugDrawer } from 'recast-navigation/three';

const debugDrawer = new DebugDrawer({ scene });

// resize the debug drawer when the window resizes
// required for rendering lines correctly
debugDrawer.resize(window.innerWidth, window.innerHeight);

// draw a navmesh
debugDrawer.drawNavMesh(navMesh);

// clear the debug drawer
debugDrawer.reset();

// dispose of threejs and wasm resources
debugDrawer.dispose();
```

See the Debug Drawer storybooks for more examples: https://recast-navigation-js.isaacmason.com/?path=/story/debug-three-debug-drawer--nav-mesh

### Helpers

This package provides helpers for visualizing various recast-navigation objects in three.js.

#### `NavMeshHelper`

```ts
import { NavMeshHelper } from 'recast-navigation/three';

const navMeshHelper = new NavMeshHelper({ navMesh });

scene.add(navMeshHelper);

// update the helper when the navmesh changes
navMeshHelper.update();
```

#### `OffMeshConnectionsHelper`

```ts
import { OffMeshConnectionsHelper } from 'recast-navigation/three';

const offMeshConnectionsHelper = new OffMeshConnectionsHelper({
  offMeshConnections,
});

scene.add(offMeshConnectionsHelper);
```

#### `TileCacheHelper`

Visualises obstacles in a `TileCache`.

```ts
import { TileCacheHelper } from 'recast-navigation/three';

const tileCacheHelper = new TileCacheHelper({ tileCache });

scene.add(tileCacheHelper);

// update the helper after adding or removing obstacles
tileCacheHelper.update();
```

#### `CrowdHelper`

Visualises agents in a `Crowd`.

```ts
import { CrowdHelper } from 'recast-navigation/three';

const crowdHelper = new CrowdHelper({ crowd });

scene.add(crowdHelper);

// update the helper after updating the crowd
crowdHelper.update();
```

#### Custom Materials

You can optionally provide custom materials to the helpers.

```ts
// NavMeshHelper
const navMeshMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
const navMeshHelper = new NavMeshHelper({
  navMesh,
  navMeshMaterial,
});

// OffMeshConnectionsHelper
const offMeshConnectionEntryCircleMaterial = new THREE.MeshBasicMaterial({
  color: 'green',
});
const offMeshConnectionExitCircleMaterial = new THREE.MeshBasicMaterial({
  color: 'yellow',
});
const offMeshConnectionLineMaterial = new THREE.LineBasicMaterial({
  color: 'white',
});
const offMeshConnectionsHelper = new OffMeshConnectionsHelper({
  offMeshConnections,
  entryCircleMaterial: offMeshConnectionEntryCircleMaterial,
  exitCircleMaterial: offMeshConnectionExitCircleMaterial,
  lineMaterial: offMeshConnectionLineMaterial,
});

// TileCacheHelper
const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 'blue' });
const tileCacheHelper = new TileCacheHelper({
  tileCache,
  obstacleMaterial,
});

// CrowdHelper
const agentMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
const crowdHelper = new CrowdHelper({
  crowd,
  agentMaterial,
});
```
