import * as Cesium from 'cesium'

const box = document.getElementById('box')
const viewer = new Cesium.Viewer(box, {
    animation: false,
    baseLayerPicker: false,
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
        Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')
    ),
    fullscreenButton: false,
    timeline: false,
    infoBox: false,
    selectionIndicator: false,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    sceneModePicker: false,
})

viewer.scene.globe.enableLighting = false
viewer.scene.fog.enabled = true
viewer.scene.fog.density = 0.00018
viewer.scene.screenSpaceCameraController.enableCollisionDetection = false

const data = [
    { lng: 125.324, lat: 43.886, name: '长春', value: 78 },
    { lng: 114.514, lat: 38.042, name: '石家庄', value: 85 },
    { lng: 117.284, lat: 34.205, name: '徐州', value: 72 },
    { lng: 110.290, lat: 25.274, name: '桂林', value: 58 },
    { lng: 104.679, lat: 31.467, name: '绵阳', value: 66 },
    { lng: 100.451, lat: 38.925, name: '张掖', value: 62 },
]

// 与 cesium-sdk/src/CesiumBar.ts 的 defaultBarStyleOptions 保持一致。
const defaultStyle = {
    appearance: 'beam',
    ringSpeed: 0.7,
    color: '#FBDF88',
    diameter: 10000,
    height: 280000,
    slices: 4,
    angle: 45,
    opacity: 1,
    gradient: true,
    topColor: '#EA580C',
    outline: false,
    outlineColor: '#BAF5FF',
    edgeColor: '#EA580C',
    capColor: '#EA580C',
    glow: 1,
    stripeCount: 0,
    stripeOpacity: 0,
    showHalo: true,
    showBaseRing: true,
    showLabel: true,
    labelColor: '#FFF4DB',
    labelBackground: '#00000000',
    labelFontSize: 14,
    labelOffset: 12,
}

const state = { heightScale: 1, labels: true, rings: true, rotate: false }
const assetRoot = new URL('files/images/', window.parent.location.href).href
const ringImage = `${assetRoot}bar-ring.png`
const glowImage = `${assetRoot}bar-glow.png`
const toColor = (value) => Cesium.Color.fromCssColorString(value)
const owned = []


let columnRegistered = false
class ColumnMaterial {
    constructor(paint) {
        this.paint = paint
        this.definitionChanged = new Cesium.Event()
        this.isConstant = true
        if (columnRegistered) return
        Cesium.Material._materialCache.addMaterial('GoViewColumnGradient', {
            fabric: {
                type: 'GoViewColumnGradient',
                uniforms: { bottomColor: Cesium.Color.WHITE, topColor: Cesium.Color.WHITE, edgeColor: Cesium.Color.WHITE, capColor: Cesium.Color.WHITE, columnHeight: 1, glow: 0.8, stripeCount: 6, stripeOpacity: 0.2, demoStyle: 0, base: Cesium.Cartesian3.ZERO, up: Cesium.Cartesian3.UNIT_Z, worldFrame: 0 },
                source: `czm_material czm_getMaterial(czm_materialInput materialInput) {
                    czm_material material = czm_getDefaultMaterial(materialInput);
                    vec3 localPosition = (czm_inverseModelView * vec4(-materialInput.positionToEyeEC, 1.0)).xyz;
                    float heightRatio = clamp(localPosition.z / columnHeight + 0.5, 0.0, 1.0);
                    if (worldFrame > 0.5) {
                        vec3 worldPosition = (czm_inverseView * vec4(-materialInput.positionToEyeEC, 1.0)).xyz;
                        heightRatio = clamp(dot(worldPosition - base, up) / columnHeight, 0.0, 1.0);
                    }
                    if (demoStyle > 0.5) {
                        vec4 tint = mix(bottomColor, topColor, heightRatio);
                        material.diffuse = vec3(0.0);
                        material.emission = tint.rgb;
                        material.alpha = tint.a;
                        return material;
                    }
                    float cap = smoothstep(0.82, 1.0, heightRatio);
                    float edge = pow(1.0 - abs(dot(normalize(materialInput.normalEC), normalize(materialInput.positionToEyeEC))), 2.0);
                    float band = stripeCount > 0.0 ? 1.0 - smoothstep(0.42, 0.5, abs(fract(heightRatio * stripeCount) - 0.5)) : 0.0;
                    vec4 color = mix(bottomColor, topColor, smoothstep(0.0, 1.0, heightRatio));
                    color.rgb = mix(color.rgb, capColor.rgb, cap * 0.75);
                    color.rgb += edgeColor.rgb * edge * glow * 0.42;
                    color.rgb += topColor.rgb * band * stripeOpacity;
                    material.diffuse = color.rgb * 0.68;
                    material.emission = color.rgb * (0.24 + edge * glow * 0.45 + cap * glow * 0.2);
                    material.specular = 0.65;
                    material.shininess = 48.0;
                    material.alpha = color.a;
                    return material;
                }`,
            },
            translucent: (material) => material.uniforms.bottomColor.alpha < 1 || material.uniforms.topColor.alpha < 1,
        })
        columnRegistered = true
    }

