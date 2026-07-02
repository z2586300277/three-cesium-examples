import * as Cesium from "cesium";
import * as dat from 'dat.gui';

const box = document.getElementById('box');

const ViewShedAnalyser = (() => {
    const defined = Cesium.defined;
    const defaultValue = Cesium.defaultValue;

    class ViewshedError extends Error {
        constructor(message) {
            super(message);
            this.name = 'ViewshedError';
        }
    }

    class LonLat {
        constructor(lon, lat, alt) {
            this.lon = lon;
            this.lat = lat;
            this.alt = defaultValue(alt, 0);
        }

        static toCartesian(point, viewer) {
            if (!defined(point)) {
                return undefined;
            }
            if (point instanceof Cesium.Cartesian3) {
                return point;
            }
            if (point instanceof Cesium.Cartographic) {
                return Cesium.Cartographic.toCartesian(point);
            }
            if (point instanceof LonLat) {
                return Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.alt);
            }
            if (point instanceof Cesium.Cartesian2 && viewer) {
                const ray = viewer.scene.camera.getPickRay(point);
                return viewer.scene.globe.pick(ray, viewer.scene);
            }
            if (Array.isArray(point)) {
                return Cesium.Cartesian3.fromDegrees(point[0], point[1], defaultValue(point[2], 0));
            }
            if (typeof point.lon === 'number' && typeof point.lat === 'number') {
                return Cesium.Cartesian3.fromDegrees(point.lon, point.lat, defaultValue(point.alt, 0));
            }
            return undefined;
        }
    }

    const ViewShadowPrimitive = (function () {
        class ViewShadowPrimitive {
            /**
             * 视域分析图元
             * @private
             * @extends CustomPrimitive
             * @param {Cesium.ShadowMap} shadowMap 视域阴影
             */
            constructor(shadowMap) {
                if (!defined(shadowMap)) {
                    throw new ViewshedError('parameter shadowMap is required.')
                }
                this._shadowMap = shadowMap;
            }
            /**
             * 是否渲染该图元
             * @type {Bool}
             */
            get show() {
                return this._show;
            }
            set show(val) {
                this._show = val;
            }
            /**
             * 场景渲染时scene会自动调用该方法，请勿主动调用。
             * @override
             * @param  {FrameState} frameState
             */
            update(frameState) {
                frameState.shadowMaps.push(this._shadowMap);
            }
            /**
             * 销毁对象并释放WebGL资源
             */
            destroy() {
                if (this._shadowMap && !this._shadowMap.isDestroyed()) {
                    this._shadowMap.destroy();
                }
                Cesium.destroyObject(this);
            }

        }
        ViewShadowPrimitive.prototype.isDestroyed = function () {
            return false;
        };
        return ViewShadowPrimitive;
    })();

    const ViewshedMap = (function () {
        const BoundingRectangle = Cesium.BoundingRectangle;
        const BoundingSphere = Cesium.BoundingSphere;
        const Cartesian2 = Cesium.Cartesian2;
        const Cartesian3 = Cesium.Cartesian3;
        const Cartesian4 = Cesium.Cartesian4;
        const Cartographic = Cesium.Cartographic;
        const Color = Cesium.Color;
        const combine = Cesium.combine;
        const CullingVolume = Cesium.CullingVolume;
        const defaultValue = Cesium.defaultValue;
        const defined = Cesium.defined;
        const defineProperties = Object.defineProperties;
        const destroyObject = Cesium.destroyObject;
        const DeveloperError = Cesium.DeveloperError;
        const FeatureDetection = Cesium.FeatureDetection;
        const Intersect = Cesium.Intersect;
        const CesiumMath = Cesium.Math;
        const Matrix4 = Cesium.Matrix4;
        const OrthographicOffCenterFrustum = Cesium.OrthographicOffCenterFrustum;
        const PerspectiveFrustum = Cesium.PerspectiveFrustum;
        const PixelFormat = Cesium.PixelFormat;
        const WebGLConstants = Cesium.WebGLConstants;
        const ClearCommand = Cesium.ClearCommand;
        const ContextLimits = Cesium.ContextLimits;
        const CubeMap = Cesium.CubeMap;
        const DrawCommand = Cesium.DrawCommand;
        const Framebuffer = Cesium.Framebuffer;
        const Pass = Cesium.Pass;
        const PassState = Cesium.PassState;
        const PixelDatatype = Cesium.PixelDatatype;
        const Renderbuffer = Cesium.Renderbuffer;
        const RenderbufferFormat = Cesium.RenderbufferFormat;
        const RenderState = Cesium.RenderState;
        const Sampler = Cesium.Sampler;
        const Texture = Cesium.Texture;
        const TextureMagnificationFilter = Cesium.TextureMagnificationFilter;
        const TextureMinificationFilter = Cesium.TextureMinificationFilter;
        const TextureWrap = Cesium.TextureWrap;
        const Camera = Cesium.Camera;
        const CullFace = Cesium.CullFace;
        const ShadowMapShader = Cesium.ShadowMapShader;
        const ShaderSource = Cesium.ShaderSource;

        function ViewshedMap(options) {
            options = defaultValue(options, defaultValue.EMPTY_OBJECT);
            // options.context is an undocumented option
            var context = options.context;

            //>>includeStart('debug', pragmas.debug);
            if (!defined(context)) {
                throw new DeveloperError("context is required.");
            }
            if (!defined(options.lightCamera)) {
                throw new DeveloperError("lightCamera is required.");
            }
            if (defined(options.numberOfCascades) && (options.numberOfCascades !== 1 && options.numberOfCascades !== 4)) {
                throw new DeveloperError("Only one or four cascades are supported.");
            }
            //>>includeEnd('debug');

            this._enabled = defaultValue(options.enabled, true);
            this._softShadows = defaultValue(options.softShadows, false);
            this._normalOffset = defaultValue(options.normalOffset, true);
            this.dirty = true;

            /**
             * Specifies whether the shadow map originates from a light source. Shadow maps that are used for analytical
             * purposes should set this to false so as not to affect scene rendering.
             *
             * @private
             */
            this.fromLightSource = defaultValue(options.fromLightSource, true);

            /**
             * Determines the darkness of the shadows.
             *
             * @type {Number}
             * @default 0.3
             */
            this.darkness = 0.0;
            this._darkness = this.darkness;

            /**
             * Determines the maximum distance of the shadow map. Only applicable for cascaded shadows. Larger distances may result in lower quality shadows.
             *
             * @type {Number}
             * @default 5000.0
             */
            this.maximumDistance = defaultValue(options.maximumDistance, 5000.0);

            this._outOfView = false;
            this._outOfViewPrevious = false;
            this._needsUpdate = true;

            // In IE11 and Edge polygon offset is not functional.
            // TODO : Also disabled for instances of Firefox and Chrome running ANGLE that do not support depth textures.
            var polygonOffsetSupported = true;
            if (
                FeatureDetection.isInternetExplorer() ||
                FeatureDetection.isEdge() ||
                ((FeatureDetection.isChrome() || FeatureDetection.isFirefox()) &&
                    FeatureDetection.isWindows() &&
                    !context.depthTexture)
            ) {
                polygonOffsetSupported = false;
            }
            this._polygonOffsetSupported = polygonOffsetSupported;

            this._terrainBias = {
                polygonOffset: polygonOffsetSupported,
                polygonOffsetFactor: 1.1,
                polygonOffsetUnits: 4.0,
                normalOffset: this._normalOffset,
                normalOffsetScale: 0.5,
                normalShading: true,
                normalShadingSmooth: 0.3,
                depthBias: 0.0001
            };

            this._primitiveBias = {
                polygonOffset: polygonOffsetSupported,
                polygonOffsetFactor: 1.1,
                polygonOffsetUnits: 4.0,
                normalOffset: this._normalOffset,
                normalOffsetScale: 0.1,
                normalShading: true,
                normalShadingSmooth: 0.05,
                depthBias: 0.00002
            };

            this._pointBias = {
                polygonOffset: false,
                polygonOffsetFactor: 1.1,
                polygonOffsetUnits: 4.0,
                normalOffset: this._normalOffset,
                normalOffsetScale: 0.0,
                normalShading: true,
                normalShadingSmooth: 0.1,
                depthBias: 0.0005
            };

            // Framebuffer resources
            this._depthAttachment = undefined;
            this._colorAttachment = undefined;

            // Uniforms
            this._shadowMapMatrix = new Matrix4();
            this._shadowMapTexture = undefined;
            this._lightDirectionEC = new Cartesian3();
            this._lightPositionEC = new Cartesian4();
            this._distance = 0.0;

            this._lightCamera = options.lightCamera;
            this._shadowMapCamera = new ShadowMapCamera();
            this._shadowMapCullingVolume = undefined;
            this._sceneCamera = undefined;
            // this._boundingSphere = new BoundingSphere();
            this._boundingSphere = defaultValue(options.boundingSphere, new BoundingSphere());

            this._isPointLight = defaultValue(options.isPointLight, false);
            this._pointLightRadius = defaultValue(options.pointLightRadius, 100.0);

            this._cascadesEnabled = false;
            this._numberOfCascades = !this._cascadesEnabled ? 0 : defaultValue(options.numberOfCascades, 4);
            this._fitNearFar = true;
            this._maximumCascadeDistances = [25.0, 150.0, 700.0, Number.MAX_VALUE];

            this._textureSize = new Cartesian2();

            this._isSpotLight = false;
            if (this._cascadesEnabled) {
                // Cascaded shadows are always orthographic. The frustum dimensions are calculated on the fly.
                this._shadowMapCamera.frustum = new OrthographicOffCenterFrustum();
            } else if (defined(this._lightCamera.frustum.fov)) {
                // If the light camera uses a perspective frustum, then the light source is a spot light
                this._isSpotLight = true;
            }

            // Uniforms
            this._cascadeSplits = [new Cartesian4(), new Cartesian4()];
            this._cascadeMatrices = [new Matrix4(), new Matrix4(), new Matrix4(), new Matrix4()];
            this._cascadeDistances = new Cartesian4();

            var numberOfPasses;
            if (this._isPointLight) {
                numberOfPasses = 6; // One shadow map for each direction
            } else if (!this._cascadesEnabled) {
                numberOfPasses = 1;
            } else {
                numberOfPasses = this._numberOfCascades;
            }

            this._passes = new Array(numberOfPasses);
            for (var i = 0; i < numberOfPasses; ++i) {
                this._passes[i] = new ShadowPass(context);
            }

            this._debugCascadeColors = false;

            this._usesDepthTexture = context.depthTexture;

            if (this._isPointLight) {
                this._usesDepthTexture = false;
            }

            // Create render states for shadow casters
            this._primitiveRenderState = undefined;
            this._terrainRenderState = undefined;
            this._pointRenderState = undefined;
            createRenderStates(this);

            // For clearing the shadow map texture every frame
            this._clearCommand = new ClearCommand({
                depth: 1.0,
                color: new Color()
            });

            this._clearPassState = new PassState(context);

            this._size = defaultValue(options.size, 2048);
            this.size = this._size;
        }

        /**
         * Global maximum shadow distance used to prevent far off receivers from extending
         * the shadow far plane. This helps set a tighter near/far when viewing objects from space.
         *
         * @private
         */
        ViewshedMap.MAXIMUM_DISTANCE = 20000.0;

        function ShadowPass(context) {
            this.camera = new ShadowMapCamera();
            this.passState = new PassState(context);
            this.framebuffer = undefined;
            this.textureOffsets = undefined;
            this.commandList = [];
            this.cullingVolume = undefined;
        }

        function createRenderState(colorMask, bias) {
            return RenderState.fromCache({
                cull: {
                    enabled: true,
                    face: CullFace.BACK
                },
                depthTest: {
                    enabled: true
                },
                colorMask: {
                    red: colorMask,
                    green: colorMask,
                    blue: colorMask,
                    alpha: colorMask
                },
                depthMask: true,
                polygonOffset: {
                    enabled: bias.polygonOffset,
                    factor: bias.polygonOffsetFactor,
                    units: bias.polygonOffsetUnits
                }
            });
        }

        function createRenderStates(shadowMap) {
            // Enable the color mask if the shadow map is backed by a color texture, e.g. when depth textures aren't supported
            var colorMask = !shadowMap._usesDepthTexture;
            shadowMap._primitiveRenderState = createRenderState(colorMask, shadowMap._primitiveBias);
            shadowMap._terrainRenderState = createRenderState(colorMask, shadowMap._terrainBias);
            shadowMap._pointRenderState = createRenderState(colorMask, shadowMap._pointBias);
        }

        defineProperties(ViewshedMap.prototype, {
            /**
             * Determines if the shadow map will be shown.
             *
             * @memberof ViewshedMap.prototype
             * @type {Boolean}
             * @default true
             */
            enabled: {
                get: function () {
                    return this._enabled;
                },
                set: function (value) {
                    this.dirty = this._enabled !== value;
                    this._enabled = value;
                }
            },
            isViewShed: {
                get: function () {
                    return true;
                }
            },

            /**
             * Determines if a normal bias will be applied to shadows.
             *
             * @memberof ViewshedMap.prototype
             * @type {Boolean}
             * @default true
             */
            normalOffset: {
                get: function () {
                    return this._normalOffset;
                },
                set: function (value) {
                    this.dirty = this._normalOffset !== value;
                    this._normalOffset = value;
                    this._terrainBias.normalOffset = value;
                    this._primitiveBias.normalOffset = value;
                    this._pointBias.normalOffset = value;
                }
            },

            /**
             * Determines if soft shadows are enabled. Uses pcf filtering which requires more texture reads and may hurt performance.
             *
             * @memberof ViewshedMap.prototype
             * @type {Boolean}
             * @default false
             */
            softShadows: {
                get: function () {
                    return this._softShadows;
                },
                set: function (value) {
                    this.dirty = this._softShadows !== value;
                    this._softShadows = value;
                }
            },

            /**
             * The width and height, in pixels, of each shadow map.
             *
             * @memberof ViewshedMap.prototype
             * @type {Number}
             * @default 2048
             */
            size: {
                get: function () {
                    return this._size;
                },
                set: function (value) {
                    resize(this, value);
                }
            },

            /**
             * Whether the shadow map is out of view of the scene camera.
             *
             * @memberof ViewshedMap.prototype
             * @type {Boolean}
             * @readonly
             * @private
             */
            outOfView: {
                get: function () {
                    return this._outOfView;
                }
            },

            /**
             * The culling volume of the shadow frustum.
             *
             * @memberof ViewshedMap.prototype
             * @type {CullingVolume}
             * @readonly
             * @private
             */
            shadowMapCullingVolume: {
                get: function () {
                    return this._shadowMapCullingVolume;
                }
            },

            /**
             * The passes used for rendering shadows. Each face of a point light or each cascade for a cascaded shadow map is a separate pass.
             *
             * @memberof ViewshedMap.prototype
             * @type {ShadowPass[]}
             * @readonly
             * @private
             */
            passes: {
                get: function () {
                    return this._passes;
                }
            },

            /**
             * Whether the light source is a point light.
             *
             * @memberof ViewshedMap.prototype
             * @type {Boolean}
             * @readonly
             * @private
             */
            isPointLight: {
                get: function () {
                    return this._isPointLight;
                }
            },

            /**
             * Debug option for visualizing the cascades by color.
             *
             * @memberof ViewshedMap.prototype
             * @type {Boolean}
             * @default false
             * @private
             */
            debugCascadeColors: {
                get: function () {
                    return this._debugCascadeColors;
                },
                set: function (value) {
                    this.dirty = this._debugCascadeColors !== value;
                    this._debugCascadeColors = value;
                }
            }
        });

        function destroyFramebuffer(shadowMap) {
            var length = shadowMap._passes.length;
            for (var i = 0; i < length; ++i) {
                var pass = shadowMap._passes[i];
                var framebuffer = pass.framebuffer;
                if (defined(framebuffer) && !framebuffer.isDestroyed()) {
                    framebuffer.destroy();
                }
                pass.framebuffer = undefined;
            }

            // Destroy the framebuffer attachments
            shadowMap._depthAttachment = shadowMap._depthAttachment && shadowMap._depthAttachment.destroy();
            shadowMap._colorAttachment = shadowMap._colorAttachment && shadowMap._colorAttachment.destroy();
        }

        function createSampler() {
            return new Sampler({
                wrapS: TextureWrap.CLAMP_TO_EDGE,
                wrapT: TextureWrap.CLAMP_TO_EDGE,
                minificationFilter: TextureMinificationFilter.NEAREST,
                magnificationFilter: TextureMagnificationFilter.NEAREST
            });
        }

        function createFramebufferColor(shadowMap, context) {
            var depthRenderbuffer = new Renderbuffer({
                context: context,
                width: shadowMap._textureSize.x,
                height: shadowMap._textureSize.y,
                format: RenderbufferFormat.DEPTH_COMPONENT16
            });

            var colorTexture = new Texture({
                context: context,
                width: shadowMap._textureSize.x,
                height: shadowMap._textureSize.y,
                pixelFormat: PixelFormat.RGBA,
                pixelDatatype: PixelDatatype.UNSIGNED_BYTE,
                sampler: createSampler()
            });

            var framebuffer = new Framebuffer({
                context: context,
                depthRenderbuffer: depthRenderbuffer,
                colorTextures: [colorTexture],
                destroyAttachments: false
            });

            var length = shadowMap._passes.length;
            for (var i = 0; i < length; ++i) {
                var pass = shadowMap._passes[i];
                pass.framebuffer = framebuffer;
                pass.passState.framebuffer = framebuffer;
            }

            shadowMap._shadowMapTexture = colorTexture;
            shadowMap._depthAttachment = depthRenderbuffer;
            shadowMap._colorAttachment = colorTexture;
        }

        function createFramebufferDepth(shadowMap, context) {
            var depthStencilTexture = new Texture({
                context: context,
                width: shadowMap._textureSize.x,
                height: shadowMap._textureSize.y,
                pixelFormat: PixelFormat.DEPTH_STENCIL,
                pixelDatatype: PixelDatatype.UNSIGNED_INT_24_8,
                sampler: createSampler()
            });

            var framebuffer = new Framebuffer({
                context: context,
                depthStencilTexture: depthStencilTexture,
                destroyAttachments: false
            });

            var length = shadowMap._passes.length;
            for (var i = 0; i < length; ++i) {
                var pass = shadowMap._passes[i];
                pass.framebuffer = framebuffer;
                pass.passState.framebuffer = framebuffer;
            }

            shadowMap._shadowMapTexture = depthStencilTexture;
            shadowMap._depthAttachment = depthStencilTexture;
        }

        function createFramebufferCube(shadowMap, context) {
            var depthRenderbuffer = new Renderbuffer({
                context: context,
                width: shadowMap._textureSize.x,
                height: shadowMap._textureSize.y,
                format: RenderbufferFormat.DEPTH_COMPONENT16
            });

            var cubeMap = new CubeMap({
                context: context,
                width: shadowMap._textureSize.x,
                height: shadowMap._textureSize.y,
                pixelFormat: PixelFormat.RGBA,
                pixelDatatype: PixelDatatype.UNSIGNED_BYTE,
                sampler: createSampler()
            });

            var faces = [
                cubeMap.negativeX,
                cubeMap.negativeY,
                cubeMap.negativeZ,
                cubeMap.positiveX,
                cubeMap.positiveY,
                cubeMap.positiveZ
            ];

            for (var i = 0; i < 6; ++i) {
                var framebuffer = new Framebuffer({
                    context: context,
                    depthRenderbuffer: depthRenderbuffer,
                    colorTextures: [faces[i]],
                    destroyAttachments: false
                });
                var pass = shadowMap._passes[i];
                pass.framebuffer = framebuffer;
                pass.passState.framebuffer = framebuffer;
            }

            shadowMap._shadowMapTexture = cubeMap;
            shadowMap._depthAttachment = depthRenderbuffer;
            shadowMap._colorAttachment = cubeMap;
        }

        function createFramebuffer(shadowMap, context) {
            if (shadowMap._isPointLight) {
                createFramebufferCube(shadowMap, context);
            } else if (shadowMap._usesDepthTexture) {
                createFramebufferDepth(shadowMap, context);
            } else {
                createFramebufferColor(shadowMap, context);
            }
        }

        function checkFramebuffer(shadowMap, context) {
            // Attempt to make an FBO with only a depth texture. If it fails, fallback to a color texture.
            if (
                shadowMap._usesDepthTexture &&
                shadowMap._passes[0].framebuffer.status !== WebGLConstants.FRAMEBUFFER_COMPLETE
            ) {
                shadowMap._usesDepthTexture = false;
                createRenderStates(shadowMap);
                destroyFramebuffer(shadowMap);
                createFramebuffer(shadowMap, context);
            }
        }

        function updateFramebuffer(shadowMap, context) {
            if (!defined(shadowMap._passes[0].framebuffer) || shadowMap._shadowMapTexture.width !== shadowMap._textureSize.x) {
                destroyFramebuffer(shadowMap);
                createFramebuffer(shadowMap, context);
                checkFramebuffer(shadowMap, context);
                clearFramebuffer(shadowMap, context);
            }
        }

        function clearFramebuffer(shadowMap, context, shadowPass) {
            shadowPass = defaultValue(shadowPass, 0);
            if (shadowMap._isPointLight || shadowPass === 0) {
                shadowMap._clearCommand.framebuffer = shadowMap._passes[shadowPass].framebuffer;
                shadowMap._clearCommand.execute(context, shadowMap._clearPassState);
            }
        }

        function resize(shadowMap, size) {
            shadowMap._size = size;
            var passes = shadowMap._passes;
            var numberOfPasses = passes.length;
            var textureSize = shadowMap._textureSize;

            if (shadowMap._isPointLight) {
                size = ContextLimits.maximumCubeMapSize >= size ? size : ContextLimits.maximumCubeMapSize;
                textureSize.x = size;
                textureSize.y = size;
                var faceViewport = new BoundingRectangle(0, 0, size, size);
                passes[0].passState.viewport = faceViewport;
                passes[1].passState.viewport = faceViewport;
                passes[2].passState.viewport = faceViewport;
                passes[3].passState.viewport = faceViewport;
                passes[4].passState.viewport = faceViewport;
                passes[5].passState.viewport = faceViewport;
            } else if (numberOfPasses === 1) {
                // +----+
                // |  1 |
                // +----+
                size = ContextLimits.maximumTextureSize >= size ? size : ContextLimits.maximumTextureSize;
                textureSize.x = size;
                textureSize.y = size;
                passes[0].passState.viewport = new BoundingRectangle(0, 0, size, size);
            } else if (numberOfPasses === 4) {
                // +----+----+
                // |  3 |  4 |
                // +----+----+
                // |  1 |  2 |
                // +----+----+
                size = ContextLimits.maximumTextureSize >= size * 2 ? size : ContextLimits.maximumTextureSize / 2;
                textureSize.x = size * 2;
                textureSize.y = size * 2;
                passes[0].passState.viewport = new BoundingRectangle(0, 0, size, size);
                passes[1].passState.viewport = new BoundingRectangle(size, 0, size, size);
                passes[2].passState.viewport = new BoundingRectangle(0, size, size, size);
                passes[3].passState.viewport = new BoundingRectangle(size, size, size, size);
            }

            // Update clear pass state
            shadowMap._clearPassState.viewport = new BoundingRectangle(0, 0, textureSize.x, textureSize.y);

            // Transforms shadow coordinates [0, 1] into the pass's region of the texture
            for (var i = 0; i < numberOfPasses; ++i) {
                var pass = passes[i];
                var viewport = pass.passState.viewport;
                var biasX = viewport.x / textureSize.x;
                var biasY = viewport.y / textureSize.y;
                var scaleX = viewport.width / textureSize.x;
                var scaleY = viewport.height / textureSize.y;
                pass.textureOffsets = new Matrix4(
                    scaleX,
                    0.0,
                    0.0,
                    biasX,
                    0.0,
                    scaleY,
                    0.0,
                    biasY,
                    0.0,
                    0.0,
                    1.0,
                    0.0,
                    0.0,
                    0.0,
                    0.0,
                    1.0
                );
            }
        }

        var frustumCornersNDC = new Array(8);
        frustumCornersNDC[0] = new Cartesian4(-1.0, -1.0, -1.0, 1.0);
        frustumCornersNDC[1] = new Cartesian4(1.0, -1.0, -1.0, 1.0);
        frustumCornersNDC[2] = new Cartesian4(1.0, 1.0, -1.0, 1.0);
        frustumCornersNDC[3] = new Cartesian4(-1.0, 1.0, -1.0, 1.0);
        frustumCornersNDC[4] = new Cartesian4(-1.0, -1.0, 1.0, 1.0);
        frustumCornersNDC[5] = new Cartesian4(1.0, -1.0, 1.0, 1.0);
        frustumCornersNDC[6] = new Cartesian4(1.0, 1.0, 1.0, 1.0);
        frustumCornersNDC[7] = new Cartesian4(-1.0, 1.0, 1.0, 1.0);

        var scratchMatrix = new Matrix4();
        var scratchFrustumCorners = new Array(8);
        for (var i = 0; i < 8; ++i) {
            scratchFrustumCorners[i] = new Cartesian4();
        }

        function ShadowMapCamera() {
            this.viewMatrix = new Matrix4();
            this.inverseViewMatrix = new Matrix4();
            this.frustum = undefined;
            this.positionCartographic = new Cartographic();
            this.positionWC = new Cartesian3();
            this.directionWC = Cartesian3.clone(Cartesian3.UNIT_Z);
            this.upWC = Cartesian3.clone(Cartesian3.UNIT_Y);
            this.rightWC = Cartesian3.clone(Cartesian3.UNIT_X);
            this.viewProjectionMatrix = new Matrix4();
        }

        ShadowMapCamera.prototype.clone = function (camera) {
            Matrix4.clone(camera.viewMatrix, this.viewMatrix);
            Matrix4.clone(camera.inverseViewMatrix, this.inverseViewMatrix);
            this.frustum = camera.frustum.clone(this.frustum);
            Cartographic.clone(camera.positionCartographic, this.positionCartographic);
            Cartesian3.clone(camera.positionWC, this.positionWC);
            Cartesian3.clone(camera.directionWC, this.directionWC);
            Cartesian3.clone(camera.upWC, this.upWC);
            Cartesian3.clone(camera.rightWC, this.rightWC);
        };

        // Converts from NDC space to texture space
        var scaleBiasMatrix = new Matrix4(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);

        ShadowMapCamera.prototype.getViewProjection = function () {
            var view = this.viewMatrix;
            var projection = this.frustum.projectionMatrix;
            Matrix4.multiply(projection, view, this.viewProjectionMatrix);
            Matrix4.multiply(scaleBiasMatrix, this.viewProjectionMatrix, this.viewProjectionMatrix);
            return this.viewProjectionMatrix;
        };

        var scratchSplits = new Array(5);
        var scratchFrustum = new PerspectiveFrustum();
        var scratchCascadeDistances = new Array(4);
        var scratchMin = new Cartesian3();
        var scratchMax = new Cartesian3();

        function computeCascades(shadowMap, frameState) {
            var shadowMapCamera = shadowMap._shadowMapCamera;
            var sceneCamera = shadowMap._sceneCamera;
            var cameraNear = sceneCamera.frustum.near;
            var cameraFar = sceneCamera.frustum.far;
            var numberOfCascades = shadowMap._numberOfCascades;

            // Split cascades. Use a mix of linear and log splits.
            var i;
            var range = cameraFar - cameraNear;
            var ratio = cameraFar / cameraNear;

            var lambda = 0.9;
            var clampCascadeDistances = false;

            // When the camera is close to a relatively small model, provide more detail in the closer cascades.
            // If the camera is near or inside a large model, such as the root tile of a city, then use the default values.
            // To get the most accurate cascade splits we would need to find the min and max values from the depth texture.
            if (frameState.shadowState.closestObjectSize < 200.0) {
                clampCascadeDistances = true;
                lambda = 0.9;
            }

            var cascadeDistances = scratchCascadeDistances;
            var splits = scratchSplits;
            splits[0] = cameraNear;
            splits[numberOfCascades] = cameraFar;

            // Find initial splits
            for (i = 0; i < numberOfCascades; ++i) {
                var p = (i + 1) / numberOfCascades;
                var logScale = cameraNear * Math.pow(ratio, p);
                var uniformScale = cameraNear + range * p;
                var split = CesiumMath.lerp(uniformScale, logScale, lambda);
                splits[i + 1] = split;
                cascadeDistances[i] = split - splits[i];
            }

            if (clampCascadeDistances) {
                // Clamp each cascade to its maximum distance
                for (i = 0; i < numberOfCascades; ++i) {
                    cascadeDistances[i] = Math.min(cascadeDistances[i], shadowMap._maximumCascadeDistances[i]);
                }

                // Recompute splits
                var distance = splits[0];
                for (i = 0; i < numberOfCascades - 1; ++i) {
                    distance += cascadeDistances[i];
                    splits[i + 1] = distance;
                }
            }

            Cartesian4.unpack(splits, 0, shadowMap._cascadeSplits[0]);
            Cartesian4.unpack(splits, 1, shadowMap._cascadeSplits[1]);
            Cartesian4.unpack(cascadeDistances, 0, shadowMap._cascadeDistances);

            var shadowFrustum = shadowMapCamera.frustum;
            var left = shadowFrustum.left;
            var right = shadowFrustum.right;
            var bottom = shadowFrustum.bottom;
            var top = shadowFrustum.top;
            var near = shadowFrustum.near;
            var far = shadowFrustum.far;

            var position = shadowMapCamera.positionWC;
            var direction = shadowMapCamera.directionWC;
            var up = shadowMapCamera.upWC;

            var cascadeSubFrustum = sceneCamera.frustum.clone(scratchFrustum);
            var shadowViewProjection = shadowMapCamera.getViewProjection();

            for (i = 0; i < numberOfCascades; ++i) {
                // Find the bounding box of the camera sub-frustum in shadow map texture space
                cascadeSubFrustum.near = splits[i];
                cascadeSubFrustum.far = splits[i + 1];
                var viewProjection = Matrix4.multiply(
                    cascadeSubFrustum.projectionMatrix,
                    sceneCamera.viewMatrix,
                    scratchMatrix
                );
                var inverseViewProjection = Matrix4.inverse(viewProjection, scratchMatrix);
                var shadowMapMatrix = Matrix4.multiply(shadowViewProjection, inverseViewProjection, scratchMatrix);

                // Project each corner from camera NDC space to shadow map texture space. Min and max will be from 0 to 1.
                var min = Cartesian3.fromElements(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, scratchMin);
                var max = Cartesian3.fromElements(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, scratchMax);

                for (var k = 0; k < 8; ++k) {
                    var corner = Cartesian4.clone(frustumCornersNDC[k], scratchFrustumCorners[k]);
                    Matrix4.multiplyByVector(shadowMapMatrix, corner, corner);
                    Cartesian3.divideByScalar(corner, corner.w, corner); // Handle the perspective divide
                    Cartesian3.minimumByComponent(corner, min, min);
                    Cartesian3.maximumByComponent(corner, max, max);
                }

                // Limit light-space coordinates to the [0, 1] range
                min.x = Math.max(min.x, 0.0);
                min.y = Math.max(min.y, 0.0);
                min.z = 0.0; // Always start cascade frustum at the top of the light frustum to capture objects in the light's path
                max.x = Math.min(max.x, 1.0);
                max.y = Math.min(max.y, 1.0);
                max.z = Math.min(max.z, 1.0);

                var pass = shadowMap._passes[i];
                var cascadeCamera = pass.camera;
                cascadeCamera.clone(shadowMapCamera); // PERFORMANCE_IDEA : could do a shallow clone for all properties except the frustum

                var frustum = cascadeCamera.frustum;
                frustum.left = left + min.x * (right - left);
                frustum.right = left + max.x * (right - left);
                frustum.bottom = bottom + min.y * (top - bottom);
                frustum.top = bottom + max.y * (top - bottom);
                frustum.near = near + min.z * (far - near);
                frustum.far = near + max.z * (far - near);

                pass.cullingVolume = cascadeCamera.frustum.computeCullingVolume(position, direction, up);

                // Transforms from eye space to the cascade's texture space
                var cascadeMatrix = shadowMap._cascadeMatrices[i];
                Matrix4.multiply(cascadeCamera.getViewProjection(), sceneCamera.inverseViewMatrix, cascadeMatrix);
                Matrix4.multiply(pass.textureOffsets, cascadeMatrix, cascadeMatrix);
            }
        }

        var scratchLightView = new Matrix4();
        var scratchRight = new Cartesian3();
        var scratchUp = new Cartesian3();
        var scratchTranslation = new Cartesian3();

        function fitShadowMapToScene(shadowMap, frameState) {
            var shadowMapCamera = shadowMap._shadowMapCamera;
            var sceneCamera = shadowMap._sceneCamera;

            // 1. First find a tight bounding box in light space that contains the entire camera frustum.
            var viewProjection = Matrix4.multiply(sceneCamera.frustum.projectionMatrix, sceneCamera.viewMatrix, scratchMatrix);
            var inverseViewProjection = Matrix4.inverse(viewProjection, scratchMatrix);

            // Start to construct the light view matrix. Set translation later once the bounding box is found.
            var lightDir = shadowMapCamera.directionWC;
            var lightUp = sceneCamera.directionWC; // Align shadows to the camera view.
            var lightRight = Cartesian3.cross(lightDir, lightUp, scratchRight);
            lightUp = Cartesian3.cross(lightRight, lightDir, scratchUp); // Recalculate up now that right is derived
            Cartesian3.normalize(lightUp, lightUp);
            Cartesian3.normalize(lightRight, lightRight);
            var lightPosition = Cartesian3.fromElements(0.0, 0.0, 0.0, scratchTranslation);

            var lightView = Matrix4.computeView(lightPosition, lightDir, lightUp, lightRight, scratchLightView);
            var cameraToLight = Matrix4.multiply(lightView, inverseViewProjection, scratchMatrix);

            // Project each corner from NDC space to light view space, and calculate a min and max in light view space
            var min = Cartesian3.fromElements(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, scratchMin);
            var max = Cartesian3.fromElements(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, scratchMax);

            for (var i = 0; i < 8; ++i) {
                var corner = Cartesian4.clone(frustumCornersNDC[i], scratchFrustumCorners[i]);
                Matrix4.multiplyByVector(cameraToLight, corner, corner);
                Cartesian3.divideByScalar(corner, corner.w, corner); // Handle the perspective divide
                Cartesian3.minimumByComponent(corner, min, min);
                Cartesian3.maximumByComponent(corner, max, max);
            }

            // 2. Set bounding box back to include objects in the light's view
            max.z += 1000.0; // Note: in light space, a positive number is behind the camera
            min.z -= 10.0; // Extend the shadow volume forward slightly to avoid problems right at the edge

            // 3. Adjust light view matrix so that it is centered on the bounding volume
            var translation = scratchTranslation;
            translation.x = -(0.5 * (min.x + max.x));
            translation.y = -(0.5 * (min.y + max.y));
            translation.z = -max.z;

            var translationMatrix = Matrix4.fromTranslation(translation, scratchMatrix);
            lightView = Matrix4.multiply(translationMatrix, lightView, lightView);

            // 4. Create an orthographic frustum that covers the bounding box extents
            var halfWidth = 0.5 * (max.x - min.x);
            var halfHeight = 0.5 * (max.y - min.y);
            var depth = max.z - min.z;

            var frustum = shadowMapCamera.frustum;
            frustum.left = -halfWidth;
            frustum.right = halfWidth;
            frustum.bottom = -halfHeight;
            frustum.top = halfHeight;
            frustum.near = 0.01;
            frustum.far = depth;

            // 5. Update the shadow map camera
            Matrix4.clone(lightView, shadowMapCamera.viewMatrix);
            Matrix4.inverse(lightView, shadowMapCamera.inverseViewMatrix);
            Matrix4.getTranslation(shadowMapCamera.inverseViewMatrix, shadowMapCamera.positionWC);
            frameState.mapProjection.ellipsoid.cartesianToCartographic(
                shadowMapCamera.positionWC,
                shadowMapCamera.positionCartographic
            );
            Cartesian3.clone(lightDir, shadowMapCamera.directionWC);
            Cartesian3.clone(lightUp, shadowMapCamera.upWC);
            Cartesian3.clone(lightRight, shadowMapCamera.rightWC);
        }

        var directions = [
            new Cartesian3(-1.0, 0.0, 0.0),
            new Cartesian3(0.0, -1.0, 0.0),
            new Cartesian3(0.0, 0.0, -1.0),
            new Cartesian3(1.0, 0.0, 0.0),
            new Cartesian3(0.0, 1.0, 0.0),
            new Cartesian3(0.0, 0.0, 1.0)
        ];

        var ups = [
            new Cartesian3(0.0, -1.0, 0.0),
            new Cartesian3(0.0, 0.0, -1.0),
            new Cartesian3(0.0, -1.0, 0.0),
            new Cartesian3(0.0, -1.0, 0.0),
            new Cartesian3(0.0, 0.0, 1.0),
            new Cartesian3(0.0, -1.0, 0.0)
        ];

        var rights = [
            new Cartesian3(0.0, 0.0, 1.0),
            new Cartesian3(1.0, 0.0, 0.0),
            new Cartesian3(-1.0, 0.0, 0.0),
            new Cartesian3(0.0, 0.0, -1.0),
            new Cartesian3(1.0, 0.0, 0.0),
            new Cartesian3(1.0, 0.0, 0.0)
        ];

        function computeOmnidirectional(shadowMap, frameState) {
            // All sides share the same frustum
            var frustum = new PerspectiveFrustum();
            frustum.fov = CesiumMath.PI_OVER_TWO;
            frustum.near = 1.0;
            frustum.far = shadowMap._pointLightRadius;
            frustum.aspectRatio = 1.0;

            for (var i = 0; i < 6; ++i) {
                var camera = shadowMap._passes[i].camera;
                camera.positionWC = shadowMap._shadowMapCamera.positionWC;
                camera.positionCartographic = frameState.mapProjection.ellipsoid.cartesianToCartographic(
                    camera.positionWC,
                    camera.positionCartographic
                );
                camera.directionWC = directions[i];
                camera.upWC = ups[i];
                camera.rightWC = rights[i];

                Matrix4.computeView(camera.positionWC, camera.directionWC, camera.upWC, camera.rightWC, camera.viewMatrix);
                Matrix4.inverse(camera.viewMatrix, camera.inverseViewMatrix);

                camera.frustum = frustum;
            }
        }

        var scratchCartesian1 = new Cartesian3();
        var scratchCartesian2 = new Cartesian3();
        var scratchBoundingSphere = new BoundingSphere();
        var scratchCenter = scratchBoundingSphere.center;

        function checkVisibility(shadowMap, frameState) {
            var sceneCamera = shadowMap._sceneCamera;
            var shadowMapCamera = shadowMap._shadowMapCamera;

            var boundingSphere = scratchBoundingSphere;

            // Check whether the shadow map is in view and needs to be updated
            if (shadowMap._cascadesEnabled) {
                // If the nearest shadow receiver is further than the shadow map's maximum distance then the shadow map is out of view.
                if (sceneCamera.frustum.near >= shadowMap.maximumDistance) {
                    shadowMap._outOfView = true;
                    shadowMap._needsUpdate = false;
                    return;
                }

                // If the light source is below the horizon then the shadow map is out of view
                var surfaceNormal = frameState.mapProjection.ellipsoid.geodeticSurfaceNormal(
                    sceneCamera.positionWC,
                    scratchCartesian1
                );
                var lightDirection = Cartesian3.negate(shadowMapCamera.directionWC, scratchCartesian2);
                var dot = Cartesian3.dot(surfaceNormal, lightDirection);

                // Shadows start to fade out once the light gets closer to the horizon.
                // At this point the globe uses vertex lighting alone to darken the surface.
                var darknessAmount = CesiumMath.clamp(dot / 0.1, 0.0, 1.0);
                shadowMap._darkness = CesiumMath.lerp(1.0, shadowMap.darkness, darknessAmount);

                if (dot < 0.0) {
                    shadowMap._outOfView = true;
                    shadowMap._needsUpdate = false;
                    return;
                }

                // By default cascaded shadows need to update and are always in view
                shadowMap._needsUpdate = true;
                shadowMap._outOfView = false;
            } else if (shadowMap._isPointLight) {
                // Sphere-frustum intersection test
                boundingSphere.center = shadowMapCamera.positionWC;
                boundingSphere.radius = shadowMap._pointLightRadius;
                shadowMap._outOfView = frameState.cullingVolume.computeVisibility(boundingSphere) === Intersect.OUTSIDE;
                shadowMap._needsUpdate = !shadowMap._outOfView && !shadowMap._boundingSphere.equals(boundingSphere);
                BoundingSphere.clone(boundingSphere, shadowMap._boundingSphere);
            } else {
                // Simplify frustum-frustum intersection test as a sphere-frustum test
                var frustumRadius = shadowMapCamera.frustum.far / 2.0;
                var frustumCenter = Cartesian3.add(
                    shadowMapCamera.positionWC,
                    Cartesian3.multiplyByScalar(shadowMapCamera.directionWC, frustumRadius, scratchCenter),
                    scratchCenter
                );
                boundingSphere.center = frustumCenter;
                boundingSphere.radius = frustumRadius;
                shadowMap._outOfView = frameState.cullingVolume.computeVisibility(boundingSphere) === Intersect.OUTSIDE;
                shadowMap._needsUpdate = !shadowMap._outOfView && !shadowMap._boundingSphere.equals(boundingSphere);
                BoundingSphere.clone(boundingSphere, shadowMap._boundingSphere);
            }
        }

        function updateCameras(shadowMap, frameState) {
            var camera = frameState.camera; // The actual camera in the scene
            var lightCamera = shadowMap._lightCamera; // The external camera representing the light source
            var sceneCamera = shadowMap._sceneCamera; // Clone of camera, with clamped near and far planes
            var shadowMapCamera = shadowMap._shadowMapCamera; // Camera representing the shadow volume, initially cloned from lightCamera

            // Clone light camera into the shadow map camera
            if (shadowMap._cascadesEnabled) {
                Cartesian3.clone(lightCamera.directionWC, shadowMapCamera.directionWC);
            } else if (shadowMap._isPointLight) {
                Cartesian3.clone(lightCamera.positionWC, shadowMapCamera.positionWC);
            } else {
                shadowMapCamera.clone(lightCamera);
            }

            // Get the light direction in eye coordinates
            var lightDirection = shadowMap._lightDirectionEC;
            Matrix4.multiplyByPointAsVector(camera.viewMatrix, shadowMapCamera.directionWC, lightDirection);
            Cartesian3.normalize(lightDirection, lightDirection);
            Cartesian3.negate(lightDirection, lightDirection);

            // Get the light position in eye coordinates
            Matrix4.multiplyByPoint(camera.viewMatrix, shadowMapCamera.positionWC, shadowMap._lightPositionEC);
            shadowMap._lightPositionEC.w = shadowMap._pointLightRadius;

            // Get the near and far of the scene camera
            var near;
            var far;
            if (shadowMap.isViewShed) {
                near = lightCamera.frustum.near;
                far = lightCamera.frustum.far;
            } else if (shadowMap._fitNearFar) {
                // shadowFar can be very large, so limit to shadowMap.maximumDistance
                // Push the far plane slightly further than the near plane to avoid degenerate frustum
                near = Math.min(frameState.shadowState.nearPlane, shadowMap.maximumDistance);
                far = Math.min(frameState.shadowState.farPlane, shadowMap.maximumDistance + 1.0);
            } else {
                near = camera.frustum.near;
                far = shadowMap.maximumDistance;
            }

            shadowMap._sceneCamera = Camera.clone(camera, sceneCamera);
            camera.frustum.clone(shadowMap._sceneCamera.frustum);
            shadowMap._sceneCamera.frustum.near = near;
            shadowMap._sceneCamera.frustum.far = far;
            shadowMap._distance = far - near;

            checkVisibility(shadowMap, frameState);

            if (!shadowMap._outOfViewPrevious && shadowMap._outOfView) {
                shadowMap._needsUpdate = true;
            }
            shadowMap._outOfViewPrevious = shadowMap._outOfView;
        }

        /**
         * @private
         */
        ViewshedMap.prototype.update = function (frameState) {
            updateCameras(this, frameState);

            if (this._needsUpdate) {
                updateFramebuffer(this, frameState.context);

                if (this._isPointLight) {
                    computeOmnidirectional(this, frameState);
                }

                if (this._cascadesEnabled) {
                    fitShadowMapToScene(this, frameState);

                    if (this._numberOfCascades > 1) {
                        computeCascades(this, frameState);
                    }
                }

                if (!this._isPointLight) {
                    // Compute the culling volume
                    var shadowMapCamera = this._shadowMapCamera;
                    var position = shadowMapCamera.positionWC;
                    var direction = shadowMapCamera.directionWC;
                    var up = shadowMapCamera.upWC;
                    this._shadowMapCullingVolume = shadowMapCamera.frustum.computeCullingVolume(position, direction, up);

                    if (this._passes.length === 1) {
                        // Since there is only one pass, use the shadow map camera as the pass camera.
                        this._passes[0].camera.clone(shadowMapCamera);
                    }
                } else {
                    this._shadowMapCullingVolume = CullingVolume.fromBoundingSphere(this._boundingSphere);
                }
            }

            if (this._passes.length === 1) {
                // Transforms from eye space to shadow texture space.
                // Always requires an update since the scene camera constantly changes.
                var inverseView = this._sceneCamera.inverseViewMatrix;
                Matrix4.multiply(this._shadowMapCamera.getViewProjection(), inverseView, this._shadowMapMatrix);
            }

        };

        /**
         * @private
         */
        ViewshedMap.prototype.updatePass = function (context, shadowPass) {
            clearFramebuffer(this, context, shadowPass);
        };

        var scratchTexelStepSize = new Cartesian2();

        function combineUniforms(shadowMap, uniforms, isTerrain) {
            var bias = shadowMap._isPointLight ?
                shadowMap._pointBias :
                isTerrain ?
                    shadowMap._terrainBias :
                    shadowMap._primitiveBias;

            var mapUniforms = {
                shadowMap_texture: function () {
                    return shadowMap._shadowMapTexture;
                },
                shadowMap_textureCube: function () {
                    return shadowMap._shadowMapTexture;
                },
                shadowMap_matrix: function () {
                    return shadowMap._shadowMapMatrix;
                },
                shadowMap_cascadeSplits: function () {
                    return shadowMap._cascadeSplits;
                },
                shadowMap_cascadeMatrices: function () {
                    return shadowMap._cascadeMatrices;
                },
                shadowMap_lightDirectionEC: function () {
                    return shadowMap._lightDirectionEC;
                },
                shadowMap_lightPositionEC: function () {
                    return shadowMap._lightPositionEC;
                },
                shadowMap_cascadeDistances: function () {
                    return shadowMap._cascadeDistances;
                },
                shadowMap_texelSizeDepthBiasAndNormalShadingSmooth: function () {
                    var texelStepSize = scratchTexelStepSize;
                    texelStepSize.x = 1.0 / shadowMap._textureSize.x;
                    texelStepSize.y = 1.0 / shadowMap._textureSize.y;

                    return Cartesian4.fromElements(
                        texelStepSize.x,
                        texelStepSize.y,
                        bias.depthBias,
                        bias.normalShadingSmooth,
                        this.combinedUniforms1
                    );
                },
                shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness: function () {
                    return Cartesian4.fromElements(
                        bias.normalOffsetScale,
                        shadowMap._distance,
                        shadowMap.maximumDistance,
                        shadowMap._darkness,
                        this.combinedUniforms2
                    );
                },

                combinedUniforms1: new Cartesian4(),
                combinedUniforms2: new Cartesian4()
            };

            return combine(uniforms, mapUniforms, false);
        }

        function getShadowReceiveShaderKeyword(shadowMap, castShadows, isTerrain, hasTerrainNormal) {
            var usesDepthTexture = shadowMap._usesDepthTexture;
            var polygonOffsetSupported = shadowMap._polygonOffsetSupported;
            var isPointLight = shadowMap._isPointLight;
            var isSpotLight = shadowMap._isSpotLight;
            var hasCascades = shadowMap._numberOfCascades > 1;
            var debugCascadeColors = shadowMap.debugCascadeColors;
            var softShadows = shadowMap.softShadows;

            return (
                "view receiveShadow " +
                usesDepthTexture +
                polygonOffsetSupported +
                isPointLight +
                isSpotLight +
                hasCascades +
                debugCascadeColors +
                softShadows +
                castShadows +
                isTerrain +
                hasTerrainNormal
            );
        }

        function createShadowReceiveFragmentShader(fs, shadowMap, castShadows, isTerrain, hasTerrainNormal) {
            var normalVaryingName = ShaderSource.findNormalVarying(fs);
            var hasNormalVarying = (!isTerrain && defined(normalVaryingName)) || (isTerrain && hasTerrainNormal);

            var positionVaryingName = ShaderSource.findPositionVarying(fs);
            var hasPositionVarying = defined(positionVaryingName);

            var usesDepthTexture = shadowMap._usesDepthTexture;
            var polygonOffsetSupported = shadowMap._polygonOffsetSupported;
            var isPointLight = shadowMap._isPointLight;
            var isSpotLight = shadowMap._isSpotLight;
            var hasCascades = shadowMap._numberOfCascades > 1;
            var debugCascadeColors = shadowMap.debugCascadeColors;
            var softShadows = shadowMap.softShadows;
            var bias = isPointLight ? shadowMap._pointBias : isTerrain ? shadowMap._terrainBias : shadowMap._primitiveBias;

            var defines = fs.defines.slice(0);
            var sources = fs.sources.slice(0);

            var length = sources.length;
            for (var i = 0; i < length; ++i) {
                sources[i] = ShaderSource.replaceMain(sources[i], "czm_shadow_receive_main");
            }

            if (isPointLight) {
                defines.push("USE_CUBE_MAP_SHADOW");
            } else if (usesDepthTexture) {
                defines.push("USE_SHADOW_DEPTH_TEXTURE");
            }

            if (softShadows && !isPointLight) {
                defines.push("USE_SOFT_SHADOWS");
            }

            // Enable day-night shading so that the globe is dark when the light is below the horizon
            if (hasCascades && castShadows && isTerrain) {
                if (hasNormalVarying) {
                    defines.push("ENABLE_VERTEX_LIGHTING");
                } else {
                    defines.push("ENABLE_DAYNIGHT_SHADING");
                }
            }

            if (castShadows && bias.normalShading && hasNormalVarying) {
                defines.push("USE_NORMAL_SHADING");
                if (bias.normalShadingSmooth > 0.0) {
                    defines.push("USE_NORMAL_SHADING_SMOOTH");
                }
            }

            var fsSource = "";

            if (isPointLight) {
                fsSource += "uniform samplerCube shadowMap_textureCube; \n";
            } else {
                fsSource += "uniform sampler2D shadowMap_texture; \n";
            }

            var returnPositionEC;
            if (hasPositionVarying) {
                returnPositionEC = "    return vec4(" + positionVaryingName + ", 1.0); \n";
            } else {
                returnPositionEC =
                    "#ifndef LOG_DEPTH \n" +
                    "    return czm_windowToEyeCoordinates(gl_FragCoord); \n" +
                    "#else \n" +
                    "    return vec4(v_logPositionEC, 1.0); \n" +
                    "#endif \n";
            }

            fsSource +=
                "uniform mat4 shadowMap_matrix; \n" +
                "uniform vec3 shadowMap_lightDirectionEC; \n" +
                "uniform vec4 shadowMap_lightPositionEC; \n" +
                "uniform vec4 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness; \n" +
                "uniform vec4 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth; \n" +
                "#ifdef LOG_DEPTH \n" +
                "in vec3 v_logPositionEC; \n" +
                "#endif \n" +
                "vec4 getPositionEC() \n" +
                "{ \n" +
                returnPositionEC +
                "} \n" +
                "vec3 getNormalEC() \n" +
                "{ \n" +
                (hasNormalVarying ? "    return normalize(" + normalVaryingName + "); \n" : "    return vec3(1.0); \n") +
                "} \n" +
                // Offset the shadow position in the direction of the normal for perpendicular and back faces
                "void applyNormalOffset(inout vec4 positionEC, vec3 normalEC, float nDotL) \n" +
                "{ \n" +
                (bias.normalOffset && hasNormalVarying ?
                    "    float normalOffset = shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.x; \n" +
                    "    float normalOffsetScale = 1.0 - nDotL; \n" +
                    "    vec3 offset = normalOffset * normalOffsetScale * normalEC; \n" +
                    "    positionEC.xyz += offset; \n" :
                    "") +
                "} \n";

            fsSource +=
                "void main() \n" +
                "{ \n" +
                "    czm_shadow_receive_main(); \n" +
                "    vec4 positionEC = getPositionEC(); \n" +
                "    vec3 normalEC = getNormalEC(); \n" +
                "    float depth = -positionEC.z; \n";

            fsSource +=
                "    czm_shadowParameters shadowParameters; \n" +
                "    shadowParameters.texelStepSize = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.xy; \n" +
                "    shadowParameters.depthBias = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.z; \n" +
                "    shadowParameters.normalShadingSmooth = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.w; \n" +
                "    shadowParameters.darkness = shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.w; \n";

            if (isTerrain) {
                // Scale depth bias based on view distance to reduce z-fighting in distant terrain
                fsSource += "    shadowParameters.depthBias *= max(depth * 0.01, 1.0); \n";
            } else if (!polygonOffsetSupported) {
                // If polygon offset isn't supported push the depth back based on view, however this
                // causes light leaking at further away views
                fsSource += "    shadowParameters.depthBias *= mix(1.0, 100.0, depth * 0.0015); \n";
            }

            if (isPointLight) {
                fsSource +=
                    "    vec3 directionEC = positionEC.xyz - shadowMap_lightPositionEC.xyz; \n" +
                    "    float distance = length(directionEC); \n" +
                    "    directionEC = normalize(directionEC); \n" +
                    "    float radius = shadowMap_lightPositionEC.w; \n" +
                    "    // Stop early if the fragment is beyond the point light radius \n" +
                    "    if (distance > radius) \n" +
                    "    { \n" +
                    "        return; \n" +
                    "    } \n" +
                    "    vec3 directionWC  = czm_inverseViewRotation * directionEC; \n" +
                    "    shadowParameters.depth = distance / radius; \n" +
                    "    shadowParameters.nDotL = clamp(dot(normalEC, -directionEC), 0.0, 1.0); \n" +
                    "    shadowParameters.texCoords = directionWC; \n" +
                    "    float visibility = czm_shadowVisibility(shadowMap_textureCube, shadowParameters); \n";
            } else if (isSpotLight) {
                fsSource +=
                    "    vec3 directionEC1 = positionEC.xyz - shadowMap_lightPositionEC.xyz; \n" +
                    "    float distance = length(directionEC1); \n" +
                    "    if (distance > shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.y) \n" +
                    "    { \n" +
                    "        return; \n" +
                    "    } \n" +
                    "    vec3 directionEC = normalize(positionEC.xyz - shadowMap_lightPositionEC.xyz); \n" +
                    "    float nDotL = clamp(dot(normalEC, -directionEC), 0.0, 1.0); \n" +
                    "    applyNormalOffset(positionEC, normalEC, nDotL); \n" +
                    "    vec4 shadowPosition = shadowMap_matrix * positionEC; \n" +
                    "    // Spot light uses a perspective projection, so perform the perspective divide \n" +
                    "    shadowPosition /= shadowPosition.w; \n" +
                    "    // Stop early if the fragment is not in the shadow bounds \n" +
                    "    if (any(lessThan(shadowPosition.xyz, vec3(0.0))) || any(greaterThan(shadowPosition.xyz, vec3(1.0)))) \n" +
                    "    { \n" +
                    "        return; \n" +
                    "    } \n" +
                    "    shadowParameters.texCoords = shadowPosition.xy; \n" +
                    "    shadowParameters.depth = shadowPosition.z; \n" +
                    "    shadowParameters.nDotL = nDotL; \n" +
                    "    float visibility = czm_shadowVisibility(shadowMap_texture, shadowParameters); \n";
            } else if (hasCascades) {
                fsSource +=
                    "    float maxDepth = shadowMap_cascadeSplits[1].w; \n" +
                    "    // Stop early if the eye depth exceeds the last cascade \n" +
                    "    if (depth > maxDepth) \n" +
                    "    { \n" +
                    "        return; \n" +
                    "    } \n" +
                    "    // Get the cascade based on the eye-space depth \n" +
                    "    vec4 weights = czm_cascadeWeights(depth); \n" +
                    "    // Apply normal offset \n" +
                    "    float nDotL = clamp(dot(normalEC, shadowMap_lightDirectionEC), 0.0, 1.0); \n" +
                    "    applyNormalOffset(positionEC, normalEC, nDotL); \n" +
                    "    // Transform position into the cascade \n" +
                    "    vec4 shadowPosition = czm_cascadeMatrix(weights) * positionEC; \n" +
                    "    // Get visibility \n" +
                    "    shadowParameters.texCoords = shadowPosition.xy; \n" +
                    "    shadowParameters.depth = shadowPosition.z; \n" +
                    "    shadowParameters.nDotL = nDotL; \n" +
                    "    float visibility = czm_shadowVisibility(shadowMap_texture, shadowParameters); \n" +
                    "    // Fade out shadows that are far away \n" +
                    "    float shadowMapMaximumDistance = shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.z; \n" +
                    "    float fade = max((depth - shadowMapMaximumDistance * 0.8) / (shadowMapMaximumDistance * 0.2), 0.0); \n" +
                    "    visibility = mix(visibility, 1.0, fade); \n" +
                    (debugCascadeColors ?
                        "    // Draw cascade colors for debugging \n" + "    out_FragColor *= czm_cascadeColor(weights); \n" :
                        "");
            } else {
                fsSource +=
                    "    float nDotL = clamp(dot(normalEC, shadowMap_lightDirectionEC), 0.0, 1.0); \n" +
                    "    applyNormalOffset(positionEC, normalEC, nDotL); \n" +
                    "    vec4 shadowPosition = shadowMap_matrix * positionEC; \n" +
                    "    // Stop early if the fragment is not in the shadow bounds \n" +
                    "    if (any(lessThan(shadowPosition.xyz, vec3(0.0))) || any(greaterThan(shadowPosition.xyz, vec3(1.0)))) \n" +
                    "    { \n" +
                    "        return; \n" +
                    "    } \n" +
                    "    shadowParameters.texCoords = shadowPosition.xy; \n" +
                    "    shadowParameters.depth = shadowPosition.z; \n" +
                    "    shadowParameters.nDotL = nDotL; \n" +
                    "    float visibility = czm_shadowVisibility(shadowMap_texture, shadowParameters); \n";
            }

            fsSource +=
                "   if(visibility==0.0) \n" +
                "   {\n" +
                "        out_FragColor.rgb *= vec3(0.8,0.0,0.0);\n" +
                "   }else{\n" +
                "        out_FragColor.rgb *= vec3(0.0,0.8,0.0) * visibility;\n" +
                "   } \n " +
                "} \n ";

            sources.push(fsSource);

            return new ShaderSource({
                defines: defines,
                sources: sources
            });
        }

        Cesium.ShadowMap.createReceiveDerivedCommand = function (lightShadowMaps, command, shadowsDirty, context, result) {
            if (!defined(result)) {
                result = {};
            }

            var lightShadowMapsEnabled = lightShadowMaps.length > 0;
            var shaderProgram = command.shaderProgram;
            var vertexShaderSource = shaderProgram.vertexShaderSource;
            var fragmentShaderSource = shaderProgram.fragmentShaderSource;
            var isTerrain = command.pass === Pass.GLOBE;

            var hasTerrainNormal = false;
            if (isTerrain) {
                hasTerrainNormal = command.owner.data.renderedMesh.encoding.hasVertexNormals;
            }

            if (command.receiveShadows && lightShadowMapsEnabled) {
                // Only generate a receiveCommand if there is a shadow map originating from a light source.
                var receiveShader;
                var receiveUniformMap;
                if (defined(result.receiveCommand)) {
                    receiveShader = result.receiveCommand.shaderProgram;
                    receiveUniformMap = result.receiveCommand.uniformMap;
                }

                result.receiveCommand = DrawCommand.shallowClone(command, result.receiveCommand);
                result.castShadows = false;
                result.receiveShadows = true;

                // If castShadows changed, recompile the receive shadows shader. The normal shading technique simulates
                // self-shadowing so it should be turned off if castShadows is false.
                var castShadowsDirty = result.receiveShaderCastShadows !== command.castShadows;
                var shaderDirty = result.receiveShaderProgramId !== command.shaderProgram.id;

                if (!defined(receiveShader) || shaderDirty || shadowsDirty || castShadowsDirty) {
                    var keyword;
                    if (lightShadowMaps[0].isViewShed) {
                        keyword = getShadowReceiveShaderKeyword(
                            lightShadowMaps[0],
                            command.castShadows,
                            isTerrain,
                            hasTerrainNormal
                        );
                    } else {
                        keyword = ShadowMapShader.getShadowReceiveShaderKeyword(
                            lightShadowMaps[0],
                            command.castShadows,
                            isTerrain,
                            hasTerrainNormal
                        );
                    }
                    receiveShader = context.shaderCache.getDerivedShaderProgram(shaderProgram, keyword);
                    if (!defined(receiveShader)) {
                        var receiveVS = ShadowMapShader.createShadowReceiveVertexShader(
                            vertexShaderSource,
                            isTerrain,
                            hasTerrainNormal
                        );
                        var receiveFS;
                        if (lightShadowMaps[0].isViewShed) {
                            receiveFS = createShadowReceiveFragmentShader(
                                fragmentShaderSource,
                                lightShadowMaps[0],
                                command.castShadows,
                                isTerrain,
                                hasTerrainNormal
                            );
                        } else {
                            receiveFS = ShadowMapShader.createShadowReceiveFragmentShader(
                                fragmentShaderSource,
                                lightShadowMaps[0],
                                command.castShadows,
                                isTerrain,
                                hasTerrainNormal
                            );
                        }

                        receiveShader = context.shaderCache.createDerivedShaderProgram(shaderProgram, keyword, {
                            vertexShaderSource: receiveVS,
                            fragmentShaderSource: receiveFS,
                            attributeLocations: shaderProgram._attributeLocations
                        });
                    }

                    receiveUniformMap = combineUniforms(lightShadowMaps[0], command.uniformMap, isTerrain);
                }

                result.receiveCommand.shaderProgram = receiveShader;
                result.receiveCommand.uniformMap = receiveUniformMap;
                result.receiveShaderProgramId = command.shaderProgram.id;
                result.receiveShaderCastShadows = command.castShadows;
            }

            return result;
        };

        /**
         * @private
         */
        ViewshedMap.prototype.isDestroyed = function () {
            return false;
        };

        /**
         * @private
         */
        ViewshedMap.prototype.destroy = function () {
            destroyFramebuffer(this);
            return destroyObject(this);
        };
        return ViewshedMap;
    })();

    const RectangularSensorPrimitive = (function () {
        const sensorVS = "in vec4 position;\nin vec3 normal;\n\nout vec3 v_position;\nout vec3 v_positionWC;\nout vec3 v_positionEC;\nout vec3 v_normalEC;\n\nvoid main()\n{\n  gl_Position = czm_modelViewProjection * position;\n  v_position = vec3(position);\n  v_positionWC = (czm_model * position).xyz;\n  v_positionEC = (czm_modelView * position).xyz;\n  v_normalEC = czm_normal * normal;\n}";
        const sensorComm = "struct czm_ellipsoid\n{\n    vec3 center;\n    vec3 radii;\n    vec3 inverseRadii;\n    vec3 inverseRadiiSquared;\n};\n\nczm_ellipsoid czm_getWgs84EllipsoidEC()\n{\n    vec3 radii = vec3(6378137.0, 6378137.0, 6356752.314245);\n    vec3 inverseRadii = vec3(1.0 / radii.x, 1.0 / radii.y, 1.0 / radii.z);\n    vec3 inverseRadiiSquared = inverseRadii * inverseRadii;\n    czm_ellipsoid temp = czm_ellipsoid(czm_view[3].xyz, radii, inverseRadii, inverseRadiiSquared);\n    return temp;\n}\n\n\nuniform vec4 u_intersectionColor;\nuniform float u_intersectionWidth;\nuniform vec4 u_lineColor;\nbool inSensorShadow(vec3 coneVertexWC, czm_ellipsoid ellipsoidEC, vec3 pointWC)\n{\n  // Diagonal matrix from the unscaled ellipsoid space to the scaled space.\n  vec3 D = ellipsoidEC.inverseRadii;\n\n  // Sensor vertex in the scaled ellipsoid space\n  vec3 q = D * coneVertexWC;\n  float qMagnitudeSquared = dot(q, q);\n  float test = qMagnitudeSquared - 1.0;\n\n  // Sensor vertex to fragment vector in the ellipsoid's scaled space\n  vec3 temp = D * pointWC - q;\n  float d = dot(temp, q);\n\n  // Behind silhouette plane and inside silhouette cone\n  return (d < -test) && (d / length(temp) < -sqrt(test));\n}\n\n///////////////////////////////////////////////////////////////////////////////\n\nvec4 getLineColor()\n{\n  return u_lineColor;\n}\n\nvec4 getIntersectionColor()\n{\n  return u_intersectionColor;\n}\n\nfloat getIntersectionWidth()\n{\n  return u_intersectionWidth;\n}\n\nvec2 sensor2dTextureCoordinates(float sensorRadius, vec3 pointMC)\n{\n  // (s, t) both in the range [0, 1]\n  float t = pointMC.z / sensorRadius;\n  float s = 1.0 + (atan(pointMC.y, pointMC.x) / czm_twoPi);\n  s = s - floor(s);\n\n  return vec2(s, t);\n}";
        const sensorFS = "\n#ifdef GL_OES_standard_derivatives\n  #extension GL_OES_standard_derivatives : enable\n#endif\n\nuniform bool u_showIntersection;\nuniform bool u_showThroughEllipsoid;\n\nuniform float u_radius;\nuniform float u_xHalfAngle;\nuniform float u_yHalfAngle;\nuniform float u_normalDirection;\nuniform float u_type;\n\nin vec3 v_position;\nin vec3 v_positionWC;\nin vec3 v_positionEC;\nin vec3 v_normalEC;\n\nvec4 getColor(float sensorRadius, vec3 pointEC)\n{\n  czm_materialInput materialInput;\n\n  vec3 pointMC = (czm_inverseModelView * vec4(pointEC, 1.0)).xyz;\n  materialInput.st = sensor2dTextureCoordinates(sensorRadius, pointMC);\n  materialInput.str = pointMC / sensorRadius;\n\n  vec3 positionToEyeEC = -v_positionEC;\n  materialInput.positionToEyeEC = positionToEyeEC;\n\n  vec3 normalEC = normalize(v_normalEC);\n  materialInput.normalEC = u_normalDirection * normalEC;\n\n  czm_material material = czm_getMaterial(materialInput);\n\n  return vec4(material.diffuse, material.alpha);\n\n}\n\nbool isOnBoundary(float value, float epsilon)\n{\n  float width = getIntersectionWidth();\n  float tolerance = width * epsilon;\n\n#ifdef GL_OES_standard_derivatives\n  float delta = max(abs(dFdx(value)), abs(dFdy(value)));\n  float pixels = width * delta;\n  float temp = abs(value);\n  // There are a couple things going on here.\n  // First we test the value at the current fragment to see if it is within the tolerance.\n  // We also want to check if the value of an adjacent pixel is within the tolerance,\n  // but we don't want to admit points that are obviously not on the surface.\n  // For example, if we are looking for \"value\" to be close to 0, but value is 1 and the adjacent value is 2,\n  // then the delta would be 1 and \"temp - delta\" would be \"1 - 1\" which is zero even though neither of\n  // the points is close to zero.\n  return temp < tolerance && temp < pixels || (delta < 10.0 * tolerance && temp - delta < tolerance && temp < pixels);\n#else\n  return abs(value) < tolerance;\n#endif\n}\n\nvec4 shade(bool isOnBoundary)\n{\n  if (u_showIntersection && isOnBoundary)\n  {\n      return getIntersectionColor();\n  }\n  if(u_type == 1.0){\n      return getLineColor();\n  }\n  return getColor(u_radius, v_positionEC);\n}\n\nfloat ellipsoidSurfaceFunction(czm_ellipsoid ellipsoid, vec3 point)\n{\n  vec3 scaled = ellipsoid.inverseRadii * point;\n  return dot(scaled, scaled) - 1.0;\n}\n\nvoid main()\n{\n  vec3 sensorVertexWC = czm_model[3].xyz;      // (0.0, 0.0, 0.0) in model coordinates\n  vec3 sensorVertexEC = czm_modelView[3].xyz;  // (0.0, 0.0, 0.0) in model coordinates\n\n  //vec3 pixDir = normalize(v_position);\n  float positionX = v_position.x;\n  float positionY = v_position.y;\n  float positionZ = v_position.z;\n\n  vec3 zDir = vec3(0.0, 0.0, 1.0);\n  vec3 lineX = vec3(positionX, 0 ,positionZ);\n  vec3 lineY = vec3(0, positionY, positionZ);\n  float resX = dot(normalize(lineX), zDir);\n  if(resX < cos(u_xHalfAngle)-0.00001){\n      discard;\n  }\n  float resY = dot(normalize(lineY), zDir);\n  if(resY < cos(u_yHalfAngle)-0.00001){\n      discard;\n  }\n\n\n  czm_ellipsoid ellipsoid = czm_getWgs84EllipsoidEC();\n  float ellipsoidValue = ellipsoidSurfaceFunction(ellipsoid, v_positionWC);\n\n  // Occluded by the ellipsoid?\nif (!u_showThroughEllipsoid)\n{\n    // Discard if in the ellipsoid\n    // PERFORMANCE_IDEA: A coarse check for ellipsoid intersection could be done on the CPU first.\n    if (ellipsoidValue < 0.0)\n    {\n          discard;\n    }\n\n    // Discard if in the sensor's shadow\n    if (inSensorShadow(sensorVertexWC, ellipsoid, v_positionWC))\n    {\n        discard;\n    }\n  }\n\n  // Notes: Each surface functions should have an associated tolerance based on the floating point error.\n  bool isOnEllipsoid = isOnBoundary(ellipsoidValue, czm_epsilon3);\n  //isOnEllipsoid = false;\n  //if((resX >= 0.8 && resX <= 0.81)||(resY >= 0.8 && resY <= 0.81)){\n  /*if(false){\n      out_FragColor = vec4(1.0,0.0,0.0,1.0);\n  }else{\n      out_FragColor = shade(isOnEllipsoid);\n  }\n*/\n  out_FragColor = shade(isOnEllipsoid);\n\n}";
        const scanPlaneFS = "#ifdef GL_OES_standard_derivatives\n  #extension GL_OES_standard_derivatives : enable\n#endif\n\nuniform bool u_showIntersection;\nuniform bool u_showThroughEllipsoid;\n\nuniform float u_radius;\nuniform float u_xHalfAngle;\nuniform float u_yHalfAngle;\nuniform float u_normalDirection;\nuniform vec4 u_color;\n\nin vec3 v_position;\nin vec3 v_positionWC;\nin vec3 v_positionEC;\nin vec3 v_normalEC;\n\nvec4 getColor(float sensorRadius, vec3 pointEC)\n{\n  czm_materialInput materialInput;\n\n  vec3 pointMC = (czm_inverseModelView * vec4(pointEC, 1.0)).xyz;\n  materialInput.st = sensor2dTextureCoordinates(sensorRadius, pointMC);\n  materialInput.str = pointMC / sensorRadius;\n\n  vec3 positionToEyeEC = -v_positionEC;\n  materialInput.positionToEyeEC = positionToEyeEC;\n\n  vec3 normalEC = normalize(v_normalEC);\n  materialInput.normalEC = u_normalDirection * normalEC;\n\n  czm_material material = czm_getMaterial(materialInput);\n\n  material.diffuse = u_color.rgb;\n  material.alpha = u_color.a;\n\n  return vec4(material.diffuse, material.alpha);\n\n}\n\nbool isOnBoundary(float value, float epsilon)\n{\n  float width = getIntersectionWidth();\n  float tolerance = width * epsilon;\n\n#ifdef GL_OES_standard_derivatives\n  float delta = max(abs(dFdx(value)), abs(dFdy(value)));\n  float pixels = width * delta;\n  float temp = abs(value);\n  // There are a couple things going on here.\n  // First we test the value at the current fragment to see if it is within the tolerance.\n  // We also want to check if the value of an adjacent pixel is within the tolerance,\n  // but we don't want to admit points that are obviously not on the surface.\n  // For example, if we are looking for \"value\" to be close to 0, but value is 1 and the adjacent value is 2,\n  // then the delta would be 1 and \"temp - delta\" would be \"1 - 1\" which is zero even though neither of\n  // the points is close to zero.\n  return temp < tolerance && temp < pixels || (delta < 10.0 * tolerance && temp - delta < tolerance && temp < pixels);\n#else\n  return abs(value) < tolerance;\n#endif\n}\n\nvec4 shade(bool isOnBoundary)\n{\n  if (u_showIntersection && isOnBoundary)\n  {\n      return getIntersectionColor();\n  }\n  return getColor(u_radius, v_positionEC);\n}\n\nfloat ellipsoidSurfaceFunction(czm_ellipsoid ellipsoid, vec3 point)\n{\n  vec3 scaled = ellipsoid.inverseRadii * point;\n  return dot(scaled, scaled) - 1.0;\n}\n\nvoid main()\n{\n  vec3 sensorVertexWC = czm_model[3].xyz;      // (0.0, 0.0, 0.0) in model coordinates\n  vec3 sensorVertexEC = czm_modelView[3].xyz;  // (0.0, 0.0, 0.0) in model coordinates\n\n  //vec3 pixDir = normalize(v_position);\n  float positionX = v_position.x;\n  float positionY = v_position.y;\n  float positionZ = v_position.z;\n\n  vec3 zDir = vec3(0.0, 0.0, 1.0);\n  vec3 lineX = vec3(positionX, 0 ,positionZ);\n  vec3 lineY = vec3(0, positionY, positionZ);\n  float resX = dot(normalize(lineX), zDir);\n  if(resX < cos(u_xHalfAngle) - 0.0001){\n      discard;\n  }\n  float resY = dot(normalize(lineY), zDir);\n  if(resY < cos(u_yHalfAngle)- 0.0001){\n      discard;\n  }\n\n\n  czm_ellipsoid ellipsoid = czm_getWgs84EllipsoidEC();\n  float ellipsoidValue = ellipsoidSurfaceFunction(ellipsoid, v_positionWC);\n\n  // Occluded by the ellipsoid?\nif (!u_showThroughEllipsoid)\n{\n    // Discard if in the ellipsoid\n    // PERFORMANCE_IDEA: A coarse check for ellipsoid intersection could be done on the CPU first.\n    if (ellipsoidValue < 0.0)\n    {\n          discard;\n    }\n\n    // Discard if in the sensor's shadow\n    if (inSensorShadow(sensorVertexWC, ellipsoid, v_positionWC))\n    {\n        discard;\n    }\n  }\n\n  // Notes: Each surface functions should have an associated tolerance based on the floating point error.\n  bool isOnEllipsoid = isOnBoundary(ellipsoidValue, czm_epsilon3);\n  out_FragColor = shade(isOnEllipsoid);\n\n}";
        const {
            Matrix4,
            Material,
            Color,
            JulianDate,
            BoundingSphere,
            DrawCommand,
            PrimitiveType,
            SceneMode,
            Matrix3,
            Buffer,
            BufferUsage,
            VertexArray,
            VertexFormat,
            ComponentDatatype,
            RenderState,
            BlendingState,
            Pass,
            combine,
            CullFace,
            Cartesian3,
            EllipsoidGeometry,
            EllipsoidOutlineGeometry,
            ShaderSource,
            ShaderProgram,
        } = Cesium;
        const {
            cos,
            sin,
            tan,
            atan
        } = Math;
        const CesiumMath = Cesium.Math;

        const attributeLocations = {
            position: 0,
            normal: 1
        };

        class RectangularSensorPrimitive {
            /**
             * 模拟相控阵雷达。
             * @param {Object} options 具有以下属性
             * @param {Boolean} [options.show] 是否显示
             * @param {Cartesian3|LonLat} [options.position] 图形位置
             * @param {Matrix4} [options.modelMatrix] 模型矩阵,如果定义，则覆盖position属性
             * @param {Number} [options.slice=32] 切分程度
             * @param {Number} [options.radius=1] 半径
             * @param {Color} [options.lineColor=Color.RED] 线的颜色
             * @param {Number} [options.xHalfAngle] 水平半夹角,单位度
             * @param {Number} [options.xyHalfAngle] 垂直半夹角，单位度
             * @param {Boolean} [options.showSectorLines=true] 是否显示扇面线
             * @param {Boolean} [options.showSectorSegmentLines=true] 是否显示扇面和圆顶面连接线
             * @param {Boolean} [options.showLateralSurfaces=true] 是否显示侧面
             * @param {Material} [options.material=Material.ColorType] 材质
             * @param {Material} [options.lateralSurfaceMaterial=Material.ColorType] 侧面材质
             * @param {Boolean} [options.showDomeSurfaces=true] 是否显示圆弧顶表面
             * @param {Material} [options.domeSurfaceMaterial=Material.ColorType] 圆弧顶表面材质
             * @param {Boolean} [options.showDomeLines=true] 是否显示圆弧顶表面线
             * @param {Boolean} [options.showIntersection = false] 是否显示与地球相交的线
             * @param {Color} [options.intersectionColor] 与地球相交的线的颜色
             * @param {Number} [options.intersectionWidth=5] 与地球相交的线的宽度
             * @param {Boolean} [options.showThroughEllipsoid=false] 是否穿过地球
             * @param {Boolean} [options.showScanPlane=true] 是否显示扫描面
             * @param {Color} [options.scanPlaneColor=Color.WHITE] 扫描面颜色
             * @param {String} [options.scanPlaneMode='H'] 扫描方向，H表示水平扫描，V表示垂直扫描
             * @param {Number} [options.speed=10] 扫描速度，值越大，扫描越快
             */
            constructor(options) {
                options = defaultValue(options, defaultValue.EMPTY_OBJECT);
                const self = this;
                this._createVS = true;
                this._createRS = true;
                this._createSP = true;
                /**
                 * 是否显示
                 * @type {Boolean}
                 */
                this.show = defaultValue(options.show, true);

                //切分程度
                this.slice = defaultValue(options.slice, 32);

                //传感器的模型矩阵
                if (!options.modelMatrix) {
                    if (!options.position) {
                        throw new ViewshedError('parameter position or modelMatrix must be provided.')
                    }
                    this._modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(LonLat.toCartesian(options.position));
                } else {
                    this._modelMatrix = Matrix4.clone(options.modelMatrix, new Matrix4());
                }

                this._computedModelMatrix = new Matrix4();
                this._computedScanPlaneModelMatrix = new Matrix4();

                //传感器的半径
                this._radius = defaultValue(options.radius, Number.POSITIVE_INFINITY);

                //传感器水平半角
                this._xHalfAngle = CesiumMath.toRadians(defaultValue(options.xHalfAngle, 0));

                //传感器垂直半角
                this._yHalfAngle = CesiumMath.toRadians(defaultValue(options.yHalfAngle, 0));

                this._color = defaultValue(options._color, Color.AQUA.withAlpha(0.4));

                /**
                 * 线的颜色
                 * @type {Cesium.Color}
                 */
                this.lineColor = defaultValue(options.lineColor, Color.WHITE);

                /**
                 * 是否显示扇面的线
                 * @type {Boolean}
                 */
                this.showSectorLines = defaultValue(options.showSectorLines, true);

                /**
                 * 是否显示扇面和圆顶面连接的线
                 * @type {Boolean}
                 */
                this.showSectorSegmentLines = defaultValue(options.showSectorSegmentLines, true);

                /**
                 * 是否显示侧面
                 * @type {Boolean}
                 */
                this.showLateralSurfaces = defaultValue(options.showLateralSurfaces, true);

                //目前用的统一材质
                this._material = defined(options.material) ? options.material : Material.fromType(Material.ColorType);
                this._material.uniforms.color = this._color;
                this._translucent = undefined;

                /**
                 * 侧面材质
                 * @type {Material}
                 */
                this.lateralSurfaceMaterial = defined(options.lateralSurfaceMaterial) ? options.lateralSurfaceMaterial : Material.fromType(Material.ColorType);
                this._lateralSurfaceMaterial = undefined;
                this._lateralSurfaceTranslucent = undefined;

                /**
                 * 是否显示圆顶表面
                 * @type {Boolean}
                 */
                this.showDomeSurfaces = defaultValue(options.showDomeSurfaces, true);

                /**
                 * 圆顶表面材质
                 * @type {Material}
                 */
                this.domeSurfaceMaterial = defined(options.domeSurfaceMaterial) ? options.domeSurfaceMaterial : Material.fromType(Material.ColorType);

                /**
                 * 是否显示圆顶面线
                 * @type {Boolean}
                 */
                this.showDomeLines = defaultValue(options.showDomeLines, true);

                /**
                 * 是否显示与地球相交的线
                 * @type {Boolean}
                 */
                this.showIntersection = defaultValue(options.showIntersection, false);

                /**
                 * 与地球相交的线的颜色
                 * @type {Color}
                 */
                this.intersectionColor = defaultValue(options.intersectionColor, Color.WHITE);

                /**
                 * 与地球相交的线的宽度（像素）
                 * @type {Number}
                 */
                this.intersectionWidth = defaultValue(options.intersectionWidth, 5.0);

                //是否穿过地球
                this._showThroughEllipsoid = defaultValue(options.showThroughEllipsoid, false);

                /**
                 * 是否显示扫描面
                 * @type {Boolean}
                 */
                this.showScanPlane = defaultValue(options.showScanPlane, true);

                /**
                 * 扫描面颜色
                 * @type {Color}
                 */
                this.scanPlaneColor = defaultValue(options.scanPlaneColor, Color.AQUA);

                /**
                 * 扫描面模式 垂直V/水平H
                 * @type {String}
                 */
                this.scanPlaneMode = defaultValue(options.scanPlaneMode, 'H');

                /**
                 * 扫描速率，值越大，扫描越慢
                 * @type {Number}
                 */
                this.speed = defaultValue(options.speed, 10);

                this._scanePlaneXHalfAngle = 0;
                this._scanePlaneYHalfAngle = 0;

                //时间计算的起点
                this._time = JulianDate.now();

                this._boundingSphere = new BoundingSphere();
                this._boundingSphereWC = new BoundingSphere();
                this._boundingSphere = new BoundingSphere(Cartesian3.ZERO, this._radius);
                Matrix4.multiplyByUniformScale(this._modelMatrix, this._radius, this._computedModelMatrix);
                BoundingSphere.transform(this._boundingSphere, this._modelMatrix, this._boundingSphereWC);

                //扇面 sector
                this._sectorFrontCommand = new DrawCommand({
                    owner: this,
                    primitiveType: PrimitiveType.TRIANGLES,
                    boundingVolume: this._boundingSphereWC
                });
                this._sectorBackCommand = new DrawCommand({
                    owner: this,
                    primitiveType: PrimitiveType.TRIANGLES,
                    boundingVolume: this._boundingSphereWC
                });
                this._sectorVA = undefined;

                //扇面边线 sectorLine
                this._sectorLineCommand = new DrawCommand({
                    owner: this,
                    primitiveType: PrimitiveType.LINES,
                    boundingVolume: this._boundingSphereWC
                });
                this._sectorLineVA = undefined;

                //扇面分割线 sectorSegmentLine
                this._sectorSegmentLineCommand = new DrawCommand({
                    owner: this,
                    primitiveType: PrimitiveType.LINES,
                    boundingVolume: this._boundingSphereWC
                });
                this._sectorSegmentLineVA = undefined;

                //弧面 dome
                this._domeFrontCommand = new DrawCommand({
                    owner: this,
                    primitiveType: PrimitiveType.TRIANGLES,
                    boundingVolume: this._boundingSphereWC
                });
                this._domeBackCommand = new DrawCommand({
                    owner: this,
                    primitiveType: PrimitiveType.TRIANGLES,
                    boundingVolume: this._boundingSphereWC
                });
                this._domeVA = undefined;

                //弧面线 domeLine
                this._domeLineCommand = new DrawCommand({
                    owner: this,
                    primitiveType: PrimitiveType.LINES,
                    boundingVolume: this._boundingSphereWC
                });
                this._domeLineVA = undefined;

                //扫描面 scanPlane/scanRadial
                this._scanPlaneFrontCommand = new DrawCommand({
                    owner: this,
                    primitiveType: PrimitiveType.TRIANGLES,
                    boundingVolume: this._boundingSphereWC
                });
                this._scanPlaneBackCommand = new DrawCommand({
                    owner: this,
                    primitiveType: PrimitiveType.TRIANGLES,
                    boundingVolume: this._boundingSphereWC
                });

                this._scanRadialCommand = undefined;

                this._colorCommands = [];

                this._frontFaceRS = undefined;
                this._backFaceRS = undefined;
                this._sp = undefined;

                this._uniforms = {
                    u_type: function u_type() {
                        return 0; //面
                    },
                    u_xHalfAngle: function u_xHalfAngle() {
                        return self._xHalfAngle;
                    },
                    u_yHalfAngle: function u_yHalfAngle() {
                        return self._yHalfAngle;
                    },
                    u_radius: function u_radius() {
                        return self.radius;
                    },
                    u_showThroughEllipsoid: function u_showThroughEllipsoid() {
                        return self.showThroughEllipsoid;
                    },
                    u_showIntersection: function u_showIntersection() {
                        return self.showIntersection;
                    },
                    u_intersectionColor: function u_intersectionColor() {
                        return self.intersectionColor;
                    },
                    u_intersectionWidth: function u_intersectionWidth() {
                        return self.intersectionWidth;
                    },
                    u_normalDirection: function u_normalDirection() {
                        return 1.0;
                    },
                    u_lineColor: function u_lineColor() {
                        return self.lineColor;
                    }
                };

                this._scanUniforms = {
                    u_xHalfAngle: function u_xHalfAngle() {
                        return self._scanePlaneXHalfAngle;
                    },
                    u_yHalfAngle: function u_yHalfAngle() {
                        return self._scanePlaneYHalfAngle;
                    },
                    u_radius: function u_radius() {
                        return self.radius;
                    },
                    u_color: function u_color() {
                        return self.scanPlaneColor;
                    },
                    u_showThroughEllipsoid: function u_showThroughEllipsoid() {
                        return self.showThroughEllipsoid;
                    },
                    u_showIntersection: function u_showIntersection() {
                        return self.showIntersection;
                    },
                    u_intersectionColor: function u_intersectionColor() {
                        return self.intersectionColor;
                    },
                    u_intersectionWidth: function u_intersectionWidth() {
                        return self.intersectionWidth;
                    },
                    u_normalDirection: function u_normalDirection() {
                        return 1.0;
                    },
                    u_lineColor: function u_lineColor() {
                        return self.lineColor;
                    }
                };
            }
            get color() {
                return this._color;
            }
            set color(val) {
                this._color = val;
                this._material.uniforms.color = val;
            }
            get boundingSphere() {
                return this._boundingSphere;
            }
            /**
             * 水平面半夹角,单位：度
             * @type {Number}
             */
            get xHalfAngle() {
                return CesiumMath.toDegrees(this._xHalfAngle);
            }
            set xHalfAngle(val) {
                if (this._xHalfAngle !== val) {
                    this._xHalfAngle = CesiumMath.toRadians(val);
                    this._createVS = true;
                }
            }
            /**
             * 垂直面半夹角,单位：度
             * @type {Number}
             */
            get yHalfAngle() {
                return CesiumMath.toDegrees(this._yHalfAngle);;
            }
            set yHalfAngle(val) {
                if (this._yHalfAngle !== val) {
                    this._yHalfAngle = CesiumMath.toRadians(val);
                    this._createVS = true
                }
            }
            /**
             * 传感器半径
             * @type {Number}
             */
            get radius() {
                return this._radius;
            }
            set radius(val) {
                if (this._radius !== val) {
                    this._radius = val;
                    this._boundingSphere = new BoundingSphere(Cartesian3.ZERO, val);
                    Matrix4.multiplyByUniformScale(this._modelMatrix, this._radius, this._computedModelMatrix);
                    BoundingSphere.transform(this._boundingSphere, this._modelMatrix, this._boundingSphereWC);
                }
            }
            /**
             * 传感器模型矩阵
             * @type {Matrix4}
             */
            get modelMatrix() {
                return this._modelMatrix;
            }
            set modelMatrix(val) {
                const modelMatrixChanged = !Matrix4.equals(val, this._modelMatrix);
                if (modelMatrixChanged) {
                    Matrix4.clone(val, this._modelMatrix);
                    Matrix4.multiplyByUniformScale(this._modelMatrix, this._radius, this._computedModelMatrix);
                    BoundingSphere.transform(this._boundingSphere, this._modelMatrix, this._boundingSphereWC);
                }
            }
            /**
             * 是否传过地球
             * @type {Boolean}
             */
            get showThroughEllipsoid() {
                return this._showThroughEllipsoid;
            }
            set showThroughEllipsoid(val) {
                if (this._showThroughEllipsoid !== val) {
                    this._showThroughEllipsoid = val;
                    this._createRS = true;
                }
            }
            /**
             * 材质
             * @type {Material}
             */
            get material() {
                return this._material
            }
            set material(val) {
                this._material = val;
                this._createRS = true;
                this._createSP = true;
            }

            /**
             * 每一帧在渲染时Cesium会自动调用该方法。不要主动调用该方法
             * @override
             * @param  {frameState} frameState
             */
            update(frameState) {
                const mode = frameState.mode;
                if (!this.show || mode !== SceneMode.SCENE3D) {
                    return;
                }
                const xHalfAngle = this._xHalfAngle;
                const yHalfAngle = this._yHalfAngle;

                if (xHalfAngle < 0.0 || yHalfAngle < 0.0) {
                    throw new ViewshedError('halfAngle must be greater than or equal to zero.');
                }
                if (xHalfAngle == 0.0 || yHalfAngle == 0.0) {
                    return;
                }

                const radius = this.radius;
                if (radius < 0.0) {
                    throw new ViewshedError('this.radius must be greater than or equal to zero.');
                }
                const showThroughEllipsoid = this.showThroughEllipsoid;
                const material = this.material;
                const translucent = material.isTranslucent();
                if (this._translucent !== translucent) {
                    this._translucent = translucent;
                    this._createRS = true;
                }
                if (this.showScanPlane) {
                    const time = frameState.time;
                    let timeDiff = JulianDate.secondsDifference(time, this._time);
                    if (timeDiff < 0) {
                        this._time = JulianDate.clone(time, this._time);
                    }
                    let percentage;
                    if (this.speed <= 0) {
                        percentage = 0;
                    } else {
                        const speet = 10 / this.speed;
                        percentage = Math.max(timeDiff % speet / speet, 0);
                    }
                    let angle;
                    const matrix3Scratch = new Matrix3;

                    if (this.scanPlaneMode == 'H') {
                        angle = 2 * yHalfAngle * percentage - yHalfAngle;
                        const cosYHalfAngle = cos(angle);
                        const tanXHalfAngle = tan(xHalfAngle);

                        const maxX = atan(cosYHalfAngle * tanXHalfAngle);
                        this._scanePlaneXHalfAngle = maxX;
                        this._scanePlaneYHalfAngle = angle;
                        Matrix3.fromRotationX(this._scanePlaneYHalfAngle, matrix3Scratch);
                    } else {
                        angle = 2 * xHalfAngle * percentage - xHalfAngle;
                        const tanYHalfAngle = tan(yHalfAngle);
                        const cosXHalfAngle = cos(angle);

                        const maxY = atan(cosXHalfAngle * tanYHalfAngle);
                        this._scanePlaneXHalfAngle = angle;
                        this._scanePlaneYHalfAngle = maxY;
                        Matrix3.fromRotationY(this._scanePlaneXHalfAngle, matrix3Scratch);
                    }

                    Matrix4.multiplyByMatrix3(this.modelMatrix, matrix3Scratch, this._computedScanPlaneModelMatrix);
                    Matrix4.multiplyByUniformScale(this._computedScanPlaneModelMatrix, this.radius, this._computedScanPlaneModelMatrix);
                }

                if (this._createVS) {
                    createVertexArray(this, frameState);
                }
                if (this._createRS) {
                    createRenderState(this, showThroughEllipsoid, translucent);
                }
                if (this._createSP) {
                    createShaderProgram(this, frameState, material);
                }
                if (this._createRS || this._createSP) {
                    createCommands(this, translucent);
                }

                const commandList = frameState.commandList;
                const passes = frameState.passes;
                const colorCommands = this._colorCommands;
                if (passes.render) {
                    for (let i = 0, len = colorCommands.length; i < len; i++) {
                        const colorCommand = colorCommands[i];
                        commandList.push(colorCommand);
                    }
                }
            }
            /**
             * 销毁对象并翻译WebGL资源
             * @example
             * const radar = new RectangularSensorPrimitive();
             * if(!radar.isDestroyed()){
             *    radar.destroy();
             * }
             */
            destroy() {
                this._pickSP.destroy();
                this._sp = this._sp.destroy();
                this._scanePlaneSP && (this._scanePlaneSP = this._scanePlaneSP.destroy());
                Cesium.destroyObject(this);
            }
        }


        function createCommand(primitive, frontCommand, backCommand, frontFaceRS, backFaceRS, sp, va, uniforms, modelMatrix, translucent, pass, isLine) {
            if (translucent && backCommand) {
                backCommand.vertexArray = va;
                backCommand.renderState = backFaceRS;
                backCommand.shaderProgram = sp;
                backCommand.uniformMap = combine(uniforms, primitive._material._uniforms);
                backCommand.uniformMap.u_normalDirection = function () {
                    return -1.0;
                };
                backCommand.pass = pass;
                backCommand.modelMatrix = modelMatrix;
                primitive._colorCommands.push(backCommand);
            }

            frontCommand.vertexArray = va;
            frontCommand.renderState = frontFaceRS;
            frontCommand.shaderProgram = sp;
            frontCommand.uniformMap = combine(uniforms, primitive._material._uniforms);
            if (isLine) {
                frontCommand.uniformMap.u_type = function () {
                    return 1;
                };
            }
            frontCommand.pass = pass;
            frontCommand.modelMatrix = modelMatrix;
            primitive._colorCommands.push(frontCommand);
        }

        function createCommands(primitive, translucent) {
            primitive._colorCommands.length = 0;

            const pass = translucent ? Pass.TRANSLUCENT : Pass.OPAQUE;

            //显示扇面
            if (primitive.showLateralSurfaces) {
                createCommand(primitive, primitive._sectorFrontCommand, primitive._sectorBackCommand,
                    primitive._frontFaceRS, primitive._backFaceRS, primitive._sp, primitive._sectorVA,
                    primitive._uniforms, primitive._computedModelMatrix, translucent,
                    pass);
            }
            //显示扇面线
            if (primitive.showSectorLines) {
                createCommand(primitive, primitive._sectorLineCommand, undefined, primitive._frontFaceRS,
                    primitive._backFaceRS, primitive._sp, primitive._sectorLineVA, primitive._uniforms,
                    primitive._computedModelMatrix, translucent, pass, true);
            }

            //显示扇面交接线
            if (primitive.showSectorSegmentLines) {
                createCommand(primitive, primitive._sectorSegmentLineCommand, undefined, primitive._frontFaceRS,
                    primitive._backFaceRS, primitive._sp, primitive._sectorSegmentLineVA, primitive._uniforms,
                    primitive._computedModelMatrix, translucent, pass,
                    true);
            }

            //显示弧面
            if (primitive.showDomeSurfaces) {
                createCommand(primitive, primitive._domeFrontCommand, primitive._domeBackCommand,
                    primitive._frontFaceRS, primitive._backFaceRS, primitive._sp, primitive._domeVA,
                    primitive._uniforms, primitive._computedModelMatrix, translucent, pass);
            }

            //显示弧面线
            if (primitive.showDomeLines) {
                createCommand(primitive, primitive._domeLineCommand, undefined, primitive._frontFaceRS,
                    primitive._backFaceRS, primitive._sp, primitive._domeLineVA, primitive._uniforms,
                    primitive._computedModelMatrix, translucent, pass, true);
            }
            //显示扫描面
            if (primitive.showScanPlane) {
                createCommand(primitive, primitive._scanPlaneFrontCommand, primitive._scanPlaneBackCommand,
                    primitive._frontFaceRS, primitive._backFaceRS, primitive._scanePlaneSP, primitive._scanPlaneVA,
                    primitive._scanUniforms, primitive
                    ._computedScanPlaneModelMatrix, translucent, pass);
            }
            return
        }

        function createCommonShaderProgram(primitive, frameState, material) {
            const context = frameState.context;

            const vs = sensorVS;
            const fs = new ShaderSource({
                sources: [sensorComm, material.shaderSource, sensorFS]
            });

            primitive._sp = ShaderProgram.replaceCache({
                context: context,
                shaderProgram: primitive._sp,
                vertexShaderSource: vs,
                fragmentShaderSource: fs,
                attributeLocations: attributeLocations
            });

            const pickFS = new ShaderSource({
                sources: [sensorComm, material.shaderSource, sensorFS],
                pickColorQualifier: 'uniform'
            });

            primitive._pickSP = ShaderProgram.replaceCache({
                context: context,
                shaderProgram: primitive._pickSP,
                vertexShaderSource: vs,
                fragmentShaderSource: pickFS,
                attributeLocations: attributeLocations
            });
        }

        function createScanPlaneShaderProgram(primitive, frameState, material) {
            const context = frameState.context;

            const vs = sensorVS;
            const fs = new ShaderSource({
                sources: [sensorComm, material.shaderSource, scanPlaneFS]
            });

            primitive._scanePlaneSP = ShaderProgram.replaceCache({
                context: context,
                shaderProgram: primitive._scanePlaneSP,
                vertexShaderSource: vs,
                fragmentShaderSource: fs,
                attributeLocations: attributeLocations
            });
        }

        function createShaderProgram(primitive, frameState, material) {
            createCommonShaderProgram(primitive, frameState, material);

            if (primitive.showScanPlane) {
                createScanPlaneShaderProgram(primitive, frameState, material);
            }
        }

        function createRenderState(primitive, showThroughEllipsoid, translucent) {
            if (translucent) {
                primitive._frontFaceRS = RenderState.fromCache({
                    depthTest: {
                        enabled: !showThroughEllipsoid
                    },
                    depthMask: false,
                    blending: BlendingState.ALPHA_BLEND,
                    cull: {
                        enabled: true,
                        face: CullFace.BACK
                    }
                });

                primitive._backFaceRS = RenderState.fromCache({
                    depthTest: {
                        enabled: !showThroughEllipsoid
                    },
                    depthMask: false,
                    blending: BlendingState.ALPHA_BLEND,
                    cull: {
                        enabled: true,
                        face: CullFace.FRONT
                    }
                });

                primitive._pickRS = RenderState.fromCache({
                    depthTest: {
                        enabled: !showThroughEllipsoid
                    },
                    depthMask: false,
                    blending: BlendingState.ALPHA_BLEND
                });
            } else {
                primitive._frontFaceRS = RenderState.fromCache({
                    depthTest: {
                        enabled: !showThroughEllipsoid
                    },
                    depthMask: true
                });

                primitive._pickRS = RenderState.fromCache({
                    depthTest: {
                        enabled: true
                    },
                    depthMask: true
                });
            }
        }

        function computeUnitPosiiton(primitive, xHalfAngle, yHalfAngle) {
            const slice = primitive.slice;
            //以中心为角度
            const cosYHalfAngle = cos(yHalfAngle);
            const tanYHalfAngle = tan(yHalfAngle);
            const cosXHalfAngle = cos(xHalfAngle);
            const tanXHalfAngle = tan(xHalfAngle);

            const maxY = atan(cosXHalfAngle * tanYHalfAngle);
            const maxX = atan(cosYHalfAngle * tanXHalfAngle);

            //ZOY面单位圆
            const zoy = [];
            for (let i = 0; i < slice; i++) {
                const phi = 2 * maxY * i / (slice - 1) - maxY;
                zoy.push(new Cartesian3(0, sin(phi), cos(phi)));
            }
            //zox面单位圆
            const zox = [];
            for (let i = 0; i < slice; i++) {
                const phi = 2 * maxX * i / (slice - 1) - maxX;
                zox.push(new Cartesian3(sin(phi), 0, cos(phi)));
            }

            return {
                zoy: zoy,
                zox: zox
            };
        }


        function computeSectorPositions(primitive, unitPosition) {
            const xHalfAngle = primitive._xHalfAngle,
                yHalfAngle = primitive._yHalfAngle,
                zoy = unitPosition.zoy,
                zox = unitPosition.zox;
            const positions = [];

            //zoy面沿y轴逆时针转xHalfAngle
            const matrix3Scratch = new Matrix3()
            let matrix3 = Matrix3.fromRotationY(xHalfAngle, matrix3Scratch);
            positions.push(zoy.map(function (p) {
                return Matrix3.multiplyByVector(matrix3, p, new Cartesian3());
            }));
            //zox面沿x轴顺时针转yHalfAngle
            matrix3 = Matrix3.fromRotationX(-yHalfAngle, matrix3Scratch);
            positions.push(zox.map(function (p) {
                return Matrix3.multiplyByVector(matrix3, p, new Cartesian3());
            }).reverse());
            //zoy面沿y轴顺时针转xHalfAngle
            matrix3 = Matrix3.fromRotationY(-xHalfAngle, matrix3Scratch);
            positions.push(zoy.map(function (p) {
                return Matrix3.multiplyByVector(matrix3, p, new Cartesian3());
            }).reverse());
            //zox面沿x轴逆时针转yHalfAngle
            matrix3 = Matrix3.fromRotationX(yHalfAngle, matrix3Scratch);
            positions.push(zox.map(function (p) {
                return Matrix3.multiplyByVector(matrix3, p, new Cartesian3());
            }));
            return positions;
        }
        /**
         * 创建扇面顶点
         * @private
         * @param context
         * @param positions
         * @returns {*}
         */

        function createSectorVertexArray(context, positions) {
            const planeLength = Array.prototype.concat.apply([], positions).length - positions.length;
            const vertices = new Float32Array(2 * 3 * 3 * planeLength);

            let k = 0;
            for (let i = 0, len = positions.length; i < len; i++) {
                const planePositions = positions[i];
                const nScratch = new Cartesian3();
                const n = Cartesian3.normalize(Cartesian3.cross(planePositions[0],
                    planePositions[planePositions.length - 1], nScratch), nScratch);
                for (let j = 0, planeLength = planePositions.length - 1; j < planeLength; j++) {
                    vertices[k++] = 0.0;
                    vertices[k++] = 0.0;
                    vertices[k++] = 0.0;
                    vertices[k++] = -n.x;
                    vertices[k++] = -n.y;
                    vertices[k++] = -n.z;

                    vertices[k++] = planePositions[j].x;
                    vertices[k++] = planePositions[j].y;
                    vertices[k++] = planePositions[j].z;
                    vertices[k++] = -n.x;
                    vertices[k++] = -n.y;
                    vertices[k++] = -n.z;

                    vertices[k++] = planePositions[j + 1].x;
                    vertices[k++] = planePositions[j + 1].y;
                    vertices[k++] = planePositions[j + 1].z;
                    vertices[k++] = -n.x;
                    vertices[k++] = -n.y;
                    vertices[k++] = -n.z;
                }
            }

            const vertexBuffer = Buffer.createVertexBuffer({
                context: context,
                typedArray: vertices,
                usage: BufferUsage.STATIC_DRAW
            });

            const stride = 2 * 3 * Float32Array.BYTES_PER_ELEMENT;

            const attributes = [{
                index: attributeLocations.position,
                vertexBuffer: vertexBuffer,
                componentsPerAttribute: 3,
                componentDatatype: ComponentDatatype.FLOAT,
                offsetInBytes: 0,
                strideInBytes: stride
            }, {
                index: attributeLocations.normal,
                vertexBuffer: vertexBuffer,
                componentsPerAttribute: 3,
                componentDatatype: ComponentDatatype.FLOAT,
                offsetInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
                strideInBytes: stride
            }];

            return new VertexArray({
                context: context,
                attributes: attributes
            });
        }

        /**
         * 创建扇面边线顶点
         * @param context
         * @param positions
         * @returns {*}
         */
        function createSectorLineVertexArray(context, positions) {
            const planeLength = positions.length;
            const vertices = new Float32Array(3 * 3 * planeLength);

            let k = 0;
            for (let i = 0, len = positions.length; i < len; i++) {
                const planePositions = positions[i];
                vertices[k++] = 0.0;
                vertices[k++] = 0.0;
                vertices[k++] = 0.0;

                vertices[k++] = planePositions[0].x;
                vertices[k++] = planePositions[0].y;
                vertices[k++] = planePositions[0].z;
            }

            const vertexBuffer = Buffer.createVertexBuffer({
                context: context,
                typedArray: vertices,
                usage: BufferUsage.STATIC_DRAW
            });

            const stride = 3 * Float32Array.BYTES_PER_ELEMENT;

            const attributes = [{
                index: attributeLocations.position,
                vertexBuffer: vertexBuffer,
                componentsPerAttribute: 3,
                componentDatatype: ComponentDatatype.FLOAT,
                offsetInBytes: 0,
                strideInBytes: stride
            }];

            return new VertexArray({
                context: context,
                attributes: attributes
            });
        }

        /**
         * 创建扇面圆顶面连接线顶点
         * @private
         * @param context
         * @param positions
         * @returns {*}
         */
        function createSectorSegmentLineVertexArray(context, positions) {
            const planeLength = Array.prototype.concat.apply([], positions).length - positions.length;
            const vertices = new Float32Array(3 * 3 * planeLength);

            let k = 0;
            for (let i = 0, len = positions.length; i < len; i++) {
                const planePositions = positions[i];

                for (let j = 0, planeLength = planePositions.length - 1; j < planeLength; j++) {
                    vertices[k++] = planePositions[j].x;
                    vertices[k++] = planePositions[j].y;
                    vertices[k++] = planePositions[j].z;

                    vertices[k++] = planePositions[j + 1].x;
                    vertices[k++] = planePositions[j + 1].y;
                    vertices[k++] = planePositions[j + 1].z;
                }
            }

            const vertexBuffer = Buffer.createVertexBuffer({
                context: context,
                typedArray: vertices,
                usage: BufferUsage.STATIC_DRAW
            });

            const stride = 3 * Float32Array.BYTES_PER_ELEMENT;

            const attributes = [{
                index: attributeLocations.position,
                vertexBuffer: vertexBuffer,
                componentsPerAttribute: 3,
                componentDatatype: ComponentDatatype.FLOAT,
                offsetInBytes: 0,
                strideInBytes: stride
            }];

            return new VertexArray({
                context: context,
                attributes: attributes
            });
        }

        /**
         * 创建圆顶面顶点
         * @param context
         */
        function createDomeVertexArray(context) {
            const geometry = EllipsoidGeometry.createGeometry(new EllipsoidGeometry({
                vertexFormat: VertexFormat.POSITION_ONLY,
                stackPartitions: 32,
                slicePartitions: 32
            }));

            const vertexArray = VertexArray.fromGeometry({
                context: context,
                geometry: geometry,
                attributeLocations: attributeLocations,
                bufferUsage: BufferUsage.STATIC_DRAW,
                interleave: false
            });
            return vertexArray;
        }

        /**
         * 创建圆顶面连线顶点
         * @param context
         */
        function createDomeLineVertexArray(context) {
            const geometry = EllipsoidOutlineGeometry.createGeometry(new EllipsoidOutlineGeometry({
                vertexFormat: VertexFormat.POSITION_ONLY,
                stackPartitions: 32,
                slicePartitions: 32
            }));

            const vertexArray = VertexArray.fromGeometry({
                context: context,
                geometry: geometry,
                attributeLocations: attributeLocations,
                bufferUsage: BufferUsage.STATIC_DRAW,
                interleave: false
            });
            return vertexArray;
        }

        /**
         * 创建扫描面顶点
         * @param context
         * @param positions
         * @returns {*}
         */
        function createScanPlaneVertexArray(context, positions) {
            const planeLength = positions.length - 1;
            const vertices = new Float32Array(3 * 3 * planeLength);

            let k = 0;
            for (let i = 0; i < planeLength; i++) {
                vertices[k++] = 0.0;
                vertices[k++] = 0.0;
                vertices[k++] = 0.0;

                vertices[k++] = positions[i].x;
                vertices[k++] = positions[i].y;
                vertices[k++] = positions[i].z;

                vertices[k++] = positions[i + 1].x;
                vertices[k++] = positions[i + 1].y;
                vertices[k++] = positions[i + 1].z;
            }

            const vertexBuffer = Buffer.createVertexBuffer({
                context: context,
                typedArray: vertices,
                usage: BufferUsage.STATIC_DRAW
            });

            const stride = 3 * Float32Array.BYTES_PER_ELEMENT;

            const attributes = [{
                index: attributeLocations.position,
                vertexBuffer: vertexBuffer,
                componentsPerAttribute: 3,
                componentDatatype: ComponentDatatype.FLOAT,
                offsetInBytes: 0,
                strideInBytes: stride
            }];

            return new VertexArray({
                context: context,
                attributes: attributes
            });
        }

        function createVertexArray(primitive, frameState) {
            const context = frameState.context;

            const unitSectorPositions = computeUnitPosiiton(primitive, primitive._xHalfAngle, primitive._yHalfAngle);
            const positions = computeSectorPositions(primitive, unitSectorPositions);

            //显示扇面
            if (primitive.showLateralSurfaces) {
                primitive._sectorVA = createSectorVertexArray(context, positions);
            }

            //显示扇面线
            if (primitive.showSectorLines) {
                primitive._sectorLineVA = createSectorLineVertexArray(context, positions);
            }

            //显示扇面圆顶面的交线
            if (primitive.showSectorSegmentLines) {
                primitive._sectorSegmentLineVA = createSectorSegmentLineVertexArray(context, positions);
            }

            //显示弧面
            if (primitive.showDomeSurfaces) {
                primitive._domeVA = createDomeVertexArray(context);
            }

            //显示弧面线
            if (primitive.showDomeLines) {
                primitive._domeLineVA = createDomeLineVertexArray(context);
            }

            //显示扫描面
            if (primitive.showScanPlane) {

                if (primitive.scanPlaneMode == 'H') {
                    const unitScanPlanePositions = computeUnitPosiiton(primitive, CesiumMath.PI_OVER_TWO, 0);
                    primitive._scanPlaneVA = createScanPlaneVertexArray(context, unitScanPlanePositions.zox);
                } else {
                    const unitScanPlanePositions = computeUnitPosiiton(primitive, 0, CesiumMath.PI_OVER_TWO);
                    primitive._scanPlaneVA = createScanPlaneVertexArray(context, unitScanPlanePositions.zoy);
                }
            }
        }
        RectangularSensorPrimitive.prototype.isDestroyed = function () {
            return false;
        };
        return RectangularSensorPrimitive;
    })();

    class ViewShedAnalyser {
        constructor(viewer, options) {
            options = defaultValue(options, {});
            if (!(viewer && viewer instanceof Cesium.Viewer)) {
                throw new ViewshedError('Expected viewer to be typeof Viewer, actual typeof was ' + typeof viewer);
            }
            this._viewer = viewer;
            this._options = options;

            if (!defined(options.observe)) {
                throw new ViewshedError('parameter options.observe is required.');
            }
            if (!defined(options.viewPosition)) {
                throw new ViewshedError('parameter options.viewPosition is required.');
            }

            this._observe = options.observe;
            this._viewPosition = options.viewPosition;
            this._debug = defaultValue(options.debug, false);
            this._far = defaultValue(options.far, Cesium.Cartesian3.distance(this._observe, this._viewPosition));
            this._near = defaultValue(options.near, 0.001 * this._far);
            this._aspectRatio = defaultValue(options.aspectRatio, 1.5);
            this._fov = defaultValue(options.fov, 120);

            const direction = Cesium.Cartesian3.subtract(this._viewPosition, this._observe, new Cesium.Cartesian3());
            this._direction = Cesium.Cartesian3.normalize(direction, direction);
            this._up = viewer.scene.mapProjection.ellipsoid.geodeticSurfaceNormal(
                this._observe,
                new Cesium.Cartesian3()
            );
        }

        clear() {
            if (defined(this._frustum)) {
                this._viewer.scene.primitives.remove(this._frustum);
            }
            if (defined(this._shadowMap)) {
                this._viewer.scene.primitives.remove(this._shadowMap);
            }
        }

        destroy() {
            this.clear();
            if (this._frustum && !this._frustum.isDestroyed()) {
                this._frustum.destroy();
            }
            if (this._shadowMap && !this._shadowMap.isDestroyed()) {
                this._shadowMap.destroy();
            }
            return Cesium.destroyObject(this);
        }

        get frustum() {
            return this._frustum;
        }

        setProperty(name, value) {
            if (this[name] === value) {
                return;
            }

            this[name] = value;
            this.update();
        }

        get debug() {
            return this._debug;
        }

        set debug(val) {
            if (this._debug !== val) {
                this._debug = val;
                if (this._frustum) {
                    this._frustum.show = val;
                }
            }
        }

        get observe() {
            return this._observe;
        }

        set observe(val) {
            this.setProperty('_observe', val);
        }

        get viewPosition() {
            return this._viewPosition;
        }

        set viewPosition(val) {
            this.setProperty('_viewPosition', val);
        }

        get direction() {
            return this._direction;
        }

        get far() {
            return this._far;
        }

        set far(val) {
            this.setProperty('_far', val);
        }

        get near() {
            return this._near;
        }

        set near(val) {
            this.setProperty('_near', val);
        }

        get fov() {
            return this._fov;
        }

        set fov(val) {
            this.setProperty('_fov', val);
        }

        get aspectRatio() {
            return this._aspectRatio;
        }

        set aspectRatio(val) {
            this.setProperty('_aspectRatio', val);
        }

        update() {
            this.createOrUpdateCamera();
            this.createOrUpdateFrustum();
            this.createOrUpdateShadowMap();
        }

        createOrUpdateCamera() {
            if (!defined(this._viewCamera)) {
                this._viewCamera = new Cesium.Camera(this._viewer.scene);
            }

            this._viewCamera.frustum.near = this._near;
            this._viewCamera.frustum.far = this._far;
            this._viewCamera.frustum.aspectRatio = this._aspectRatio;
            this._viewCamera.frustum.fov = Cesium.Math.toRadians(this.fov);
            this._viewCamera.direction = Cesium.Cartesian3.normalize(this._direction, this._viewCamera.direction);
            this._viewCamera.position = Cesium.Cartesian3.clone(this._observe, this._viewCamera.position);
            this._viewCamera.up = this._up;
            this._viewCamera.right = Cesium.Cartesian3.cross(
                this._viewCamera.up,
                this._viewCamera.direction,
                new Cesium.Cartesian3()
            );
        }

        rotateCamera(angle, method) {
            const oldTransform = Cesium.Matrix4.clone(this._viewCamera._transform, new Cesium.Matrix4());
            const transform = Cesium.Transforms.eastNorthUpToFixedFrame(
                this._viewCamera.position,
                this._viewCamera._projection.ellipsoid
            );

            this._viewCamera._setTransform(transform);
            this._viewCamera[method](Cesium.Math.toRadians(angle));
            this._viewCamera._setTransform(oldTransform);
            Cesium.Cartesian3.clone(this._viewCamera.directionWC, this._direction);
            this.update();
        }

        rotateLeft(angle) {
            this.rotateCamera(angle, 'rotateLeft');
        }

        rotateRight(angle) {
            this.rotateLeft(-angle);
        }

        rotateDown(angle) {
            this.rotateCamera(angle, 'rotateDown');
        }

        rotateUp(angle) {
            this.rotateDown(-angle);
        }

        createOrUpdateFrustum() {
            const position = this._viewCamera.positionWC;
            const rotation = new Cesium.Matrix3();
            const up = this._up;
            const direction = this.direction;
            const right = Cesium.Cartesian3.cross(up, direction, new Cesium.Cartesian3());

            Cesium.Matrix3.setColumn(rotation, 0, right, rotation);
            Cesium.Matrix3.setColumn(rotation, 1, up, rotation);
            Cesium.Matrix3.setColumn(rotation, 2, direction, rotation);

            const orientation = Cesium.Quaternion.fromRotationMatrix(rotation, new Cesium.Quaternion());
            const modelMatrix = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
                position,
                orientation,
                new Cesium.Cartesian3(1, 1, 1),
                new Cesium.Matrix4()
            );

            if (this._frustum) {
                this._frustum.modelMatrix = modelMatrix;
                this._frustum.xHalfAngle = this._fov / 2;
                this._frustum.yHalfAngle = this._fov / 2 / this._aspectRatio;
                this._frustum.radius = this._far;
                return this._frustum;
            }

            this._frustum = new RectangularSensorPrimitive({
                radius: this._far,
                modelMatrix: modelMatrix,
                xHalfAngle: this._fov / 2,
                yHalfAngle: this._fov / 2 / this._aspectRatio,
                showScanPlane: false,
                showLateralSurfaces: false,
                material: Cesium.Material.fromType(Cesium.Material.ColorType, {
                    color: Cesium.Color.AQUA.withAlpha(0.3)
                }),
                show: this.debug
            });
            this._viewer.scene.primitives.add(this._frustum);
            return this._frustum;
        }

        createOrUpdateShadowMap() {
            if (defined(this._shadowMap)) {
                this._viewer.scene.primitives.remove(this._shadowMap);
            }

            if (!(this._viewCamera && this._frustum._boundingSphereWC)) {
                return undefined;
            }

            const shadowMap = new ViewshedMap({
                ...this._options,
                lightCamera: this._viewCamera,
                context: this._viewer.scene.context
            });
            const primitive = new ViewShadowPrimitive(shadowMap);
            this._shadowMap = this._viewer.scene.primitives.add(primitive);
            return this._shadowMap;
        }
    }
    return ViewShedAnalyser;
})();

