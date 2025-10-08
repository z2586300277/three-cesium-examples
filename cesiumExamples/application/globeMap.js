import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

const primitive = viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.EllipsoidGeometry({
            vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
            radii: viewer.scene.globe.ellipsoid.radii,
        }),
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: new Cesium.Material({
            fabric: {
                type: "Image",
                uniforms: {
                    image: FILE_HOST + 'images/map/earth_clouds.png',
                    alpha: 0.5,
                    // repeat: new Cesium.Cartesian2(4.0, 4.0),
                    // color: Cesium.Color.YELLOW,
                },
                components: {
                    alpha: "texture(image, fract(materialInput.st * repeat)).r * alpha",
                    diffuse: "color.rgb", // 使用 color 作为漫反射颜色
                },
            },
        }),
        translucent: true, // 是否半透明
        aboveGround: true, // 是否在地表以上
    })
}))

let heading = 0
viewer.scene.postRender.addEventListener(() => {
    heading += 0.1
    primitive.modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(
        new Cesium.Cartesian3(),
        new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), 0, 0)
    )
})
