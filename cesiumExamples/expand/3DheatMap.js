import {
  EllipsoidSurfaceAppearance,
  GeometryInstance,
  Material,
  Primitive,
  Rectangle,
  RectangleGeometry,
  SingleTileImageryProvider,
  ImageryLayer,
  ImageMaterialProperty,
  Entity,
} from "cesium";
import * as Cesium from "cesium";

/* ----------------------------------------------------heatMap类----------------------------------------------- */
var HeatmapConfig = {
  defaultRadius: 40,
  defaultRenderer: "canvas2d",
  defaultGradient: {
    0.25: "rgb(0,0,255)",
    0.55: "rgb(0,255,0)",
    0.85: "yellow",
    1.0: "rgb(255,0,0)",
  },
  defaultMaxOpacity: 1,
  defaultMinOpacity: 0,
  defaultBlur: 0.85,
  defaultXField: "x",
  defaultYField: "y",
  defaultValueField: "value",
  plugins: {},
};
var Store = (function StoreClosure() {
  var Store = function Store(config) {
    this._coordinator = {};
    this._data = [];
    this._radi = [];
    this._min = 0;
    this._max = 1;
    this._xField = config["xField"] || config.defaultXField;
    this._yField = config["yField"] || config.defaultYField;
    this._valueField = config["valueField"] || config.defaultValueField;

    if (config["radius"]) {
      this._cfgRadius = config["radius"];
    }
  };

  var defaultRadius = HeatmapConfig.defaultRadius;

  Store.prototype = {
    // when forceRender = false -> called from setData, omits renderall event
    _organiseData: function (dataPoint, forceRender) {
      var x = dataPoint[this._xField];
      var y = dataPoint[this._yField];
      var radi = this._radi;
      var store = this._data;
      var max = this._max;
      var min = this._min;
      var value = dataPoint[this._valueField] || 1;
      var radius = dataPoint.radius || this._cfgRadius || defaultRadius;

      if (!store[x]) {
        store[x] = [];
        radi[x] = [];
      }

      if (!store[x][y]) {
        store[x][y] = value;
        radi[x][y] = radius;
      } else {
        store[x][y] += value;
      }

      if (store[x][y] > max) {
        if (!forceRender) {
          this._max = store[x][y];
        } else {
          this.setDataMax(store[x][y]);
        }
        return false;
      } else {
        return {
          x: x,
          y: y,
          value: value,
          radius: radius,
          min: min,
          max: max,
        };
      }
    },
    _unOrganizeData: function () {
      var unorganizedData = [];
      var data = this._data;
      var radi = this._radi;

      for (var x in data) {
        for (var y in data[x]) {
          unorganizedData.push({
            x: x,
            y: y,
            radius: radi[x][y],
            value: data[x][y],
          });
        }
      }
      return {
        min: this._min,
        max: this._max,
        data: unorganizedData,
      };
    },
    _onExtremaChange: function () {
      this._coordinator.emit("extremachange", {
        min: this._min,
        max: this._max,
      });
    },
    addData: function () {
      if (arguments[0].length > 0) {
        var dataArr = arguments[0];
        var dataLen = dataArr.length;
        while (dataLen--) {
          this.addData.call(this, dataArr[dataLen]);
        }
      } else {
        // add to store
        var organisedEntry = this._organiseData(arguments[0], true);
        if (organisedEntry) {
          this._coordinator.emit("renderpartial", {
            min: this._min,
            max: this._max,
            data: [organisedEntry],
          });
        }
      }
      return this;
    },
    setData: function (data) {
      var dataPoints = data.data;
      var pointsLen = dataPoints.length;

      // reset data arrays
      this._data = [];
      this._radi = [];

      for (var i = 0; i < pointsLen; i++) {
        this._organiseData(dataPoints[i], false);
      }
      this._max = data.max;
      this._min = data.min || 0;

      this._onExtremaChange();
      this._coordinator.emit("renderall", this._getInternalData());
      return this;
    },
    removeData: function () {
      // TODO: implement
    },
    setDataMax: function (max) {
      this._max = max;
      this._onExtremaChange();
      this._coordinator.emit("renderall", this._getInternalData());
      return this;
    },
    setDataMin: function (min) {
      this._min = min;
      this._onExtremaChange();
      this._coordinator.emit("renderall", this._getInternalData());
      return this;
    },
    setCoordinator: function (coordinator) {
      this._coordinator = coordinator;
    },
    _getInternalData: function () {
      return {
        max: this._max,
        min: this._min,
        data: this._data,
        radi: this._radi,
      };
    },
    getData: function () {
      return this._unOrganizeData();
    } /*,

      TODO: rethink.

    getValueAt: function(point) {
      var value;
      var radius = 100;
      var x = point.x;
      var y = point.y;
      var data = this._data;

      if (data[x] && data[x][y]) {
        return data[x][y];
      } else {
        var values = [];
        // radial search for datapoints based on default radius
        for(var distance = 1; distance < radius; distance++) {
          var neighbors = distance * 2 +1;
          var startX = x - distance;
          var startY = y - distance;

          for(var i = 0; i < neighbors; i++) {
            for (var o = 0; o < neighbors; o++) {
              if ((i == 0 || i == neighbors-1) || (o == 0 || o == neighbors-1)) {
                if (data[startY+i] && data[startY+i][startX+o]) {
                  values.push(data[startY+i][startX+o]);
                }
              } else {
                continue;
              } 
            }
          }
        }
        if (values.length > 0) {
          return Math.max.apply(Math, values);
        }
      }
      return false;
    }*/,
  };

  return Store;
})();