const TILESET_URL = FILE_HOST + '3dtiles/house/tileset.json'
const viewer = new Cesium.Viewer(box, {
    animation: false,
    timeline: false,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    shouldAnimate: true,
    infoBox: false,
    selectionIndicator: false,
    sceneModePicker: false,
    shadows: false,
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
        Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())
    ),
})

viewer.scene.globe.depthTestAgainstTerrain = true

const tileset = await Cesium.Cesium3DTileset.fromUrl(TILESET_URL)
viewer.scene.primitives.add(tileset)
await viewer.flyTo(tileset)

function addPoint(position, color) {
    return viewer.entities.add({
        position,
        point: {
            pixelSize: 20,
            clampToGround: true,
            color,
        },
    })
}

// 观察点，相机所在的位置
const observe = Cesium.Cartesian3.fromDegrees(
    121.479933144824,
    29.79248487011,
    104.167
)
addPoint(observe, Cesium.Color.GOLD)

// 观察方向终点
const view = Cesium.Cartesian3.fromDegrees(121.478780989946, 29.789676141017, 2.621)
addPoint(view, Cesium.Color.RED)

const viewshedOptions = {
    observe,
    viewPosition: view,
    size: 4096,
    near: 1,
    fov: 120,
    aspectRatio: 1.5,
    debug: true,
}

