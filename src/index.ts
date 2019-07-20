/** Init babylon.js scene when window loaded. */

// imports
import Stage from './Stage'

// constants
const CANVAS_ID = 'renderCanvas'


window.onload = () => {
    console.log('hello')

    // main scene
    new Stage(document.getElementById(CANVAS_ID) as HTMLCanvasElement)
}