var Canvas2dRenderer = (function Canvas2dRendererClosure() {
  var _getColorPalette = function (config) {
    var gradientConfig = config.gradient || config.defaultGradient;
    var paletteCanvas = document.createElement("canvas");
    var paletteCtx = paletteCanvas.getContext("2d");

    paletteCanvas.width = 256;
    paletteCanvas.height = 1;

    var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
    for (var key in gradientConfig) {
      gradient.addColorStop(key, gradientConfig[key]);
    }

    paletteCtx.fillStyle = gradient;
    paletteCtx.fillRect(0, 0, 256, 1);

    return paletteCtx.getImageData(0, 0, 256, 1).data;
  };

  var _getPointTemplate = function (radius, blurFactor) {
    var tplCanvas = document.createElement("canvas");
    var tplCtx = tplCanvas.getContext("2d");
    var x = radius;
    var y = radius;
    tplCanvas.width = tplCanvas.height = radius * 2;

    if (blurFactor == 1) {
      tplCtx.beginPath();
      tplCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
      tplCtx.fillStyle = "rgba(0,0,0,1)";
      tplCtx.fill();
    } else {
      var gradient = tplCtx.createRadialGradient(
        x,
        y,
        radius * blurFactor,
        x,
        y,
        radius
      );
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      tplCtx.fillStyle = gradient;
      tplCtx.fillRect(0, 0, 2 * radius, 2 * radius);
    }

    return tplCanvas;
  };

  var _prepareData = function (data) {
    var renderData = [];
    var min = data.min;
    var max = data.max;
    var radi = data.radi;
    var data = data.data;

    var xValues = Object.keys(data);
    var xValuesLen = xValues.length;

    while (xValuesLen--) {
      var xValue = xValues[xValuesLen];
      var yValues = Object.keys(data[xValue]);
      var yValuesLen = yValues.length;
      while (yValuesLen--) {
        var yValue = yValues[yValuesLen];
        var value = data[xValue][yValue];
        var radius = radi[xValue][yValue];
        renderData.push({
          x: xValue,
          y: yValue,
          value: value,
          radius: radius,
        });
      }
    }

    return {
      min: min,
      max: max,
      data: renderData,
    };
  };

  function Canvas2dRenderer(config) {
    var container = config.container;
    var shadowCanvas = (this.shadowCanvas = document.createElement("canvas"));
    var canvas = (this.canvas =
      config.canvas || document.createElement("canvas"));
    var renderBoundaries = (this._renderBoundaries = [10000, 10000, 0, 0]);

    var computed = getComputedStyle(config.container) || {};

    canvas.className = "heatmap-canvas";

    this._width =
      canvas.width =
      shadowCanvas.width =
        +computed.width.replace(/px/, "");
    this._height =
      canvas.height =
      shadowCanvas.height =
        +computed.height.replace(/px/, "");

    this.shadowCtx = shadowCanvas.getContext("2d");
    this.ctx = canvas.getContext("2d");

    // @TODO:
    // conditional wrapper

    canvas.style.cssText = shadowCanvas.style.cssText =
      "position:absolute;left:0;top:0;";

    container.style.position = "relative";
    container.appendChild(canvas);

    this._palette = _getColorPalette(config);
    this._templates = {};

    this._setStyles(config);
  }

  Canvas2dRenderer.prototype = {
    renderPartial: function (data) {
      this._drawAlpha(data);
      this._colorize();
    },
    renderAll: function (data) {
      // reset render boundaries
      this._clear();
      this._drawAlpha(_prepareData(data));
      this._colorize();
    },
    _updateGradient: function (config) {
      this._palette = _getColorPalette(config);
    },
    updateConfig: function (config) {
      if (config["gradient"]) {
        this._updateGradient(config);
      }
      this._setStyles(config);
    },
    setDimensions: function (width, height) {
      this._width = width;
      this._height = height;
      this.canvas.width = this.shadowCanvas.width = width;
      this.canvas.height = this.shadowCanvas.height = height;
    },
    _clear: function () {
      this.shadowCtx.clearRect(0, 0, this._width, this._height);
      this.ctx.clearRect(0, 0, this._width, this._height);
    },
    _setStyles: function (config) {
      this._blur = config.blur == 0 ? 0 : config.blur || config.defaultBlur;

      if (config.backgroundColor) {
        this.canvas.style.backgroundColor = config.backgroundColor;
      }

      this._opacity = (config.opacity || 0) * 255;
      this._maxOpacity = (config.maxOpacity || config.defaultMaxOpacity) * 255;
      this._minOpacity = (config.minOpacity || config.defaultMinOpacity) * 255;
      this._useGradientOpacity = !!config.useGradientOpacity;
    },
    _drawAlpha: function (data) {
      var min = (this._min = data.min);
      var max = (this._max = data.max);
      var data = data.data || [];
      var dataLen = data.length;
      // on a point basis?
      var blur = 1 - this._blur;

      while (dataLen--) {
        var point = data[dataLen];

        var x = point.x;
        var y = point.y;
        var radius = point.radius;
        // if value is bigger than max
        // use max as value
        var value = Math.min(point.value, max);
        var rectX = x - radius;
        var rectY = y - radius;
        var shadowCtx = this.shadowCtx;

        var tpl;
        if (!this._templates[radius]) {
          this._templates[radius] = tpl = _getPointTemplate(radius, blur);
        } else {
          tpl = this._templates[radius];
        }
        // value from minimum / value range
        // => [0, 1]
        shadowCtx.globalAlpha = (value - min) / (max - min);

        shadowCtx.drawImage(tpl, rectX, rectY);

        // update renderBoundaries
        if (rectX < this._renderBoundaries[0]) {
          this._renderBoundaries[0] = rectX;
        }
        if (rectY < this._renderBoundaries[1]) {
          this._renderBoundaries[1] = rectY;
        }
        if (rectX + 2 * radius > this._renderBoundaries[2]) {
          this._renderBoundaries[2] = rectX + 2 * radius;
        }
        if (rectY + 2 * radius > this._renderBoundaries[3]) {
          this._renderBoundaries[3] = rectY + 2 * radius;
        }
      }
    },
    _colorize: function () {
      var x = this._renderBoundaries[0];
      var y = this._renderBoundaries[1];
      var width = this._renderBoundaries[2] - x;
      var height = this._renderBoundaries[3] - y;
      var maxWidth = this._width;
      var maxHeight = this._height;
      var opacity = this._opacity;
      var maxOpacity = this._maxOpacity;
      var minOpacity = this._minOpacity;
      var useGradientOpacity = this._useGradientOpacity;

      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
      if (x + width > maxWidth) {
        width = maxWidth - x;
      }
      if (y + height > maxHeight) {
        height = maxHeight - y;
      }

      var img = this.shadowCtx.getImageData(x, y, width, height);
      var imgData = img.data;
      var len = imgData.length;
      var palette = this._palette;

      for (var i = 3; i < len; i += 4) {
        var alpha = imgData[i];
        var offset = alpha * 4;

        if (!offset) {
          continue;
        }

        var finalAlpha;
        if (opacity > 0) {
          finalAlpha = opacity;
        } else {
          if (alpha < maxOpacity) {
            if (alpha < minOpacity) {
              finalAlpha = minOpacity;
            } else {
              finalAlpha = alpha;
            }
          } else {
            finalAlpha = maxOpacity;
          }
        }

        imgData[i - 3] = palette[offset];
        imgData[i - 2] = palette[offset + 1];
        imgData[i - 1] = palette[offset + 2];
        imgData[i] = useGradientOpacity ? palette[offset + 3] : finalAlpha;
      }
      Object.defineProperty(img, "data", {
        value: imgData,
        writable: true,
        configurable: true,
        enumerable: true,
      });
      // img.data = imgData;
      this.ctx.putImageData(img, x, y);

      this._renderBoundaries = [1000, 1000, 0, 0];
    },
    getValueAt: function (point) {
      var value;
      var shadowCtx = this.shadowCtx;
      var img = shadowCtx.getImageData(point.x, point.y, 1, 1);
      var data = img.data[3];
      var max = this._max;
      var min = this._min;

      value = (Math.abs(max - min) * (data / 255)) >> 0;

      return value;
    },
    getDataURL: function () {
      return this.canvas.toDataURL();
    },
  };

  return Canvas2dRenderer;
})();