const viewshed = new ViewShedAnalyser(viewer, viewshedOptions)

viewshed.update()

const far = viewshed.far
const gui = new dat.GUI()
const controls = {
    near: viewshedOptions.near,
    far,
    fov: viewshedOptions.fov,
    debug: viewshedOptions.debug,
    xRotation: 0,
    yRotation: 0,
    vAngle: viewshedOptions.fov / viewshedOptions.aspectRatio,
}
const rotation = {
    x: 0,
    y: 0,
}

function updateAspectRatio() {
    viewshed.aspectRatio = controls.fov / controls.vAngle
}

function rotateByDelta(axis, value, rotate) {
    const delta = value - rotation[axis]
    rotate(delta)
    rotation[axis] = value
}

gui.add(controls, 'near', 0.5, 2, 0.1).name('近截面').onChange((value) => {
    viewshed.near = value
})

gui.add(controls, 'far', far - 100, far + 100, 1).name('远截面').onChange((value) => {
    viewshed.far = value
})

gui.add(controls, 'fov', 60, 120, 1).name('水平夹角').onChange((value) => {
    viewshed.fov = value
    updateAspectRatio()
})

gui.add(controls, 'vAngle', 30, 90, 1).name('垂直夹角').onChange(updateAspectRatio)

gui.add(controls, 'xRotation', -45, 45, 1).name('水平方向旋转').onChange((value) => {
    rotateByDelta('x', value, (delta) => viewshed.rotateLeft(delta))
})

gui.add(controls, 'yRotation', -45, 45, 1).name('垂直方向旋转').onChange((value) => {
    rotateByDelta('y', value, (delta) => viewshed.rotateUp(delta))
})

gui.add(controls, 'debug').name('调试').onChange((value) => {
    viewshed.debug = value
})
