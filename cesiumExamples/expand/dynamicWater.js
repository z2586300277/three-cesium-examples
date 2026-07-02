import * as Cesium from "cesium";
import * as dat from "dat.gui";

const box = document.getElementById("box");

const WATER_RANGE_MODES = {
    RECTANGLE: "rectangle",
    POLYGON: "polygon",
};

const DEFAULT_WATER_PARAMS = {
    animate: true,
    timeScale: 1,
    waveScale: 12,
    waveHeight: 0.82,
    geometryWaveHeight: 520,
    choppy: 4.2,
    speed: 0.72,
    foam: 0.58,
    normalStrength: 1.9,
    fresnel: 0.78,
    specular: 2.35,
    alpha: 0.92,
    planeHeight: 1800,
    planeWidth: 7200,
    planeDepth: 4200,
    planeLon: 121,
    planeLat: 35.8,
    rangeMode: WATER_RANGE_MODES.POLYGON,
    polygonPositions: [
        [120.956, 35.776],
        [121.035, 35.742],
        [121.09, 35.808],
        [121.038, 35.872],
        [120.944, 35.85],
    ],
    deepColor: [8, 66, 96],
    shallowColor: [54, 192, 198],
    foamColor: [231, 250, 255],
    meshSegments: 160,
};

const WATER_VERTEX_SHADER = `
  in vec3 position3DHigh;
  in vec3 position3DLow;
  in vec3 normal;
  in vec3 tangent;
  in vec3 bitangent;
  in vec2 st;
  in float batchId;

  out vec3 v_positionEC;
  out vec3 v_normalEC;
  out vec3 v_tangentEC;
  out vec3 v_bitangentEC;
  out vec2 v_st;

  uniform float u_vertexTime;
  uniform float u_vertexWaveScale;
  uniform float u_vertexWaveHeight;
  uniform float u_vertexGeometryWaveHeight;
  uniform float u_vertexChoppy;
  uniform float u_vertexSpeed;
  uniform float u_vertexNormalStrength;

  float vertexHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vertexNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return -1.0 + 2.0 * mix(
      mix(vertexHash(i + vec2(0.0, 0.0)), vertexHash(i + vec2(1.0, 0.0)), u.x),
      mix(vertexHash(i + vec2(0.0, 1.0)), vertexHash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float vertexSeaOctave(vec2 uv, float choppy) {
    uv += vertexNoise(uv);
    vec2 wave = 1.0 - abs(sin(uv));
    vec2 swell = abs(cos(uv));
    wave = mix(wave, swell, wave);
    return pow(1.0 - pow(wave.x * wave.y, 0.65), choppy);
  }

  float vertexSeaHeight(vec2 uv) {
    float freq = 0.16;
    float amp = u_vertexWaveHeight;
    float choppy = u_vertexChoppy;
    float height = 0.0;
    float t = u_vertexTime * u_vertexSpeed;
    mat2 octaveMatrix = mat2(1.60, 1.20, -1.20, 1.60);

    uv.x *= 0.75;
    for (int i = 0; i < 5; i++) {
      float d = vertexSeaOctave((uv + t) * freq, choppy);
      d += vertexSeaOctave((uv - t) * freq, choppy);
      height += d * amp;
      uv = octaveMatrix * uv;
      freq *= 1.9;
      amp *= 0.22;
      choppy = mix(choppy, 1.0, 0.2);
    }
    return height;
  }

  void main() {
    v_st = st;

    vec3 positionRTE = czm_computePosition().xyz;
    vec2 centered = st * 2.0 - 1.0;
    vec2 waveUv = centered * u_vertexWaveScale;
    float macro = vertexNoise(waveUv * 0.055 + vec2(u_vertexTime * 0.018, -u_vertexTime * 0.012));
    waveUv += vec2(macro * 1.7, -macro * 1.1);

    float height = vertexSeaHeight(waveUv) - (u_vertexWaveHeight * 1.05);
    float displacement = height * u_vertexGeometryWaveHeight;

    float eps = 0.055;
    float hx = vertexSeaHeight(waveUv + vec2(eps, 0.0)) - vertexSeaHeight(waveUv - vec2(eps, 0.0));
    float hy = vertexSeaHeight(waveUv + vec2(0.0, eps)) - vertexSeaHeight(waveUv - vec2(0.0, eps));
    vec3 objectNormal = normalize(
      normal
        - tangent * hx * u_vertexNormalStrength * 0.16
        - bitangent * hy * u_vertexNormalStrength * 0.16
    );

    vec3 displacedRTE = positionRTE + normal * displacement;
    vec4 p = vec4(displacedRTE, 1.0);
    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;
    v_normalEC = normalize(czm_normal * objectNormal);
    v_tangentEC = normalize(czm_normal * tangent);
    v_bitangentEC = normalize(czm_normal * bitangent);
    gl_Position = czm_modelViewProjectionRelativeToEye * p;
  }
`;