var Renderer = (function RendererClosure() {
  var rendererFn = false;

  if (HeatmapConfig["defaultRenderer"] === "canvas2d") {
    rendererFn = Canvas2dRenderer;
  }

  return rendererFn;
})();

var Util = {
  merge: function () {
    var merged = {};
    var argsLen = arguments.length;
    for (var i = 0; i < argsLen; i++) {
      var obj = arguments[i];
      for (var key in obj) {
        merged[key] = obj[key];
      }
    }
    return merged;
  },
};
// Heatmap Constructor
var Heatmap = (function HeatmapClosure() {
  var Coordinator = (function CoordinatorClosure() {
    function Coordinator() {
      this.cStore = {};
    }

    Coordinator.prototype = {
      on: function (evtName, callback, scope) {
        var cStore = this.cStore;

        if (!cStore[evtName]) {
          cStore[evtName] = [];
        }
        cStore[evtName].push(function (data) {
          return callback.call(scope, data);
        });
      },
      emit: function (evtName, data) {
        var cStore = this.cStore;
        if (cStore[evtName]) {
          var len = cStore[evtName].length;
          for (var i = 0; i < len; i++) {
            var callback = cStore[evtName][i];
            callback(data);
          }
        }
      },
    };

    return Coordinator;
  })();

  var _connect = function (scope) {
    var renderer = scope._renderer;
    var coordinator = scope._coordinator;
    var store = scope._store;

    coordinator.on("renderpartial", renderer.renderPartial, renderer);
    coordinator.on("renderall", renderer.renderAll, renderer);
    coordinator.on("extremachange", function (data) {
      scope._config.onExtremaChange &&
        scope._config.onExtremaChange({
          min: data.min,
          max: data.max,
          gradient:
            scope._config["gradient"] || scope._config["defaultGradient"],
        });
    });
    store.setCoordinator(coordinator);
  };

  function Heatmap() {
    var config = (this._config = Util.merge(HeatmapConfig, arguments[0] || {}));
    this._coordinator = new Coordinator();
    if (config["plugin"]) {
      var pluginToLoad = config["plugin"];
      if (!HeatmapConfig.plugins[pluginToLoad]) {
        throw new Error(
          "Plugin '" +
            pluginToLoad +
            "' not found. Maybe it was not registered."
        );
      } else {
        var plugin = HeatmapConfig.plugins[pluginToLoad];
        // set plugin renderer and store
        this._renderer = new plugin.renderer(config);
        this._store = new plugin.store(config);
      }
    } else {
      this._renderer = new Renderer(config);
      this._store = new Store(config);
    }
    _connect(this);
  }

  // @TODO:
  // add API documentation
  Heatmap.prototype = {
    addData: function () {
      this._store.addData.apply(this._store, arguments);
      return this;
    },
    removeData: function () {
      this._store.removeData &&
        this._store.removeData.apply(this._store, arguments);
      return this;
    },
    setData: function () {
      this._store.setData.apply(this._store, arguments);
      return this;
    },
    setDataMax: function () {
      this._store.setDataMax.apply(this._store, arguments);
      return this;
    },
    setDataMin: function () {
      this._store.setDataMin.apply(this._store, arguments);
      return this;
    },
    configure: function (config) {
      this._config = Util.merge(this._config, config);
      this._renderer.updateConfig(this._config);
      this._coordinator.emit("renderall", this._store._getInternalData());
      return this;
    },
    repaint: function () {
      this._coordinator.emit("renderall", this._store._getInternalData());
      return this;
    },
    getData: function () {
      return this._store.getData();
    },
    getDataURL: function () {
      return this._renderer.getDataURL();
    },
    getValueAt: function (point) {
      if (this._store.getValueAt) {
        return this._store.getValueAt(point);
      } else if (this._renderer.getValueAt) {
        return this._renderer.getValueAt(point);
      } else {
        return null;
      }
    },
  };

  return Heatmap;
})();

