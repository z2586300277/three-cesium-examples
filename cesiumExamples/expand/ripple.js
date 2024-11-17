import * as Cesium from 'cesium'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZjQ5ZGUzNC1jNWYwLTQ1ZTMtYmNjYS05YTY4ZTVmN2I2MDkiLCJpZCI6MTE3MTM4LCJpYXQiOjE2NzY0NDUyODB9.ZaNSBIfc1sGLhQd_xqhiSsc0yr8oS0wt1hAo9gbke6M'

const box = document.getElementById('box')
const viewer = new Cesium.Viewer(box, {
    animation: false,//是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮
    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮
    geocoder: false,//是否显示geocoder小器件，右上角查询按钮    
    homeButton: false,//是否显示Home按钮，右上角home按钮 
    sceneMode: Cesium.SceneMode.SCENE3D,//初始场景模式
    sceneModePicker: false,//是否显示3D/2D选择器，右上角按钮 
    navigationHelpButton: false,//是否显示右上角的帮助按钮  
    selectionIndicator: false,//是否显示选取指示器组件   
    timeline: false,//是否显示时间轴    
    infoBox: false,//是否显示信息框   
    scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源  
    orderIndependentTranslucency: false, //是否启用无序透明
    contextOptions: { webgl: { alpha: true } },
    skyBox: new Cesium.SkyBox({ show: false })
})

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(116.36485552299206, 39.99754814959118, 5000.0)
});

/**
 * 水波纹扩散材质
 * @param {*} options
 * @param {String} options.color 颜色
 * @param {Number} options.duration 持续时间 毫秒
 * @param {Number} options.count 波浪数量
 * @param {Number} options.gradient 渐变曲率
 */
function CircleWaveMaterialProperty(options) {
    this._definitionChanged = new Cesium.Event();
    this.color = Cesium.defaultValue(options.color && new Cesium.Color.fromCssColorString(options.color), Cesium.Color.RED);
    this.duration = Cesium.defaultValue(options.duration, 1000);
    this.count = Cesium.defaultValue(options.count, 2);
    if (this.count <= 0) {
        this.count = 1;
    }
    this.gradient = Cesium.defaultValue(options.gradient, 0.1);
    if (this.gradient > 1) {
        this.gradient = 1;
    }
    this.time = new Date().getTime();
}
Object.defineProperties(CircleWaveMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        },
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        },
    },
    color: Cesium.createPropertyDescriptor('color'),
    gradient: Cesium.createPropertyDescriptor('gradient'),
    duration: Cesium.createPropertyDescriptor('duration'),
    count: Cesium.createPropertyDescriptor('count'),
});
CircleWaveMaterialProperty.prototype.getType = function () {
    return Cesium.Material.CircleWaveMaterialType;
};
CircleWaveMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this.color, time, Cesium.Color.WHITE, result.color);
    result.time = ((new Date().getTime() - this.time) % this.duration) / this.duration;
    result.count = this.count;
    result.gradient = 1 + 10 * (1 - this.gradient);
    return result;
};
CircleWaveMaterialProperty.prototype.equals = function (other) {
    const reData =
        this === other ||
        (other instanceof CircleWaveMaterialProperty
            && Cesium.Property.equals(this.color, other.color)
            && Cesium.Property.equals(this.duration, other.duration)
            && Cesium.Property.equals(this.count, other.count)
            && Cesium.Property.equals(this.gradient, other.gradient));
    return reData;
};
Cesium.Material.CircleWaveMaterialType = 'CircleWaveMaterial';
Cesium.Material.CircleWaveSource = `
              czm_material czm_getMaterial(czm_materialInput materialInput) {
                czm_material material = czm_getDefaultMaterial(materialInput);
                material.diffuse = 1.5 * color.rgb;
                vec2 st = materialInput.st;
                vec3 str = materialInput.str;
                float dis = distance(st, vec2(0.5, 0.5));
                float per = fract(time);
                if (abs(str.z) > 0.001) {
                  discard;
                }
                if (dis > 0.5) {
                  discard;
                } else {
                  float perDis = 0.5 / count;
                  float disNum;
                  float bl = .0;
                  for (int i = 0; i <= 9; i++) {
                    if (float(i) <= count) {
                      disNum = perDis *float(i) - dis + per / count;
                      if (disNum > 0.0) {
                        if (disNum < perDis) {
                          bl = 1.0 - disNum / perDis;
                        } else if(disNum - perDis < perDis) {
                          bl = 1.0 - abs(1.0 - disNum / perDis);
                        }
                        material.alpha = pow(bl, gradient);
                      }
                    }
                  }
                }
                return material;
              }
              `;
Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleWaveMaterialType, {
    fabric: {
        type: Cesium.Material.CircleWaveMaterialType,
        uniforms: {
            color: new Cesium.Color(181, 241, 254, 1),
            time: 1,
            count: 1,
            gradient: 0.1,
        },
        source: Cesium.Material.CircleWaveSource,
    },
    translucent: function () {
        return true;
    },
});
// Cesium.CircleWaveMaterialProperty = CircleWaveMaterialProperty;

    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.36485552299206, 39.99754814959118, 100),
        ellipse: {
            semiMinorAxis: 1000,
            semiMajorAxis: 1000,
            height: 10,
            material: new CircleWaveMaterialProperty({
                color: '#FFCB33',
                duration: 3000,
                gradient: 0,
                count: 4,
            }),
        },
    })
    