const WATER_FRAGMENT_SHADER = `
  in vec3 v_positionEC;
  in vec3 v_normalEC;
  in vec3 v_tangentEC;
  in vec3 v_bitangentEC;
  in vec2 v_st;

  uniform float u_time;
  uniform float u_waveScale;
  uniform float u_waveHeight;
  uniform float u_choppy;
  uniform float u_speed;
  uniform float u_foam;
  uniform float u_normalStrength;
  uniform float u_fresnelPower;
  uniform float u_specularStrength;
  uniform float u_alpha;
  uniform vec4 u_deepColor;
  uniform vec4 u_shallowColor;
  uniform vec4 u_foamColor;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return -1.0 + 2.0 * mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float seaOctave(vec2 uv, float choppy) {
    uv += noise(uv);
    vec2 wave = 1.0 - abs(sin(uv));
    vec2 swell = abs(cos(uv));
    wave = mix(wave, swell, wave);
    return pow(1.0 - pow(wave.x * wave.y, 0.65), choppy);
  }

  float seaHeight(vec2 uv) {
    float freq = 0.16;
    float amp = u_waveHeight;
    float choppy = u_choppy;
    float height = 0.0;
    float t = u_time * u_speed;
    mat2 octaveMatrix = mat2(1.60, 1.20, -1.20, 1.60);

    uv.x *= 0.75;
    for (int i = 0; i < 6; i++) {
      float d = seaOctave((uv + t) * freq, choppy);
      d += seaOctave((uv - t) * freq, choppy);
      height += d * amp;
      uv = octaveMatrix * uv;
      freq *= 1.9;
      amp *= 0.22;
      choppy = mix(choppy, 1.0, 0.2);
    }
    return height;
  }

  vec3 waterNormal(vec2 uv) {
    float eps = 0.045;
    float h = seaHeight(uv);
    float hx = seaHeight(uv + vec2(eps, 0.0)) - h;
    float hy = seaHeight(uv + vec2(0.0, eps)) - h;
    return normalize(vec3(-hx * u_normalStrength, -hy * u_normalStrength, eps));
  }

  vec3 skyReflection(vec3 n) {
    float up = clamp(n.z * 0.5 + 0.5, 0.0, 1.0);
    return mix(vec3(0.54, 0.73, 0.86), vec3(0.06, 0.20, 0.31), pow(1.0 - up, 2.0));
  }

  void main() {
    vec2 centered = v_st * 2.0 - 1.0;
    vec2 uv = centered * u_waveScale;
    float macro = noise(uv * 0.055 + vec2(u_time * 0.018, -u_time * 0.012));
    uv += vec2(macro * 1.7, -macro * 1.1);

    vec3 tangentSpaceNormal = waterNormal(uv);
    vec3 normalEC = normalize(v_normalEC);
    vec3 tangentEC = normalize(v_tangentEC);
    vec3 bitangentEC = normalize(v_bitangentEC);
    vec3 displacedNormalEC = normalize(
      tangentEC * tangentSpaceNormal.x +
      bitangentEC * tangentSpaceNormal.y +
      normalEC * (tangentSpaceNormal.z + 0.72)
    );

    float h = seaHeight(uv);
    float crest = smoothstep(0.58, 1.55, h) * u_foam;
    crest += smoothstep(0.72, 1.0, 1.0 - abs(tangentSpaceNormal.z)) * u_foam * 0.55;
    crest = clamp(crest, 0.0, 1.0);

    vec3 viewDir = normalize(-v_positionEC);
    float fresnel = pow(1.0 - clamp(abs(dot(displacedNormalEC, viewDir)), 0.0, 1.0), 3.0);
    fresnel = clamp(fresnel * (0.55 + u_fresnelPower), 0.0, 1.0);

    vec3 base = mix(
      u_deepColor.rgb,
      u_shallowColor.rgb,
      clamp(h * 0.16 + 0.18 + macro * 0.12, 0.0, 1.0)
    );
    vec3 reflection = skyReflection(displacedNormalEC);

    vec3 lightDir = normalize(czm_sunDirectionEC);
    float diffuse = pow(clamp(dot(displacedNormalEC, lightDir) * 0.42 + 0.58, 0.0, 1.0), 2.0);
    float sparkle = pow(max(dot(reflect(-lightDir, displacedNormalEC), viewDir), 0.0), 72.0) * u_specularStrength;
    float slopeGlint = pow(clamp(1.0 - abs(tangentSpaceNormal.z), 0.0, 1.0), 3.0) * u_specularStrength * 0.16;

    vec3 color = mix(base * (0.78 + diffuse * 0.30), reflection, fresnel);
    color += (sparkle + slopeGlint) * vec3(1.0, 0.94, 0.82);
    color = mix(color, u_foamColor.rgb, crest);
    color = czm_gammaCorrect(color);

    out_FragColor = vec4(color, clamp(u_alpha + crest * 0.14, 0.0, 1.0));
  }
`;