    getType() { return 'GoViewColumnGradient' }
    getValue(_time, result = {}) {
        const bottom = toColor(this.paint.color)
        const top = toColor(this.paint.topColor || this.paint.color)
        bottom.alpha *= this.paint.opacity
        top.alpha *= this.paint.opacity
        result.bottomColor = bottom
        result.topColor = top
        result.edgeColor = toColor(this.paint.edgeColor || this.paint.topColor || this.paint.color)
        result.capColor = toColor(this.paint.capColor || this.paint.topColor || this.paint.color)
        result.edgeColor.alpha *= this.paint.opacity
        result.capColor.alpha *= this.paint.opacity
        result.columnHeight = this.paint.height
        result.base = this.paint.base || Cesium.Cartesian3.ZERO
        result.up = this.paint.up || Cesium.Cartesian3.UNIT_Z
        result.worldFrame = this.paint.base ? 1 : 0
        result.demoStyle = this.paint.appearance === 'beam' ? 1 : 0
        result.glow = this.paint.glow || 0.8
        result.stripeCount = Math.max(0, this.paint.stripeCount || 0)
        result.stripeOpacity = Math.max(0, Math.min(1, this.paint.stripeOpacity || 0))
        return result
    }
    equals(other) { return other === this }
}

let accentRegistered = false
const accentEpoch = performance.now()
class ColumnAccentMaterial {
    constructor(color, ring, speed = 0) {
        this.color = color
        this.ring = ring
        this.speed = speed
        this.definitionChanged = new Cesium.Event()
        if (accentRegistered) return
        Cesium.Material._materialCache.addMaterial('GoViewColumnAccent', {
            fabric: {
                type: 'GoViewColumnAccent',
                uniforms: { image: ringImage, color: Cesium.Color.WHITE, rotation: 0, ring: 0 },
                source: `czm_material czm_getMaterial(czm_materialInput materialInput) {
                    czm_material material = czm_getDefaultMaterial(materialInput);
                    vec2 uv = materialInput.st;
                    if (ring > 0.5) {
                        vec2 p = uv - 0.5;
                        float c = cos(rotation), s = sin(rotation);
                        uv = mat2(c, -s, s, c) * p + 0.5;
                    }
                    vec4 texel = texture(image, uv);
                    float mask = texel.r * texel.a;
                    if (ring > 0.5) mask *= texel.r;
                    material.diffuse = vec3(0.0);
                    material.emission = color.rgb;
                    material.alpha = color.a * mask;
                    return material;
                }`,
            },
            translucent: () => true,
        })
        accentRegistered = true
    }
    get isConstant() { return !this.ring || this.speed === 0 }
    getType() { return 'GoViewColumnAccent' }
    getValue(_time, result = {}) {
        result.image = this.ring ? ringImage : glowImage
        result.color = this.color
        result.ring = this.ring ? 1 : 0
        result.rotation = (performance.now() - accentEpoch) / 1000 * this.speed
        return result
    }
    equals(other) { return other === this }
}

function surfaceUp(lng, lat) {
    const lon = Cesium.Math.toRadians(lng)
    const latitude = Cesium.Math.toRadians(lat)
    return new Cesium.Cartesian3(Math.cos(latitude) * Math.cos(lon), Math.cos(latitude) * Math.sin(lon), Math.sin(latitude))
}

function paintFor(style, base, up) {
    return { ...style, base, up }
}

