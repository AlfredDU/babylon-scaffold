///<reference path="../node_modules/babylonjs/babylon.module.d.ts" />
import Lambda from './Lambda'

/** constants */
// label; id
const MAIN_CAMERA_NAME = 'main_camera'
const AMBIENT_LIGHT_NAME = 'ambient_light'
const MAIN_OBJECT_NAME = 'sphere'

// assets; use 'require' for webpack packing work
const TEXTURE_URL = require('../images/babylon.js.png')

// scalar
const MAIN_BACKGROUND_COLOR = '#000000'
const MAIN_CAMERA_POS_Z = 10
const AMBIENT_LIGHT_POS_Z = 4


/** main scene. */
export default class Stage {
    // properties
    canvas: HTMLCanvasElement
    width: number
    height: number
    dpr: number

    engine: BABYLON.Engine
    scene: BABYLON.Scene

    mesh: BABYLON.Mesh
    camera: BABYLON.FreeCamera

    // static get assets(): Array<string> {
    //     return [
    //         PIXI_LOGO_URL
    //     ]
    // }

    // constructor
    constructor(render_canvas: HTMLCanvasElement) {
        // dimension; mind the retina display
        this.dpr = Lambda.device_dpr()
        this.width = window.innerWidth * this.dpr
        this.height = window.innerHeight * this.dpr

        // set canvas size
        render_canvas.width = this.width
        render_canvas.height = this.height
        this.canvas = render_canvas

        // WebGL rendering engine
        this.engine = new BABYLON.Engine(this.canvas, true, {
            disableWebGL2Support: true,  // for widely browser support
            stencil: true
        })

        // This is essential!! For uncertain reasons initializing engine may resoze canvas
        // size to (0, 0)
        this.engine.setSize(this.width, this.height)

        // Main scene
        this.scene = new BABYLON.Scene(this.engine)
        // background color
        this.scene.clearColor = BABYLON.Color4.FromArray(
            BABYLON.Color3.FromHexString(MAIN_BACKGROUND_COLOR).asArray()
        )


        // set light, camera, objects
        this.set_objects()
        this.set_light()
        this.set_camera()

        // set gesture
        this.create_gesture()

        // bind loop
        this.engine.runRenderLoop(() =>{
            // rotate
            this.mesh.rotation.x += 0.1
            this.mesh.rotation.y += 0.1

            // Render main scene
            this.scene.render()
        })
    }

    // set camera
    set_camera(): void {
        const camera_position = new BABYLON.Vector3(0, 0, MAIN_CAMERA_POS_Z)
        this.camera = new BABYLON.FreeCamera(MAIN_CAMERA_NAME, camera_position, this.scene)

        this.camera.setTarget(BABYLON.Vector3.Zero())  // look at

        // Activate camera
        this.scene.activeCamera = this.camera
        // Comment next line to release control of camera from mouse / touch
        this.camera.attachControl(this.canvas, true)
    }

    // set light
    set_light(): void {
        // ambient light
        new BABYLON.HemisphericLight(
            AMBIENT_LIGHT_NAME,
            new BABYLON.Vector3(0, 0, AMBIENT_LIGHT_POS_Z),
            this.scene
        )
    }

    // set objects
    private set_objects(): void {
        // Create a built-in "sphere" shape.
        const sphere = BABYLON.MeshBuilder.CreateSphere(
            MAIN_OBJECT_NAME, {
                segments:16, diameter:2
            },
            this.scene
        )

        // set position
        sphere.position = BABYLON.Vector3.Zero()

        // set material with texture
        const material = new BABYLON.StandardMaterial('my_material', this.scene)
        material.diffuseTexture = new BABYLON.Texture(TEXTURE_URL, this.scene)
        sphere.material = material

        this.mesh = sphere
    }


    // gesture recognizer using hammer js
    create_gesture(): void {
        const recognizer_manager = new Hammer.Manager(this.canvas)

        // Add Tap gesture recognizer
        recognizer_manager.add(new Hammer.Tap({}))
        recognizer_manager.on('tap', (e) => {
            this.on_tap(e.center.x * this.dpr, e.center.y * this.dpr)
        })
    }

    // tap callback
    on_tap(x: number, y: number): void {
        const pick_result = this.scene.pick(x, y)
        if (pick_result.hit) {
            const picked_name = pick_result.pickedMesh.name
            console.log(picked_name)
        }
    }
}