class DynamicWaterSurface {
    constructor({ viewer, params = {} }) {
        this.viewer = viewer;
        this.params = createWaterParams(params);
        this.primitive = null;
        this.uniforms = null;
        this.area = null;
        this.startTime = performance.now();
        this.preRenderListener = this.updateUniforms;
    }

    addToScene() {
        this.rebuild();
        this.viewer.scene.preRender.addEventListener(this.preRenderListener);
    }

    rebuild = () => {
        this.removePrimitive();

        this.uniforms = createWaterUniforms();
        this.area = resolveWaterArea(this.params);
        this.updateUniforms();

        this.primitive = this.viewer.scene.primitives.add(
            new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: createWaterMeshGeometry(this.params, this.area),
                }),
                modelMatrix: this.area.modelMatrix,
                appearance: new Cesium.Appearance({
                    vertexShaderSource: WATER_VERTEX_SHADER,
                    fragmentShaderSource: WATER_FRAGMENT_SHADER,
                    renderState: Cesium.Appearance.getDefaultRenderState(true, false, {
                        depthTest: {
                            enabled: true,
                        },
                    }),
                    translucent: true,
                    closed: false,
                }),
                asynchronous: false,
            })
        );

        this.primitive.appearance.uniforms = this.uniforms;
        this.viewer.scene.requestRender();
    };

    updateUniforms = () => {
        if (!this.uniforms) {
            return;
        }

        if (this.params.animate) {
            this.uniforms.u_time =
                (performance.now() - this.startTime) * 0.001 * this.params.timeScale;
        }

        this.uniforms.u_waveScale = this.params.waveScale;
        this.uniforms.u_waveHeight = this.params.waveHeight;
        this.uniforms.u_geometryWaveHeight = this.params.geometryWaveHeight;
        this.uniforms.u_choppy = this.params.choppy;
        this.uniforms.u_speed = this.params.speed;
        this.uniforms.u_foam = this.params.foam;
        this.uniforms.u_normalStrength = this.params.normalStrength;
        this.uniforms.u_fresnelPower = this.params.fresnel;
        this.uniforms.u_specularStrength = this.params.specular;
        this.uniforms.u_alpha = this.params.alpha;
        this.uniforms.u_deepColor = colorArrayToVec4(this.params.deepColor, 1);
        this.uniforms.u_shallowColor = colorArrayToVec4(this.params.shallowColor, 1);
        this.uniforms.u_foamColor = colorArrayToVec4(this.params.foamColor, 1);
        this.uniforms.u_vertexTime = this.uniforms.u_time;
        this.uniforms.u_vertexWaveScale = this.params.waveScale;
        this.uniforms.u_vertexWaveHeight = this.params.waveHeight;
        this.uniforms.u_vertexGeometryWaveHeight = this.params.geometryWaveHeight;
        this.uniforms.u_vertexChoppy = this.params.choppy;
        this.uniforms.u_vertexSpeed = this.params.speed;
        this.uniforms.u_vertexNormalStrength = this.params.normalStrength;
    };

    updatePosition() {
        if (!this.primitive) {
            return;
        }

        this.area = resolveWaterArea(this.params);
        this.primitive.modelMatrix = this.area.modelMatrix;
        this.viewer.scene.requestRender();
    }

    flyTo(duration = 1.5) {
        const area = this.area ?? resolveWaterArea(this.params);
        const localOffset = new Cesium.Cartesian3(
            -area.width * 0.42,
            -area.depth * 0.56,
            this.params.geometryWaveHeight * 3.2
        );
        const destination = Cesium.Matrix4.multiplyByPoint(
            area.modelMatrix,
            localOffset,
            new Cesium.Cartesian3()
        );

        this.viewer.camera.flyTo({
            destination,
            orientation: {
                heading: Cesium.Math.toRadians(42),
                pitch: Cesium.Math.toRadians(-18),
                roll: 0,
            },
            duration,
        });
    }

    removePrimitive() {
        if (this.primitive) {
            this.viewer.scene.primitives.remove(this.primitive);
            this.primitive = null;
        }
    }

    destroy() {
        this.viewer.scene.preRender.removeEventListener(this.preRenderListener);
        this.removePrimitive();
        this.uniforms = null;
        this.area = null;
    }
}

