// Half of the code is from krew's dist.min.js so dont sue me :)

import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { map as SHIPSMAP } from "./data/ships.js";


window.THREE = THREE; // for debug

const OBJLoader = THREE.OBJLoader;

const SHIPSLIST = Object.keys(SHIPSMAP)

console.log(THREE.scene)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.far = 10

camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.update();

const environment = new Object(),
    loader = new THREE.TextureLoader(),
    water_tex = loader.load('https://krew.io/assets/models/misc/water.jpg');

let refresh = () => {};
const GlobalParams = {
    'Day': true,
    'Ships': false,
    loadShip: () => loadShipFromGUI()
};
const guiparams = {
    x: 0,
    z: 0,
    y: 0,
    scale: 1,
    rotation: 0,
}
let controllers = new Array()
const gui = new dat.GUI({
    name: 'GUI'
});
const day = gui.add(GlobalParams, 'Day')

const spawnerGUI = gui.addFolder('Spawner')
spawnerGUI.add(GlobalParams, 'loadShip')
spawnerGUI
    .add(GlobalParams, 'Ships')
    .options(SHIPSLIST)
    .name('Ship to Load')
const shipsGUI = gui.addFolder('Ships')
const shipsGUIList = new Object();
const seadog = gui.addFolder('Seadog')
controllers = [seadog.add(guiparams, 'x', -30, 30),
    seadog.add(guiparams, 'y', -30, 30),
    seadog.add(guiparams, 'z', -30, 30),
    seadog.add(guiparams, 'scale', 1, 100),
    seadog.add(guiparams, 'rotation', 0, 360, 1)
]
const f = {
    boat :  new THREE.MeshLambertMaterial({
        color: 9064510
    }),
    sail : new THREE.MeshLambertMaterial({
        color: 16777215,
        side : THREE.DoubleSide
    }),
    sky : new THREE.MeshBasicMaterial({
        color: 50687,
        side: THREE.DoubleSide
    
})
}
water_tex.wrapS=water_tex.wrapT=THREE.RepeatWrapping
scene.background = new THREE.Color(11789311), scene.fog = new THREE.FogExp2(11789311, .007)
const light = new THREE.AmbientLight(13952255, .3); scene.add(light);const s = new THREE.Mesh(new THREE.PlaneBufferGeometry(3750, 3750), f.sky); s.rotation.x = .5 * -Math.PI, s.position.set(1250, 90, 1250), scene.add(s);const n = new THREE.Mesh(new THREE.SphereGeometry(5e3), f.sky); n.position.set(1250, 0, 1250), scene.add(n);const light3 = new THREE.DirectionalLight(16768939, 1); light3.position.set(0, 10, 20), light3.castShadow = !0, scene.add(light3)
{   
     const Water = function(e, t) {
                THREE.Mesh.call(this, e);
                let i = this,
                    o = void 0 !== (t = t || {}).textureWidth ? t.textureWidth : 512,
                    a = void 0 !== t.textureHeight ? t.textureHeight : 512,
                    s = void 0 !== t.clipBias ? t.clipBias : 0,
                    n = void 0 !== t.alpha ? t.alpha : 1,
                    r = void 0 !== t.time ? t.time : 0,
                    l = void 0 !== t.waterNormals ? t.waterNormals : null,
                    d = void 0 !== t.sunDirection ? t.sunDirection : new THREE.Vector3(.70707, .70707, 0),
                    h = new THREE.Color(void 0 !== t.sunColor ? t.sunColor : 16777215),
                    c = new THREE.Color(void 0 !== t.waterColor ? t.waterColor : 50687),
                    p = void 0 !== t.eye ? t.eye : new THREE.Vector3(0, 0, 0),
                    m = void 0 !== t.distortionScale ? t.distortionScale : 20,
                    u = void 0 !== t.side ? t.side : THREE.FrontSide,
                    g = void 0 !== t.fog && t.fog,
                    b = new THREE.Plane,
                    y = new THREE.Vector3,
                    f = new THREE.Vector3,
                    v = new THREE.Vector3,
                    w = new THREE.Matrix4,
                    $ = new THREE.Vector3(0, 0, -1),
                    k = new THREE.Vector4,
                    x = new THREE.Vector3,
                    C = new THREE.Vector3,
                    E = new THREE.Vector4,
                    T = new THREE.Matrix4;
                let mirrorCamera = new THREE.PerspectiveCamera;
                let S = {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBFormat,
                    stencilBuffer: !1
                },
                    mirrorSampler = {
                        value: null
                    },
                    alpha = {
                        value: 1
                    },
                    time = {
                        value: 0
                    },
                    size = {
                        value: 1
                    },
                    distortionScale = {
                        value: 20
                    },
                    textureMatrix = {
                        value: new THREE.Matrix4
                    },
                    sunColor = {
                        value: new THREE.Color(8355711)
                    },
                    sunDirection = {
                        value: new THREE.Vector3(0, .70707, .70707)
                    },
                    eye = {
                        value: new THREE.Vector3
                    },
                    waterColor = {
                        value: new THREE.Color(50687)
                    };
                vertexShader= ["uniform mat4 textureMatrix;", "uniform float time;", "varying vec4 mirrorCoord;", "varying vec4 worldPosition;", "#include <common>", "#include <fog_pars_vertex>", "#include <shadowmap_pars_vertex>", "#include <logdepthbuf_pars_vertex>", "void main() {", "\tmirrorCoord = modelMatrix * vec4( position, 1.0 );", "\tworldPosition = mirrorCoord.xyzw;", "\tmirrorCoord = textureMatrix * mirrorCoord;", "\tvec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );", "\tgl_Position = projectionMatrix * mvPosition;", "#include <beginnormal_vertex>", "#include <defaultnormal_vertex>", "#include <logdepthbuf_vertex>", "#include <fog_vertex>", "#include <shadowmap_vertex>", "}"].join("\n"),
                fragmentShader= ["uniform sampler2D mirrorSampler;", "uniform float alpha;", "uniform float time;", "uniform float size;", "uniform float distortionScale;", "uniform sampler2D normalSampler;", "uniform vec3 sunColor;", "uniform vec3 sunDirection;", "uniform vec3 eye;", "uniform vec3 waterColor;", "varying vec4 mirrorCoord;", "varying vec4 worldPosition;", "vec4 getNoise( vec2 uv ) {", "\tvec2 uv0 = ( uv / 103.0 ) + vec2(time / 107.0, time / 209.0);", "\tvec2 uv1 = uv / 107.0-vec2( time / -199.0, time / 310.0 );", "\tvec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );", "\tvec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );", "\tvec4 noise = texture2D( normalSampler, uv0 ) +", "\t\ttexture2D( normalSampler, uv1 ) +", "\t\ttexture2D( normalSampler, uv2 ) +", "\t\ttexture2D( normalSampler, uv3 );", "\treturn noise * 0.5 - 1.0;", "}", "void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {", "\tvec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );", "\tfloat direction = max( 0.0, dot( eyeDirection, reflection ) );", "\tspecularColor += pow( direction, shiny ) * sunColor * spec;", "\tdiffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;", "}", "#include <common>", "#include <packing>", "#include <bsdfs>", "#include <fog_pars_fragment>", "#include <logdepthbuf_pars_fragment>", "#include <lights_pars_begin>", "#include <shadowmap_pars_fragment>", "#include <shadowmask_pars_fragment>", "void main() {", "#include <logdepthbuf_fragment>", "\tvec4 noise = getNoise( worldPosition.xz * size );", "\tvec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );", "\tvec3 diffuseLight = vec3(0.0);", "\tvec3 specularLight = vec3(0.0);", "\tvec3 worldToEye = eye-worldPosition.xyz;", "\tvec3 eyeDirection = normalize( worldToEye );", "\tsunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );", "\tfloat distance = length(worldToEye);", "\tvec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;", "\tvec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );", "\tfloat theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );", "\tfloat rf0 = 0.3;", "\tfloat reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );", "\tvec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;", "\tvec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);", "\tvec3 outgoingLight = albedo;", "\tgl_FragColor = vec4( outgoingLight, alpha );", "#include <tonemapping_fragment>", "#include <fog_fragment>", "}"].join("\n")
            R = new THREE.ShaderMaterial({
                fragmentShader: I.fragmentShader,
                vertexShader: I.vertexShader,
                uniforms: THREE.UniformsUtils.clone(I.uniforms),
                lights: !0,
                side: u,
                fog: g
            });
        R.uniforms.mirrorSampler.value = M.texture, R.uniforms.textureMatrix.value = T, R.uniforms.alpha.value = n, R.uniforms.time.value = r, R.uniforms.normalSampler.value = l, R.uniforms.sunColor.value = h, R.uniforms.waterColor.value = c, R.uniforms.sunDirection.value = d, R.uniforms.distortionScale.value = m, R.uniforms.eye.value = p, i.material = R, i.onBeforeRender = function (e, t, o) {
            if (f.setFromMatrixPosition(i.matrixWorld), v.setFromMatrixPosition(o.matrixWorld), w.extractRotation(i.matrixWorld), y.set(0, 0, 1), y.applyMatrix4(w), x.subVectors(f, v), x.dot(y) > 0) return;
            x.reflect(y).negate(), x.add(f), w.extractRotation(o.matrixWorld), $.set(0, 0, -1), $.applyMatrix4(w), $.add(v), C.subVectors(f, $), C.reflect(y).negate(), C.add(f), mirrorCamera.position.copy(x), mirrorCamera.up.set(0, 1, 0), mirrorCamera.up.applyMatrix4(w), mirrorCamera.up.reflect(y), mirrorCamera.lookAt(C), mirrorCamera.far = o.far, mirrorCamera.updateMatrixWorld(), mirrorCamera.projectionMatrix.copy(o.projectionMatrix), T.set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1), T.multiply(mirrorCamera.projectionMatrix), T.multiply(mirrorCamera.matrixWorldInverse), b.setFromNormalAndCoplanarPoint(y, f), b.applyMatrix4(mirrorCamera.matrixWorldInverse), k.set(b.normal.x, b.normal.y, b.normal.z, b.constant);
            let a = mirrorCamera.projectionMatrix;
            if (E.x = (Math.sign(k.x) + a.elements[8]) / a.elements[0], E.y = (Math.sign(k.y) + a.elements[9]) / a.elements[5], E.z = -1, E.w = (1 + a.elements[10]) / a.elements[14], k.multiplyScalar(2 / k.dot(E)), a.elements[2] = k.x, a.elements[6] = k.y, a.elements[10] = k.z + 1 - s, a.elements[14] = k.w, p.setFromMatrixPosition(o.matrixWorld), e.outputEncoding !== THREE.LinearEncoding) return console.warn("THREE.Water: WebGLRenderer must use LinearEncoding as outputEncoding."), void(i.onBeforeRender = function () {});
            if (e.toneMapping !== THREE.NoToneMapping) return console.warn("THREE.Water: WebGLRenderer must use NoToneMapping as toneMapping."), void(i.onBeforeRender = function () {});
            let n = e.getRenderTarget(),
                r = e.shadowMap.autoUpdate;
            i.visible = !1, e.shadowMap.autoUpdate = !1, e.setRenderTarget(M), e.state.buffers.depth.setMask(!0), !1 === e.autoClear && e.clear(), e.render(t, mirrorCamera), i.visible = !0, e.shadowMap.autoUpdate = r, e.setRenderTarget(n)
        }
        return (this.prototype = Object.create(THREE.Mesh.prototype)).constructor = this, this
    }
    Water.prototype = Object.create(THREE.Mesh.prototype);
    Water.prototype.constructor = Water;
    var e = new THREE.PlaneBufferGeometry(6e3, 6e3);
    const water = new Water(e, {
        textureWidth: 1024,
        textureHeight: 1024,
        waterNormals: water_tex,
        alpha: 1,
        sunDirection: light.position.clone().normalize(),
        sunColor: 16944987,
        waterColor: 9531820,
        distortionScale: 10,
        fog: void 0 !== scene.fog
    });
    water.rotation.x = -Math.PI / 2;
    scene.add(water)
}