var h337 = {
  create: function (config) {
    return new Heatmap(config);
  },
  register: function (pluginKey, plugin) {
    HeatmapConfig.plugins[pluginKey] = plugin;
  },
};
/* ----------------------------------------------------heatMap类--------------------------------------------------- */

/**
 * 创建三维热力图
 * @param {Cesium.Viewer} viewer 地图viewer对象
 * @param {Object} options 基础参数
 * @param {Array} options.dataPoints 热力值数组
 * @param {Array} options.radius 热力点半径
 * @param {Array} options.baseElevation 最低高度
 * @param {Array} options.colorGradient 颜色配置
 */
function create3DHeatmap(viewer, options = {}) {
  const heatmapState = {
    viewer,
    options,
    dataPoints: options.dataPoints || [],
    containerElement: undefined,
    instanceId: Number(
      `${new Date().getTime()}${Number(Math.random() * 1000).toFixed(0)}`
    ),
    canvasWidth: 200,
    boundingBox: undefined, // 四角坐标
    boundingRect: {}, // 经纬度范围
    xAxis: undefined, // x 轴
    yAxis: undefined, // y 轴
    xAxisLength: 0, // x轴长度
    yAxisLength: 0, // y轴长度
    baseElevation: options.baseElevation || 0,
    heatmapPrimitive: undefined,
    positionHierarchy: [],
    heatmapInstance: null,
  };

  if (!heatmapState.dataPoints || heatmapState.dataPoints.length < 2) {
    console.log("热力图点位不得少于3个！");
    return;
  }

  createHeatmapContainer(heatmapState);

  const heatmapConfig = {
    container: document.getElementById(`heatmap-${heatmapState.instanceId}`),
    radius: options.radius || 20,
    maxOpacity: 0.7,
    minOpacity: 0,
    blur: 0.75,
    gradient: options.colorGradient || {
      ".1": "blue",
      ".5": "yellow",
      ".7": "red",
      ".99": "white",
    },
  };

  heatmapState.primitiveType = options.primitiveType || "TRIANGLES";
  heatmapState.heatmapInstance = h337.create(heatmapConfig);

  initializeHeatmap(heatmapState);

  return {
    destroy: () => destroyHeatmap(heatmapState),
    heatmapState,
  };
}