function createViewer() {
    const imageryUrl =
        globalThis.GLOBAL_CONFIG?.getLayerUrl?.() ??
        "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer";

    const viewer = new Cesium.Viewer(box, {
        animation: false,
        baseLayerPicker: false,
        baseLayer: Cesium.ImageryLayer.fromProviderAsync(
            Cesium.ArcGisMapServerImageryProvider.fromUrl(imageryUrl)
        ),
        fullscreenButton: false,
        timeline: false,
        infoBox: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        selectionIndicator: false,
    });

    viewer._cesiumWidget._creditContainer.style.display = "none";
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.highDynamicRange = true;
    viewer.scene.postProcessStages.fxaa.enabled = true;

    if ("msaaSamples" in viewer.scene) {
        viewer.scene.msaaSamples = 4;
    }

    return viewer;
}

function addWaterGui(waterSurface) {
    const params = waterSurface.params;
    const gui = new dat.GUI({ name: "Dynamic Water" });

    params.rebuildWater = () => {
        waterSurface.rebuild();
        waterSurface.flyTo();
    };
    params.resetWaterView = () => waterSurface.flyTo();

    const motion = gui.addFolder("Motion");
    motion.add(params, "animate").name("Animate");
    motion.add(params, "timeScale", 0.1, 3.0, 0.01).name("Time Scale");
    motion.add(params, "speed", 0.0, 2.0, 0.01).name("Flow Speed");
    motion.add(params, "waveScale", 2.0, 30.0, 0.1).name("Wave Density");
    motion.add(params, "waveHeight", 0.05, 2.2, 0.01).name("Wave Height");
    motion.add(params, "geometryWaveHeight", 0.0, 1800.0, 10.0).name("Geometry Height");
    motion.add(params, "choppy", 0.8, 8.0, 0.01).name("Choppy");

    const look = gui.addFolder("Appearance");
    look.add(params, "foam", 0.0, 1.0, 0.01).name("Foam");
    look.add(params, "normalStrength", 0.2, 4.0, 0.01).name("Normal Strength");
    look.add(params, "fresnel", 0.0, 1.8, 0.01).name("Fresnel");
    look.add(params, "specular", 0.0, 4.0, 0.01).name("Specular");
    look.add(params, "alpha", 0.2, 1.0, 0.01).name("Alpha");
    look.addColor(params, "deepColor").name("Deep Color");
    look.addColor(params, "shallowColor").name("Shallow Color");
    look.addColor(params, "foamColor").name("Foam Color");

    const area = gui.addFolder("Area");
    area
        .add(params, "rangeMode", Object.values(WATER_RANGE_MODES))
        .name("Range Mode")
        .onFinishChange(params.rebuildWater);
    area
        .add(params, "meshSegments", 24, 260, 1)
        .name("Mesh Segments")
        .onFinishChange(params.rebuildWater);
    area
        .add(params, "planeWidth", 1000.0, 20000.0, 100.0)
        .name("Plane Width")
        .onFinishChange(params.rebuildWater);
    area
        .add(params, "planeDepth", 1000.0, 16000.0, 100.0)
        .name("Plane Depth")
        .onFinishChange(params.rebuildWater);
    area
        .add(params, "planeHeight", 0.0, 6000.0, 50.0)
        .name("Plane Height")
        .onFinishChange(() => waterSurface.updatePosition());
    area
        .add(params, "planeLon", 118.0, 124.0, 0.01)
        .name("Center Lon")
        .onFinishChange(() => waterSurface.updatePosition());
    area
        .add(params, "planeLat", 33.0, 39.0, 0.01)
        .name("Center Lat")
        .onFinishChange(() => waterSurface.updatePosition());
    area.add(params, "rebuildWater").name("Rebuild Water");
    area.add(params, "resetWaterView").name("Reset View");

    motion.open();
    look.open();

    return gui;
}