function createBars() {
    owned.splice(0).forEach(group => group.forEach(entity => viewer.entities.remove(entity)))
    const style = { ...defaultStyle, appearance: 'beam', height: defaultStyle.height * state.heightScale }
    data.forEach((item, index) => {
        const height = style.height * item.value / 100
        const base = Cesium.Cartesian3.fromDegrees(item.lng, item.lat, 0)
        const center = Cesium.Cartesian3.fromDegrees(item.lng, item.lat, height / 2)
        const up = surfaceUp(item.lng, item.lat)
        const color = toColor(style.color)
        const group = []
        const common = { name: item.name, properties: { goviewId: 'cesiumSdkBar', value: item.value } }
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(center, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(style.angle), 0, 0))

        const core = viewer.entities.add({ id: `cesium-sdk-bar-${index}`, ...common, position: base, orientation, cylinder: { length: height, topRadius: style.diameter / 2, bottomRadius: style.diameter / 2, slices: style.slices, numberOfVerticalLines: style.slices, material: new ColumnMaterial(paintFor({ ...style, height }, base, up)), outline: style.outline, outlineColor: toColor(style.outlineColor), heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND } })
        const haloStyle = { ...style, color: style.edgeColor, topColor: style.topColor, capColor: style.edgeColor, opacity: Math.min(0.28, style.opacity * 0.24), glow: Math.max(0.8, style.glow), diameter: style.diameter * 1.44, gradient: true }
        const halo = viewer.entities.add({ id: `cesium-sdk-bar-${index}-halo`, ...common, position: base, orientation, cylinder: { length: height, topRadius: haloStyle.diameter / 2, bottomRadius: haloStyle.diameter / 2, slices: 24, material: new ColumnMaterial(paintFor(haloStyle, base, up)), outline: false, heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND }, show: false })

        const ringColor = style.appearance === 'beam' ? Cesium.Color.WHITE.withAlpha(style.opacity) : toColor(style.edgeColor).withAlpha(.75)
        const ringSize = style.diameter * (style.appearance === 'beam' ? 3.55 : 1.45)
        const ring = viewer.entities.add({ id: `cesium-sdk-bar-${index}-ring`, ...common, position: base, ellipse: { semiMajorAxis: ringSize, semiMinorAxis: ringSize, material: style.appearance === 'beam' ? new ColumnAccentMaterial(ringColor, true, style.ringSpeed) : new Cesium.ColorMaterialProperty(ringColor), fill: style.appearance === 'beam', outline: style.appearance !== 'beam', outlineColor: ringColor, heightReference: Cesium.HeightReference.CLAMP_TO_GROUND }, show: style.showBaseRing && state.rings })

        const label = viewer.entities.add({ id: `cesium-sdk-bar-${index}-label`, ...common, position: Cesium.Cartesian3.fromDegrees(item.lng, item.lat, height), label: { text: item.name + String.fromCharCode(10) + item.value, font: `600 ${style.labelFontSize}px sans-serif`, fillColor: toColor(style.labelColor), style: Cesium.LabelStyle.FILL, showBackground: true, backgroundColor: toColor(style.labelBackground), backgroundPadding: new Cesium.Cartesian2(8, 5), verticalOrigin: Cesium.VerticalOrigin.BOTTOM, pixelOffset: new Cesium.Cartesian2(0, -style.labelOffset), heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND, disableDepthTestDistance: Number.POSITIVE_INFINITY, show: style.showLabel && state.labels } })

        group.push(core, halo, ring, label)
        for (let sheetIndex = 0; sheetIndex < 3; sheetIndex++) {
            const angle = sheetIndex * Math.PI / 3
            const sheet = viewer.entities.add({ id: `cesium-sdk-bar-${index}-sheet-${sheetIndex}`, ...common, position: center, orientation, plane: { plane: new Cesium.Plane(new Cesium.Cartesian3(Math.cos(angle), Math.sin(angle), 0), 0), dimensions: new Cesium.Cartesian2(style.diameter * 5, height), material: new ColumnAccentMaterial(toColor(style.topColor || style.color).withAlpha(Math.min(.8, style.opacity * style.glow * .4)), false), outline: false }, show: style.appearance === 'beam' && style.showHalo })
            group.push(sheet)
        }
        owned.push(group)
    })
}

function updateBars() {
    const style = { ...defaultStyle, appearance: 'beam', height: defaultStyle.height * state.heightScale }
    data.forEach((item, index) => {
        const group = owned[index]
        if (!group) return
        const height = style.height * item.value / 100
        const base = Cesium.Cartesian3.fromDegrees(item.lng, item.lat, 0)
        const center = Cesium.Cartesian3.fromDegrees(item.lng, item.lat, height / 2)
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(center, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(style.angle), 0, 0))
        const core = group[0]
        const halo = group[1]
        const ring = group[2]
        const label = group[3]
        core.position = base
        core.orientation = orientation
        core.cylinder.length = height
        core.cylinder.material.paint = paintFor({ ...style, height }, base, surfaceUp(item.lng, item.lat))
        halo.cylinder.material.paint = paintFor({ ...style, color: style.edgeColor, topColor: style.topColor, capColor: style.edgeColor, opacity: Math.min(0.28, style.opacity * 0.24), glow: Math.max(0.8, style.glow), diameter: style.diameter * 1.44, gradient: true, height }, base, surfaceUp(item.lng, item.lat))
        halo.position = base
        halo.orientation = orientation
        halo.cylinder.length = height
        halo.show = false
        ring.position = base
        ring.show = state.rings
        label.position = Cesium.Cartesian3.fromDegrees(item.lng, item.lat, height)
        label.label.show = state.labels
        group.slice(4).forEach(sheet => {
            sheet.position = center
            sheet.plane.dimensions = new Cesium.Cartesian2(style.diameter * 5, height)
            sheet.show = style.showHalo
        })
    })
    viewer.scene.requestRender()
}
let pendingHeightUpdate = 0
function scheduleHeightUpdate() {
    if (pendingHeightUpdate) return
    pendingHeightUpdate = requestAnimationFrame(() => {
        pendingHeightUpdate = 0
        updateBars()
    })
}
function frame() {
    viewer.flyTo(owned.map(group => group[0]), { duration: 0.8, offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-38), 0) })
}

