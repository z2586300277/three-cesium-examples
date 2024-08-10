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
    Entity
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

class setCesiumHeatmap {
    constructor(viewer, options) {
        this.viewer = viewer;
        this.initOptions = { ...options };
        if (this.initOptions?.points) {
            const bounds = this.getBounds(this.initOptions.points);
            this.bounds = bounds;
            const { container, width, height } = this.createContainer(bounds);
            this.element = container;
            const datas = [];
            const values = [];
            for (let i in this.initOptions.points) {
                const point = this.initOptions.points[i];
                const x = ((point.x - bounds[0]) / (bounds[2] - bounds[0])) * width; //屏幕坐标x
                const y = ((bounds[3] - point.y) / (bounds[3] - bounds[1])) * height; //屏幕坐标y
                const dataPoint = {
                    x: x,
                    y: y,
                    value: point.value,
                };
                if (typeof point.value === "number") values.push(point.value);
                datas.push(dataPoint);
            }

            //数据的最大值和最小值
            let _min = Math.min(...values),
                _max = Math.max(...values);
            if (this.initOptions?.heatmapDataOptions) {
                const { min, max } = this.initOptions.heatmapDataOptions;
                if (typeof min === "number") {
                    _min = min;
                }
                if (typeof max === "number") {
                    _max = max;
                }
            }
            this.heatmapDataOptions = { min: _min, max: _max };

            const data = {
                max: _max,
                min: _min,
                data: datas,
            };

            const defaultOptions = {
                maxOpacity: 0.9,
                // radius: minRadius,
                // minimum opacity. any value > 0 will produce
                // no transparent gradient transition
                minOpacity: 0.1,
                gradient: {
                    // enter n keys between 0 and 1 here
                    // for gradient color customization
                    ".3": "blue",
                    ".5": "green",
                    ".7": "yellow",
                    ".95": "red",
                },
            };
            const _options = this.initOptions.heatmapOptions
                ? { ...defaultOptions, ...this.initOptions.heatmapOptions }
                : defaultOptions;

            //初始化半径
            if (this.heatmapOptions?.radius) {
                this.initRadius = this.heatmapOptions.radius;
            }

            this.heatmapOptions = { ..._options };
            const options = {
                ..._options,
                container,
            };
            this.heatmap = h337.create(options);
            this.heatmap.setData(data);
            this.createLayer();

            if (!this.initOptions.noLisenerCamera) {
                this.addLisener();
            }

            if (this.initOptions.zoomToLayer && bounds) {
                this.viewer.camera.flyTo({
                    destination: Rectangle.fromDegrees(...bounds),
                });
            }

            if (this.initOptions?.viewToLayer) {
                this.viewer.camera.setView({
                    destination: Rectangle.fromDegrees(...bounds),
                });
            }
        }
    }

    /**
     * 设置数据的最大最小值
     * @param dataOption
     */
    updateHeatMapMaxMin(dataOption) {
        const { min, max } = dataOption;
        if (this.heatmap) {
            if (typeof min === "number") {
                this.heatmap.setDataMin(min);
                if (this.heatmapDataOptions) this.heatmapDataOptions.min = min;
            }
            if (typeof max === "number") {
                this.heatmap.setDataMax(max);
                if (this.heatmapDataOptions) this.heatmapDataOptions.max = max;
            }
        }
        this.updateLayer();
    }

    /**
     * 更新热度图配置
     * @param options
     */
    updateHeatmap(options) {
        const { heatmapOptions } = this;
        this.heatmap.configure({ ...heatmapOptions, ...options });
        this.updateLayer();
    }

    /**
     * 更新半径
     * @param radius
     */
    updateRadius(radius) {
        const { heatmapOptions } = this;
        const currentData = this.heatmap.getData();
        if (currentData?.data) {
            for (let i in currentData.data) {
                const data = currentData.data[i];
                data.radius = radius;
            }
        }
        this.heatmap.setData(currentData);
        this.heatmapOptions = { ...heatmapOptions, ...{ radius } };
        this.updateLayer();
        if (this.initOptions?.onRadiusChange) {
            this.initOptions.onRadiusChange(radius);
        }
    }

    /**
     * 移除
     */
    remove() {
        if (this.element) {
            document.body.removeChild(this.element);
            this.element = undefined;
            if (this.provider instanceof ImageryLayer) {
                if (this.provider) this.viewer.imageryLayers.remove(this.provider);
                this.createSingleTileImageryLayer();
            } else if (this.provider instanceof Primitive) {
                this.viewer.scene.primitives.remove(this.provider);
            } else if (this.provider instanceof Entity) {
                this.viewer.entities.remove(this.provider);
            }
            if (this.cameraMoveEnd) {
                this.viewer.camera.moveEnd.removeEventListener(this.cameraMoveEnd);
                this.cameraMoveEnd = undefined;
            }
        }
    }

