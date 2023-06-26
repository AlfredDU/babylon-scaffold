/** Init babylon.js scene when window loaded. */

// imports
import Stage from './Stage'

// import assets
import './full-screen.css'


// constants
const CANVAS_ID = 'renderCanvas'


window.onload = () => {
    // greeting
    console.log('hello')

    // main scene
    new Stage(document.getElementById(CANVAS_ID) as HTMLCanvasElement)
}