function resolveWaterArea(params) {
    const polygonPositions = normalizePolygonPositions(params.polygonPositions);

    if (params.rangeMode === WATER_RANGE_MODES.POLYGON && polygonPositions.length >= 3) {
        return createPolygonArea(params, polygonPositions);
    }

    return createRectangleArea(params);
}

function createRectangleArea(params) {
    const width = Math.max(1, params.planeWidth);
    const depth = Math.max(1, params.planeDepth);
    const center = createCenterFrame(params.planeLon, params.planeLat, params.planeHeight);

    return {
        mode: WATER_RANGE_MODES.RECTANGLE,
        centerLon: params.planeLon,
        centerLat: params.planeLat,
        height: params.planeHeight,
        width,
        depth,
        minX: -width * 0.5,
        maxX: width * 0.5,
        minY: -depth * 0.5,
        maxY: depth * 0.5,
        modelMatrix: center.modelMatrix,
        containsPoint: () => true,
    };
}

function createPolygonArea(params, polygonPositions) {
    const centerLon =
        polygonPositions.reduce((total, point) => total + point.lon, 0) /
        polygonPositions.length;
    const centerLat =
        polygonPositions.reduce((total, point) => total + point.lat, 0) /
        polygonPositions.length;
    const center = createCenterFrame(centerLon, centerLat, params.planeHeight);
    const inverseFrame = Cesium.Matrix4.inverseTransformation(
        center.modelMatrix,
        new Cesium.Matrix4()
    );
    const localPolygon = polygonPositions.map((point) => {
        const world = Cesium.Cartesian3.fromDegrees(point.lon, point.lat, params.planeHeight);
        const local = Cesium.Matrix4.multiplyByPoint(
            inverseFrame,
            world,
            new Cesium.Cartesian3()
        );

        return {
            x: local.x,
            y: local.y,
        };
    });
    const bounds = getLocalBounds(localPolygon);

    return {
        mode: WATER_RANGE_MODES.POLYGON,
        centerLon,
        centerLat,
        height: params.planeHeight,
        width: bounds.maxX - bounds.minX,
        depth: bounds.maxY - bounds.minY,
        minX: bounds.minX,
        maxX: bounds.maxX,
        minY: bounds.minY,
        maxY: bounds.maxY,
        modelMatrix: center.modelMatrix,
        polygon: localPolygon,
        containsPoint: (x, y) => isPointInPolygon(x, y, localPolygon),
    };
}

function createCenterFrame(lon, lat, height) {
    const center = Cesium.Cartesian3.fromDegrees(lon, lat, height);

    return {
        center,
        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(center),
    };
}

