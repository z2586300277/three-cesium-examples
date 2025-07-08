import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})


const defaultvs = `
    in vec3 position;
    in vec3 normal;
    out vec3 v_color;
    out vec3 v_normal;
    uniform int irow;
    void main(){
    float instanceId = float(gl_InstanceID);

    int rows = irow * irow;
    float dz = float(gl_InstanceID / rows);
    int sub = gl_InstanceID % rows;

    float dx = float(sub / irow);
    float dy = float(sub % irow);
    float d = 2560.;
    vec3 tp = position + vec3(d * dx, d * dy, dz * d);
    v_color = vec3(dx / 128., dy / 128., dz / 128.);

    gl_Position = czm_projection  * czm_modelView * vec4( tp , 1. );
    }
`;
const defaultfs = `
    uniform vec3 color;
    in vec3 v_color;
    out vec4 out_fragColor;
    void main(){
    out_fragColor=vec4( v_color , 1. );
    }
`;

export default class GridPrimitive {
    constructor(modelMatrix, vs, fs, row, uniformMap) {
        this.modelMatrix = modelMatrix || Cesium.Matrix4.IDENTITY.clone()
        this.drawCommand = null;

        this.vs = vs || defaultvs;
        this.fs = fs || defaultfs;
        this.row = row || 10;
        this.uniformMap = uniformMap || {};
    }

    isDestroyed() {
        return false;
    }

    /**
     * 创建 DrawCommand
     * @param {Cesium.Context} context
     */
    createCommand(context) {

        var modelMatrix = this.modelMatrix;

        var box = new Cesium.BoxGeometry({
            // vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
            maximum: new Cesium.Cartesian3(250.0, 250.0, 250.0),
            minimum: new Cesium.Cartesian3(-250.0, -250.0, -250.0)
        });
        var geometry = Cesium.BoxGeometry.createGeometry(box);

        var attributeLocations = Cesium.GeometryPipeline.createAttributeLocations(geometry)

        var va = Cesium.VertexArray.fromGeometry({
            context: context,
            geometry: geometry,
            attributeLocations: attributeLocations,
            indexBuffer: Cesium.Buffer.createIndexBuffer({
                context: context,
                typedArray: geometry.indices,
                indexDatatype: Cesium.IndexDatatype.UNSIGNED_SHORT,
                usage: Cesium.BufferUsage.STATIC_DRAW
            }),
        });

        const { vs, fs } = this;

        var shaderProgram = Cesium.ShaderProgram.fromCache({
            context: context,
            vertexShaderSource: vs,
            fragmentShaderSource: fs,
            attributeLocations: attributeLocations
        })

        const row = this.row;
        const instanceCount = row * row * row;

        const uniformMap = this.uniformMap;
        uniformMap.color = () => Cesium.Color.RED;
        uniformMap.irow = () => row;

        var renderState = Cesium.RenderState.fromCache({
            cull: {
                enabled: true,
                face: Cesium.CullFace.BACK
            },
            depthTest: {
                enabled: true
            }
        })

        this.drawCommand = new Cesium.DrawCommand({
            modelMatrix: modelMatrix,
            vertexArray: va,
            shaderProgram: shaderProgram,
            uniformMap: uniformMap,
            renderState: renderState,
            pass: Cesium.Pass.OPAQUE,
            instanceCount: instanceCount
        })
    }

    /**
     * 实现Primitive接口，供Cesium内部在每一帧中调用
     * @param {Cesium.FrameState} frameState
     */
    update(frameState) {
        if (!this.drawCommand) {
            this.createCommand(frameState.context)
        }
        frameState.commandList.push(this.drawCommand)

        window.curdr = this.drawCommand;
    }
}



var origin = Cesium.Cartesian3.fromDegrees(113, 33, 250 / 2)
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)

const row = 100;
const instanceCount = row * row * row;
document.title = `Instance-${(instanceCount / 10000).toFixed(1)}w-DrawCommand`;
var primitive = new GridPrimitive(modelMatrix, null, null, row);
viewer.scene.primitives.add(primitive)

// 设置相机位置以查看模型
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(113, 33, 1600000),
    orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0.0
    }
});