function initializeHeatmap(heatmapState) {
  for (const [index, dataPoint] of heatmapState.dataPoints.entries()) {
    const cartesianPosition = Cesium.Cartesian3.fromDegrees(
      dataPoint.lnglat[0],
      dataPoint.lnglat[1],
      0
    );
    heatmapState.positionHierarchy.push(cartesianPosition);
  }

  computeBoundingBox(heatmapState.positionHierarchy, heatmapState);

  const heatmapPoints = heatmapState.positionHierarchy.map(
    (position, index) => {
      const normalizedCoords = computeNormalizedCoordinates(
        position,
        heatmapState
      );
      return {
        x: normalizedCoords.x,
        y: normalizedCoords.y,
        value: heatmapState.dataPoints[index].value,
      };
    }
  );

  heatmapState.heatmapInstance.addData(heatmapPoints);

  const geometryInstance = new Cesium.GeometryInstance({
    geometry: createHeatmapGeometry(heatmapState),
  });

  heatmapState.heatmapPrimitive = heatmapState.viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: geometryInstance,
      appearance: new Cesium.MaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: "Image",
            uniforms: {
              image: heatmapState.heatmapInstance.getDataURL(),
            },
          },
        }),
        vertexShaderSource: `
        in vec3 position3DHigh;
        in vec3 position3DLow;
        in vec2 st;
        in float batchId;
        uniform sampler2D image_0; 
        out vec3 v_positionEC;
        in vec3 normal;
        out vec3 v_normalEC;
        out vec2 v_st; 
        void main(){
            vec4 p = czm_computePosition();
           
            v_normalEC = czm_normal * normal;   
            v_positionEC = (czm_modelViewRelativeToEye * p).xyz;
            vec4 positionWC=czm_inverseModelView* vec4(v_positionEC,1.0);
            v_st = st; 
            vec4 color = texture(image_0, v_st); 
            vec3 upDir = normalize(positionWC.xyz); 
            p += vec4(color.r *upDir * 1000., 0.0); 
            gl_Position = czm_modelViewProjectionRelativeToEye * p; 
        }`,
        translucent: true,
        flat: true,
      }),
      asynchronous: false,
    })
  );
  heatmapState.heatmapPrimitive.id = "heatmap3d";
}