    createLayer() {
        if (this.initOptions.renderType === "primitive") {
            this.createPrimitive();
        } else if (this.initOptions.renderType === "imagery") {
            this.createSingleTileImageryLayer();
        } else {
            this.createEntity();
        }
    }

    createPrimitive() {
        const url = this.heatmap.getDataURL();
        this.provider = this.viewer.scene.primitives.add(
            new Primitive({
                geometryInstances: new GeometryInstance({
                    geometry: new RectangleGeometry({
                        rectangle: Rectangle.fromDegrees(...this.bounds),
                        vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT,
                    }),
                }),
                appearance: new EllipsoidSurfaceAppearance({
                    aboveGround: false,
                }),
                show: true,
            })
        );
        if (this.provider) {
            this.provider.appearance.material = new Material({
                fabric: {
                    type: "Image",
                    uniforms: {
                        image: url,
                    },
                },
            });
        }
    }

    createSingleTileImageryLayer() {
        const url = this.heatmap.getDataURL();
        this.provider = this.viewer.imageryLayers.addImageryProvider(
            new SingleTileImageryProvider({
                url: url,
                rectangle: Rectangle.fromDegrees(...this.bounds),
            })
        );
    }

    getImageMaterialProperty() {
        const url = this.heatmap.getDataURL();
        const material = new ImageMaterialProperty({
            image: url,
        });
        return material;
    }

    createEntity() {
        this.provider = this.viewer.entities.add({
            show: true,
            rectangle: {
                coordinates: Rectangle.fromDegrees(...this.bounds),
                material: this.getImageMaterialProperty(),
            },
        });
    }

    updateLayer() {
        const src = this.heatmap.getDataURL();
        if (this.provider instanceof ImageryLayer) {
            if (this.provider) this.viewer.imageryLayers.remove(this.provider);
            this.createSingleTileImageryLayer();
        } else if (this.provider instanceof Primitive) {
            this.provider.appearance.material.uniforms.image = src;
        } else if (this.provider instanceof Entity) {
            if (this.provider.rectangle)
                this.provider.rectangle.material = this.getImageMaterialProperty();
        }
    }

    /**
     * 添加相机的监听
     */
    addLisener() {
        const maxRadius = 100;
        const min = 6375000;
        const max = 10000000;
        this.cameraMoveEnd = () => {
            if (this.heatmapOptions && this.heatmap && this.heatmapDataOptions) {
                const h = this.viewer.camera.getMagnitude();
                const distance = this?.initOptions?.cameraHeightDistance
                    ? this.initOptions.cameraHeightDistance
                    : 1000;
                if (Math.abs(h - this.lastCameraHeight) > distance) {
                    this.lastCameraHeight = h;
                    if (typeof min === "number" && typeof max === "number") {
                        const radius = parseInt(
                            (
                                this.initRadius +
                                ((maxRadius - this.initRadius) * (h - min)) / (max - min)
                            ).toFixed(0)
                        );
                        if (radius) {
                            this.updateRadius(radius);
                        }
                    }
                }
            }
        };
        this.viewer.camera.moveEnd.addEventListener(this.cameraMoveEnd);
    }

    /**
     *
     * @param points
     * @param expand
     * @returns
     */
    getBounds(points) {
        if (points) {
            let lonMin = 180;
            let lonMax = -180;
            let latMin = 90;
            let latMax = -180;
            points.forEach(function (point) {
                const { x: longitude, y: latitude } = point;
                lonMin = longitude < lonMin ? longitude : lonMin;
                latMin = latitude < latMin ? latitude : latMin;
                lonMax = longitude > lonMax ? longitude : lonMax;
                latMax = latitude > latMax ? latitude : latMax;
            });
            const xRange = lonMax - lonMin ? lonMax - lonMin : 1;
            const yRange = latMax - latMin ? latMax - latMin : 1;
            return [
                lonMin - xRange / 10,
                latMin - yRange / 10,
                lonMax + xRange / 10,
                latMax + yRange / 10,
            ];
        }
        return [0, 0, 0, 0];
    }

    createContainer(bounds) {
        const container = document.createElement("div");
        const width = 1000;
        const height = parseInt(
            ((1000 / (bounds[2] - bounds[0])) * (bounds[3] - bounds[1])).toFixed(0)
        );
        container.setAttribute(
            "style",
            `width:${width}px;height:${height}px;display:none;`
        );
        document.body.appendChild(container);
        return { container, width, height };
    }
}

const DOM = document.getElementById('box')

const viewer = new Cesium.Viewer(DOM, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

viewer._cesiumWidget._creditContainer.style.display = "none"

// 模拟数值
const points = new Array(50).fill('').map(() => {

    return {

        x: 116.46 + Math.random() * 10,

        y: 39.92 + Math.random() * 10,

        value: Math.random()

    }
    
})

// 创建热力图
new setCesiumHeatmap(viewer, {

    points,

    viewToLayer: true, 

    heatmapDataOptions: { max: 1, min: 0 },

    heatmapOptions: {

        radius: 100,

        maxOpacity: 0.5,

        minOpacity: 0

    }

})