function normalizePolygonPositions(positions = []) {
    if (!Array.isArray(positions)) {
        return [];
    }

    const normalized = positions
        .map((position) => {
            if (Array.isArray(position)) {
                return {
                    lon: Number(position[0]),
                    lat: Number(position[1]),
                };
            }

            return {
                lon: Number(position.lon ?? position.longitude),
                lat: Number(position.lat ?? position.latitude),
            };
        })
        .filter((position) => Number.isFinite(position.lon) && Number.isFinite(position.lat));

    const first = normalized[0];
    const last = normalized[normalized.length - 1];
    if (
        first &&
        last &&
        Math.abs(first.lon - last.lon) < 1e-10 &&
        Math.abs(first.lat - last.lat) < 1e-10
    ) {
        normalized.pop();
    }

    return normalized;
}

function getLocalBounds(points) {
    return points.reduce(
        (bounds, point) => ({
            minX: Math.min(bounds.minX, point.x),
            maxX: Math.max(bounds.maxX, point.x),
            minY: Math.min(bounds.minY, point.y),
            maxY: Math.max(bounds.maxY, point.y),
        }),
        {
            minX: Number.POSITIVE_INFINITY,
            maxX: Number.NEGATIVE_INFINITY,
            minY: Number.POSITIVE_INFINITY,
            maxY: Number.NEGATIVE_INFINITY,
        }
    );
}

function isPointInPolygon(x, y, polygon) {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const current = polygon[i];
        const previous = polygon[j];
        const crossesY = current.y > y !== previous.y > y;

        if (crossesY) {
            const crossingX =
                ((previous.x - current.x) * (y - current.y)) / (previous.y - current.y) +
                current.x;
            if (x < crossingX) {
                inside = !inside;
            }
        }
    }

    return inside;
}

function createWaterMeshGeometry(params, area) {
    const xSegments = Math.max(8, Math.floor(params.meshSegments));
    const ySegments = Math.max(8, Math.floor(xSegments * (area.depth / area.width)));
    const gridWidth = Math.max(1, area.width);
    const gridDepth = Math.max(1, area.depth);
    const gridIndexByCell = new Map();
    const positionValues = [];
    const stValues = [];
    const normalValues = [];
    const tangentValues = [];
    const bitangentValues = [];
    const batchIdValues = [];
    const indices = [];

    for (let y = 0; y <= ySegments; y++) {
        const v = y / ySegments;

        for (let x = 0; x <= xSegments; x++) {
            const u = x / xSegments;
            const px = area.minX + u * gridWidth;
            const py = area.minY + v * gridDepth;

            if (
                area.mode === WATER_RANGE_MODES.POLYGON &&
                !shouldKeepPolygonVertex(x, y, xSegments, ySegments, area)
            ) {
                continue;
            }

            const vertexIndex = positionValues.length / 3;
            gridIndexByCell.set(getGridKey(x, y), vertexIndex);
            positionValues.push(px, py, 0);
            normalValues.push(0, 0, 1);
            tangentValues.push(1, 0, 0);
            bitangentValues.push(0, 1, 0);
            stValues.push(u, v);
            batchIdValues.push(0);
        }
    }

    for (let y = 0; y < ySegments; y++) {
        for (let x = 0; x < xSegments; x++) {
            const i0 = gridIndexByCell.get(getGridKey(x, y));
            const i1 = gridIndexByCell.get(getGridKey(x + 1, y));
            const i2 = gridIndexByCell.get(getGridKey(x, y + 1));
            const i3 = gridIndexByCell.get(getGridKey(x + 1, y + 1));

            if ([i0, i1, i2, i3].some((index) => index === undefined)) {
                continue;
            }

            indices.push(i0, i2, i1, i1, i2, i3);
        }
    }

    return createGeometryFromArrays({
        positions: new Float64Array(positionValues),
        st: new Float32Array(stValues),
        normals: new Float32Array(normalValues),
        tangents: new Float32Array(tangentValues),
        bitangents: new Float32Array(bitangentValues),
        batchIds: new Float32Array(batchIdValues),
        indices: createTypedIndices(indices, positionValues.length / 3),
        boundingRadius:
            Math.sqrt(gridWidth * gridWidth + gridDepth * gridDepth) * 0.5 +
            params.geometryWaveHeight * 2,
    });
}