function destroyHeatmap(heatmapState) {
  const containerElement = document.getElementById(
    `heatmap-${heatmapState.instanceId}`
  );
  if (containerElement) containerElement.remove();
  if (heatmapState.heatmapPrimitive) {
    heatmapState.viewer.scene.primitives.remove(heatmapState.heatmapPrimitive);
    heatmapState.heatmapPrimitive = undefined;
  }
}

function computeNormalizedCoordinates(position, heatmapState) {
  if (!position) return;
  const cartographic = Cesium.Cartographic.fromCartesian(position.clone());
  cartographic.height = 0;
  position = Cesium.Cartographic.toCartesian(cartographic.clone());

  const originVector = Cesium.Cartesian3.subtract(
    position.clone(),
    heatmapState.boundingBox.leftTop,
    new Cesium.Cartesian3()
  );
  const xOffset = Cesium.Cartesian3.dot(originVector, heatmapState.xAxis);
  const yOffset = Cesium.Cartesian3.dot(originVector, heatmapState.yAxis);
  return {
    x: Number(
      (xOffset / heatmapState.xAxisLength) * heatmapState.canvasWidth
    ).toFixed(0),
    y: Number(
      (yOffset / heatmapState.yAxisLength) * heatmapState.canvasWidth
    ).toFixed(0),
  };
}

function cartesiansToLnglats(cartesians, viewer) {
  if (!cartesians || cartesians.length < 1) return;
  viewer = viewer || window.viewer;
  if (!viewer) {
    console.log("请传入viewer对象");
    return;
  }
  var coordinates = [];
  for (var i = 0; i < cartesians.length; i++) {
    coordinates.push(cartesianToLnglat(cartesians[i], viewer));
  }
  return coordinates;
}

function cartesianToLnglat(cartesian, viewer) {
  if (!cartesian) return [];
  viewer = viewer || window.viewer;
  var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
  var latitude = Cesium.Math.toDegrees(cartographic.latitude);
  var longitude = Cesium.Math.toDegrees(cartographic.longitude);
  var height = cartographic.height;
  return [longitude, latitude, height];
}