scene.background = new THREE.Color(11789311);

let render = (value) => {
    let filter = {
        r: 0,
        g: 197,
        b: 255
    };
    let start = {
        r: 0,
        g: 36,
        b: 112
    };
    let color = {
        r: 191,
        g: 240,
        b: 255
    };
    let i = {
        r: 6,
        g: 0,
        b: 31
    };
    if (1 === value) {
        let e = 0;
        let logIntervalId = setInterval(() => {
            e++;
            light.intensity -= .02;
            light3.intensity -= .02
            scene.fog.color.set(get(color, i, e / 100));
            scene.background = new THREE.Color(get(color, i, e / 100));
            if (100 === e) {
                clearInterval(logIntervalId);
            }
        }, 20);
    } else {
        if (0 === value) {
            let e = 0;
            let logIntervalId = setInterval(() => {
                e++;
                light.intensity += .02;
                light3.intensity += .02;
                scene.fog.color.set(get(i, color, e / 100));
                scene.background = new THREE.Color(get(i, color, e / 100));
                if (100 === e) {
                    clearInterval(logIntervalId);
                }
            }, 20);
        } else {
            if (0 === value) {
                let e = 0;
                let logIntervalId = setInterval(() => {
                    e++;
                    light.intensity += .02;
                    scene.fog.color.set(get(i, color, e / 100));
                    scene.background = new THREE.Color(get(i, color, e / 100));
                    if (100 === e) {
                        clearInterval(logIntervalId);
                    }
                }, 20);
            }
        }
    };
}