function shouldKeepPolygonVertex(x, y, xSegments, ySegments, area) {
    const halfCellX = (area.width / xSegments) * 0.5;
    const halfCellY = (area.depth / ySegments) * 0.5;
    const px = area.minX + (x / xSegments) * area.width;
    const py = area.minY + (y / ySegments) * area.depth;

    return (
        area.containsPoint(px, py) ||
        area.containsPoint(px - halfCellX, py) ||
        area.containsPoint(px + halfCellX, py) ||
        area.containsPoint(px, py - halfCellY) ||
        area.containsPoint(px, py + halfCellY)
    );
}

function createGeometryFromArrays({
    positions,
    st,
    normals,
    tangents,
    bitangents,
    batchIds,
    indices,
    boundingRadius,
}) {
    return new Cesium.Geometry({
        attributes: {
            position: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.DOUBLE,
                componentsPerAttribute: 3,
                values: positions,
            }),
            normal: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 3,
                values: normals,
            }),
            tangent: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 3,
                values: tangents,
            }),
            bitangent: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 3,
                values: bitangents,
            }),
            st: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 2,
                values: st,
            }),
            batchId: new Cesium.GeometryAttribute({
                componentDatatype: Cesium.ComponentDatatype.FLOAT,
                componentsPerAttribute: 1,
                values: batchIds,
            }),
        },
        indices,
        primitiveType: Cesium.PrimitiveType.TRIANGLES,
        boundingSphere: new Cesium.BoundingSphere(Cesium.Cartesian3.ZERO, boundingRadius),
    });
}

function createTypedIndices(indices, vertexCount) {
    const IndexArray = vertexCount > 65535 ? Uint32Array : Uint16Array;

    return new IndexArray(indices);
}

function getGridKey(x, y) {
    return `${x}:${y}`;
}

function createWaterParams(overrides) {
    return {
        ...DEFAULT_WATER_PARAMS,
        deepColor: [...DEFAULT_WATER_PARAMS.deepColor],
        shallowColor: [...DEFAULT_WATER_PARAMS.shallowColor],
        foamColor: [...DEFAULT_WATER_PARAMS.foamColor],
        polygonPositions: DEFAULT_WATER_PARAMS.polygonPositions.map((position) => [
            ...position,
        ]),
        ...overrides,
    };
}

function createWaterUniforms() {
    return {
        u_time: 0,
        u_waveScale: DEFAULT_WATER_PARAMS.waveScale,
        u_waveHeight: DEFAULT_WATER_PARAMS.waveHeight,
        u_geometryWaveHeight: DEFAULT_WATER_PARAMS.geometryWaveHeight,
        u_choppy: DEFAULT_WATER_PARAMS.choppy,
        u_speed: DEFAULT_WATER_PARAMS.speed,
        u_foam: DEFAULT_WATER_PARAMS.foam,
        u_normalStrength: DEFAULT_WATER_PARAMS.normalStrength,
        u_fresnelPower: DEFAULT_WATER_PARAMS.fresnel,
        u_specularStrength: DEFAULT_WATER_PARAMS.specular,
        u_alpha: DEFAULT_WATER_PARAMS.alpha,
        u_deepColor: colorArrayToVec4(DEFAULT_WATER_PARAMS.deepColor, 1),
        u_shallowColor: colorArrayToVec4(DEFAULT_WATER_PARAMS.shallowColor, 1),
        u_foamColor: colorArrayToVec4(DEFAULT_WATER_PARAMS.foamColor, 1),
        u_vertexTime: 0,
        u_vertexWaveScale: DEFAULT_WATER_PARAMS.waveScale,
        u_vertexWaveHeight: DEFAULT_WATER_PARAMS.waveHeight,
        u_vertexGeometryWaveHeight: DEFAULT_WATER_PARAMS.geometryWaveHeight,
        u_vertexChoppy: DEFAULT_WATER_PARAMS.choppy,
        u_vertexSpeed: DEFAULT_WATER_PARAMS.speed,
        u_vertexNormalStrength: DEFAULT_WATER_PARAMS.normalStrength,
    };
}

function colorArrayToVec4(value, alpha) {
    return new Cesium.Cartesian4(
        value[0] / 255,
        value[1] / 255,
        value[2] / 255,
        alpha
    );
}

const viewer = createViewer();
const waterSurface = new DynamicWaterSurface({ viewer });

waterSurface.addToScene();
waterSurface.flyTo(1);
addWaterGui(waterSurface);