function computeBoundingBox(positions, heatmapState) {
  if (!positions) return;
  const boundingSphere = Cesium.BoundingSphere.fromPoints(
    positions,
    new Cesium.BoundingSphere()
  );
  const centerPoint = boundingSphere.center;
  const sphereRadius = boundingSphere.radius;

  const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    centerPoint.clone()
  );
  const modelMatrixInverse = Cesium.Matrix4.inverse(
    modelMatrix.clone(),
    new Cesium.Matrix4()
  );
  const yAxisVector = new Cesium.Cartesian3(0, 1, 0);

  const boundingVertices = [];
  for (let angle = 45; angle <= 360; angle += 90) {
    const rotationMatrix = Cesium.Matrix3.fromRotationZ(
      Cesium.Math.toRadians(angle),
      new Cesium.Matrix3()
    );
    let rotatedYAxis = Cesium.Matrix3.multiplyByVector(
      rotationMatrix,
      yAxisVector,
      new Cesium.Cartesian3()
    );
    rotatedYAxis = Cesium.Cartesian3.normalize(
      rotatedYAxis,
      new Cesium.Cartesian3()
    );
    const scaledVector = Cesium.Cartesian3.multiplyByScalar(
      rotatedYAxis,
      sphereRadius,
      new Cesium.Cartesian3()
    );
    const vertex = Cesium.Matrix4.multiplyByPoint(
      modelMatrix,
      scaledVector.clone(),
      new Cesium.Cartesian3()
    );

    boundingVertices.push(vertex);
  }

  const coordinates = cartesiansToLnglats(
    boundingVertices,
    heatmapState.viewer
  );
  let minLatitude = Number.MAX_VALUE,
    maxLatitude = Number.MIN_VALUE,
    minLongitude = Number.MAX_VALUE,
    maxLongitude = Number.MIN_VALUE;
  const vertexCount = boundingVertices.length;

  coordinates.forEach((coordinate) => {
    if (coordinate[0] < minLongitude) minLongitude = coordinate[0];
    if (coordinate[0] > maxLongitude) maxLongitude = coordinate[0];
    if (coordinate[1] < minLatitude) minLatitude = coordinate[1];
    if (coordinate[1] > maxLatitude) maxLatitude = coordinate[1];
  });

  const latitudeRange = maxLatitude - minLatitude;
  const longitudeRange = maxLongitude - minLongitude;

  heatmapState.boundingRect = {
    minLatitude: minLatitude - latitudeRange / vertexCount,
    maxLatitude: maxLatitude + latitudeRange / vertexCount,
    minLongitude: minLongitude - longitudeRange / vertexCount,
    maxLongitude: maxLongitude + longitudeRange / vertexCount,
  };

  heatmapState.boundingBox = {
    leftTop: Cesium.Cartesian3.fromDegrees(
      heatmapState.boundingRect.minLongitude,
      heatmapState.boundingRect.maxLatitude
    ),
    leftBottom: Cesium.Cartesian3.fromDegrees(
      heatmapState.boundingRect.minLongitude,
      heatmapState.boundingRect.minLatitude
    ),
    rightTop: Cesium.Cartesian3.fromDegrees(
      heatmapState.boundingRect.maxLongitude,
      heatmapState.boundingRect.maxLatitude
    ),
    rightBottom: Cesium.Cartesian3.fromDegrees(
      heatmapState.boundingRect.maxLongitude,
      heatmapState.boundingRect.minLatitude
    ),
  };

  heatmapState.xAxis = Cesium.Cartesian3.subtract(
    heatmapState.boundingBox.rightTop,
    heatmapState.boundingBox.leftTop,
    new Cesium.Cartesian3()
  );
  heatmapState.xAxis = Cesium.Cartesian3.normalize(
    heatmapState.xAxis,
    new Cesium.Cartesian3()
  );
  heatmapState.yAxis = Cesium.Cartesian3.subtract(
    heatmapState.boundingBox.leftBottom,
    heatmapState.boundingBox.leftTop,
    new Cesium.Cartesian3()
  );
  heatmapState.yAxis = Cesium.Cartesian3.normalize(
    heatmapState.yAxis,
    new Cesium.Cartesian3()
  );
  heatmapState.xAxisLength = Cesium.Cartesian3.distance(
    heatmapState.boundingBox.rightTop,
    heatmapState.boundingBox.leftTop
  );
  heatmapState.yAxisLength = Cesium.Cartesian3.distance(
    heatmapState.boundingBox.leftBottom,
    heatmapState.boundingBox.leftTop
  );
}