const root = document.createElement('div')
root.innerHTML = `<style>
.bar-demo { position:absolute; inset:18px; z-index:5; pointer-events:none; color:#e9f5f5; font-family:"Segoe UI","Microsoft YaHei",sans-serif; }
.bar-demo__head { max-width:440px; padding:18px 20px 16px; border:1px solid rgba(126,224,220,.28); border-left:3px solid #65d7df; background:linear-gradient(125deg,rgba(5,22,31,.94),rgba(5,22,31,.46)); box-shadow:0 18px 55px rgba(0,0,0,.35); backdrop-filter:blur(12px); }
.bar-demo__eyebrow { margin:0 0 5px; color:#65d7df; font:600 11px/1.2 ui-monospace,monospace; letter-spacing:.18em; text-transform:uppercase; }
.bar-demo h1 { margin:0; color:#fff6d2; font:700 27px/1.1 Georgia,serif; }
.bar-demo__sub { margin:8px 0 0; color:rgba(233,245,245,.68); font-size:12px; }
.bar-demo__panel { position:absolute; right:0; top:0; width:208px; padding:16px; pointer-events:auto; border:1px solid rgba(126,224,220,.23); background:rgba(5,22,31,.78); box-shadow:0 18px 55px rgba(0,0,0,.28); backdrop-filter:blur(12px); }
.bar-demo__panel strong { display:block; margin-bottom:13px; color:#fff6d2; font-size:12px; letter-spacing:.09em; text-transform:uppercase; }
.bar-demo__row { display:flex; align-items:center; justify-content:space-between; gap:10px; margin:10px 0; color:rgba(233,245,245,.8); font-size:12px; }
.bar-demo input[type=range] { width:96px; accent-color:#65d7df; }
.bar-demo button { width:100%; margin-top:5px; padding:9px 10px; border:1px solid rgba(126,224,220,.35); color:#e9f5f5; background:rgba(101,215,223,.1); cursor:pointer; font:inherit; font-size:12px; }
.bar-demo__legend { position:absolute; bottom:1px; left:0; padding:9px 12px; border:1px solid rgba(126,224,220,.2); color:rgba(233,245,245,.7); background:rgba(5,22,31,.66); font-size:11px; }
</style>
<div class="bar-demo"><div class="bar-demo__panel">
<strong>图层参数</strong><label class="bar-demo__row"><span>高度倍率</span><input id="bar-height" type="range" min="0.55" max="1.55" step="0.05" value="1"><b id="bar-height-value">1.00×</b></label><label class="bar-demo__row"><span>城市标签</span>
<input id="bar-labels" type="checkbox" checked></label><label class="bar-demo__row"><span>底部光环</span><input id="bar-rings" type="checkbox" checked></label><button id="bar-rotate">开始自动旋转</button><button id="bar-reset">重新取景</button></div>
<div class="bar-demo__legend">SDK defaultBarStyleOptions · ${data.length} 个样本</div></div>`

box.appendChild(root)

createBars()
frame()
const heightInput = root.querySelector('#bar-height')
const heightValue = root.querySelector('#bar-height-value')
heightInput.addEventListener('input', event => { state.heightScale = Number(event.target.value); heightValue.textContent = `${state.heightScale.toFixed(2)}×`; scheduleHeightUpdate() })
root.querySelector('#bar-labels').addEventListener('change', event => { state.labels = event.target.checked; updateBars() })
root.querySelector('#bar-rings').addEventListener('change', event => { state.rings = event.target.checked; updateBars() })
root.querySelector('#bar-reset').addEventListener('click', frame)
const rotateButton = root.querySelector('#bar-rotate')
rotateButton.addEventListener('click', () => { state.rotate = !state.rotate; rotateButton.textContent = state.rotate ? '停止自动旋转' : '开始自动旋转' })
viewer.clock.onTick.addEventListener(() => { if (state.rotate) viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -0.00045) })
viewer.screenSpaceEventHandler.setInputAction(click => {
    const entity = viewer.scene.pick(click.position)?.id
    if (entity?.properties?.value) viewer.selectedEntity = entity
}, Cesium.ScreenSpaceEventType.LEFT_CLICK)