let get = (rgb1, rgb2, p) => {
    let o = Math.round((rgb2.r - rgb1.r) * p + rgb1.r);
    let d = Math.round((rgb2.g - rgb1.g) * p + rgb1.g);
    let stop = Math.round((rgb2.b - rgb1.b) * p + rgb1.b);
    return 16777216 + 65536 * (o < 255 ? o < 1 ? 0 : o : 255) + 256 * (d < 255 ? d < 1 ? 0 : d : 255) + (stop < 255 ? stop < 1 ? 0 : stop : 255);
};
day.onChange(() => {
    if (GlobalParams.Day) {
        render(0)
    } else render(1)
})

const loadShipFromGUI = () => {
    const shipName = GlobalParams.Ships
    if (!shipName) {
        alert('Please select a ship before spawning it...')
    } else {
        const ship = SHIPSMAP[shipName]
        if (ship) {
            let parent = shipsGUIList[ship.t]
            if (!parent) {
                parent = {
                    gui: shipsGUI.addFolder(shipName),
                    count: 0,
                    guis: []
                }
                shipsGUIList[ship.t] = parent
            }
            const shipGUI = parent.gui.addFolder(`${shipName} #${parent.count+1}`)
            parent.guis.push(shipGUI)
            parent.count += 1;
            const [x, y, z] = ship.offset
            const scale = ship.scale
            const shipParams = {
                x: x,
                z: z,
                y: y,
                scale: scale,
                rotateVal: 0,
                rotate: () => {},
                destroy: () => {}
            }
            const Scontrollers = [
                shipGUI.add(shipParams, 'x', -100 - x, 100 + x),
                shipGUI.add(shipParams, 'y', -100 - y, 100 + y),
                shipGUI.add(shipParams, 'z', -100 - z, 100 + z),
                shipGUI.add(shipParams, 'scale', 0.1, 100),
                shipGUI.add(shipParams, 'rotateVal', -360, 360),

            ]
            const IControllers = {
                rotate: shipGUI.add(shipParams, 'rotate'),
                destroy: shipGUI.add(shipParams, 'destroy')
            }
            loadShip(ship, shipGUI, shipParams, Scontrollers, parent)
        }
    }
}
// load a resource
const loadShip = (ship, shipGUI, params, Scontrollers, p) => {
    const textureLoader = new THREE.TextureLoader();
    const objloader = new OBJLoader();
    const map = textureLoader.load('https://krew.io/assets/models/ships/tex.png');
    const shipMat = new THREE.MeshPhongMaterial({
        map: map
    })
    objloader.load(
        `https://krew.io/assets/models/ships/${ship.t}.obj`,
        function (o) {
            if (!ship.o)
                o.traverse(mesh => {
                    if (mesh.isMesh) mesh.material = shipMat
                })
            else {
                if (o.children.length == 2) {
                    o.children[0].material = f.sail;
                    o.children[1].material = f.boat;
                } else {
                    o.children.forEach(t => t.material = f.boat)
                }

            }
            scene.add(o);
            o.position.set(params.x, params.y, params.z)
            o.scale.set(params.scale * 0.1, params.scale * 0.1, params.scale * 0.1)
            ship.rot ? o.rotateY(ship.rot * Math.PI / 2) : null;
            const Crefresh = () => {
                o.position.set(params.x, params.y, params.z)
                o.scale.set(params.scale * 0.1, params.scale * 0.1, params.scale * 0.1)

            }
            Scontrollers.forEach(t =>
                t.onChange(() => {
                    Crefresh()
                })
            )
            params.destroy = () => {
                p.gui.removeFolder(shipGUI)
                p.guis.splice(p.count, 1)
                p.count -= 1
                scene.remove(o)
            }
            params.rotate = () => {
                console.log((Math.PI / 180) * params.rotateVal)
                o.rotateY((Math.PI / 180) * params.rotateVal)
            }
            //object.scale.set(new THREE.Vector3(scale,scale,scale));
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (e) => {
            console.log('An error happened', e);
        }
    );
}

let loadDog = () => {
    const textureLoader = new THREE.TextureLoader();
    const objloader = new OBJLoader();

    let dogMap = textureLoader.load('./img/seadog.png')
    let dogMat = new THREE.MeshPhongMaterial({
        map: dogMap
    })
    objloader.load('https://krew.io/assets/models/dogs/seadog.obj', (o) => {
        o.traverse(m => m.material = m.isMesh ? dogMat : null)
        scene.add(o)
        o.position.set(guiparams.x, guiparams.y, guiparams.z)
        o.scale.set(guiparams.scale * 0.1, guiparams.scale * 0.1, guiparams.scale * 0.1)
        refresh = () => {
            o.position.set(guiparams.x, guiparams.y, guiparams.z)
            o.scale.set(guiparams.scale * 0.1, guiparams.scale * 0.1, guiparams.scale * 0.1)
            o.rotateY(Math.PI / 180 * guiparams.rotation)
        }
        controllers.forEach(t => t.onChange(() => {
            refresh()
        }))
        const elem = $('#imageInput')
        elem.change(() => {
            console.log('heh')
            let img = document.createElement('img')

            img.onLoad = () => {
                newTex.needsUpdate = true

            }
            const inp = elem[0];
            if (inp.files && inp.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    img.src = e.target.result;
                    let newTex = textureLoader.load(img.src)
                    let newMat = new THREE.MeshPhongMaterial({
                        map: newTex
                    })
                    console.log(newMat)
                    o.traverse(m => m.material = m.isMesh ? newMat : null)
                };
                reader.readAsDataURL(inp.files[0]);
            }
        })

    }, xhr => console.log((xhr.loaded / xhr.total * 100) + '% loaded dog'))

}
loadDog()

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
