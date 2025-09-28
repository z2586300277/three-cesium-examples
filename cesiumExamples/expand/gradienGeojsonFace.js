import * as Cesium from "cesium";

/**
 * 自定义材质类型名称
 * @const {string}
 */
const MATERIAL_TYPE = "Custom";

/**
 * 自定义材质属性类
 * @class
 */
class CustomMaterialProperty {
  /**
   * @param {Object=} options 配置项
   */
  constructor(options = {}) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;

    this.color = options.color || Cesium.Color.RED;
    this.duration = options.duration || 2000;
    this._time = performance.now();
  }

  /**
   * @return {boolean}
   */
  get isConstant() {
    return false;
  }

  /**
   * @return {Cesium.Event}
   */
  get definitionChanged() {
    return this._definitionChanged;
  }

  /**
   * @return {string}
   */
  getType() {
    return MATERIAL_TYPE;
  }

  /**
   * @param {Cesium.JulianDate} time
   * @param {Object=} result
   * @return {Object}
   */
  getValue(time, result = {}) {
    result.color = Cesium.Property.getValueOrUndefined(this.color, time);
    result.time =
      ((performance.now() - this._time) % this.duration) / this.duration;
    return result;
  }

  /**
   * @param {CustomMaterialProperty} other
   * @return {boolean}
   */
  equals(other) {
    return (
      this === other ||
      (other instanceof CustomMaterialProperty && this._color === other._color)
    );
  }
}

// 定义颜色属性
Object.defineProperty(
  CustomMaterialProperty.prototype,
  "color",
  Cesium.createPropertyDescriptor("color")
);

// 注册自定义材质
Cesium.Material._materialCache.addMaterial(MATERIAL_TYPE, {
  fabric: {
    type: MATERIAL_TYPE,
    uniforms: {
      color: new Cesium.Color(1, 1, 0, 1),
      time: 1,
      spacing: 40,
      width: 1,
    },
    source: `
      uniform vec4 color;
      czm_material czm_getMaterial(czm_materialInput materialInput) {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        float alpha = distance(st, vec2(.5));
        material.alpha = color.a * alpha * 1.5;
        material.diffuse = color.rgb * 1.3;
        return material;
      }`,
  },
  translucent: () => true,
});

/**
 * 初始化 viewer
 * @type {Cesium.Viewer}
 */
const viewer = new Cesium.Viewer("box", {
  animation: false,
  baseLayerPicker: false,
  baseLayer: Cesium.ImageryLayer.fromProviderAsync(
    Cesium.ArcGisMapServerImageryProvider.fromUrl(
      "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"
    )
  ),
  fullscreenButton: false,
  timeline: false,
  infoBox: false,
});

/**
 * 预定义的颜色配置
 * @type {Array<Array<number>>}
 */
const COLOR_CONFIGS = [
  [15, 176, 255],
  [18, 76, 154],
  [64, 196, 228],
  [66, 178, 190],
  [51, 176, 204],
  [140, 183, 229],
  [0, 244, 188],
  [19, 159, 240],
];

/**
 * 添加材质到地图
 * @async
 */
async function addMaterial() {
  const dataSource = await Cesium.GeoJsonDataSource.load(
    "https://z2586300277.github.io/three-editor/dist/files/font/guangdong.json"
  );

  const entities = dataSource.entities.values;
  const colors = COLOR_CONFIGS.map(
    ([r, g, b]) => new Cesium.Color(r / 255, g / 255, b / 255, 1)
  );

  entities.forEach((entity, index) => {
    entity.polygon.extrudedHeight = 10000;
    entity.polygon.outline = false;
    entity.polygon.material = new CustomMaterialProperty({
      color: colors[index % colors.length],
    });
  });

  viewer.dataSources.add(dataSource);

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(113.280637, 23.125178, 20000),
    orientation: {},
    duration: 3,
  });
}

addMaterial();