function createHeatmapGeometry(heatmapState) {
  const meshData = generateMeshData(heatmapState);
  const geometry = new Cesium.Geometry({
    attributes: new Cesium.GeometryAttributes({
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: meshData.positions,
      }),
      st: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.FLOAT,
        componentsPerAttribute: 2,
        values: new Float32Array(meshData.textureCoords),
      }),
    }),
    indices: new Uint16Array(meshData.indices),
    primitiveType: Cesium.PrimitiveType[heatmapState.primitiveType],
    boundingSphere: Cesium.BoundingSphere.fromVertices(meshData.positions),
  });
  return geometry;
}

function generateMeshData(heatmapState) {
  const gridWidth = heatmapState.canvasWidth || 200;
  const gridHeight = heatmapState.canvasWidth || 200;
  const { maxLongitude, maxLatitude, minLongitude, minLatitude } =
    heatmapState.boundingRect;

  const longitudeStep = (maxLongitude - minLongitude) / gridWidth;
  const latitudeStep = (maxLatitude - minLatitude) / gridHeight;
  const positions = [];
  const textureCoords = [];
  const indices = [];

  for (let i = 0; i < gridWidth; i++) {
    const currentLongitude = minLongitude + longitudeStep * i;

    for (let j = 0; j < gridHeight; j++) {
      const currentLatitude = minLatitude + latitudeStep * j;
      const heatValue = heatmapState.heatmapInstance.getValueAt({
        x: i,
        y: j,
      });
      const cartesian3 = Cesium.Cartesian3.fromDegrees(
        currentLongitude,
        currentLatitude,
        heatmapState.baseElevation + heatValue
      );
      positions.push(cartesian3.x, cartesian3.y, cartesian3.z);
      textureCoords.push(i / gridWidth, j / gridHeight);
      if (j !== gridHeight - 1 && i !== gridWidth - 1) {
        indices.push(
          i * gridHeight + j,
          i * gridHeight + j + 1,
          (i + 1) * gridHeight + j
        );
        indices.push(
          (i + 1) * gridHeight + j,
          (i + 1) * gridHeight + j + 1,
          i * gridHeight + j + 1
        );
      }
    }
  }

  return {
    positions,
    textureCoords,
    indices,
  };
}

function createHeatmapContainer(heatmapState) {
  heatmapState.containerElement = window.document.createElement("div");
  heatmapState.containerElement.id = `heatmap-${heatmapState.instanceId}`;
  heatmapState.containerElement.className = `heatmap`;
  heatmapState.containerElement.style.width = `${heatmapState.canvasWidth}px`;
  heatmapState.containerElement.style.height = `${heatmapState.canvasWidth}px`;
  heatmapState.containerElement.style.position = "absolute";
  heatmapState.containerElement.style.display = "none";
  const mapContainer = window.document.getElementById(
    heatmapState.viewer.container.id
  );
  mapContainer.appendChild(heatmapState.containerElement);
}

const DOM = document.getElementById("box");

const viewer = new Cesium.Viewer(DOM, {
  animation: false, //是否创建动画小器件，左下角仪表

  baseLayerPicker: false, //是否显示图层选择器，右上角图层选择按钮

  baseLayer: Cesium.ImageryLayer.fromProviderAsync(
    Cesium.ArcGisMapServerImageryProvider.fromUrl(
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
    )
  ),

  fullscreenButton: false, //是否显示全屏按钮，右下角全屏选择按钮

  timeline: false, //是否显示时间轴

  infoBox: false, //是否显示信息框
});

viewer._cesiumWidget._creditContainer.style.display = "none";

// 模拟数值
const points = new Array(50).fill("").map(() => {
  return {
    lnglat: [
      116.46 + Math.random() * 0.1 * (Math.random() > 0.5 ? 1 : -1),
      39.92 + Math.random() * 0.1 * (Math.random() > 0.5 ? 1 : -1),
    ],

    value: 1000 * Math.random(),
  };
});
// 创建热力图
create3DHeatmap(viewer, {
  dataPoints: points,
  radius: 15,
  baseElevation: 0,
  primitiveType: "TRIANGLES",
  colorGradient: {
    ".3": "blue",
    ".5": "green",
    ".7": "yellow",
    ".95": "red",
  },
});
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(116.46, 39.92, 100000),
  orientation: {},
  duration: 3,
});
