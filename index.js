
import {returnImageData} from './benchmarks/improved-js/script';

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');


const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const START_X_TOTAL = 0.300283;
const START_Y_TOTAL =  -0.48857;
const WINDOW = 0.01;


let imageData = returnImageData(START_X_TOTAL, START_Y_TOTAL, CANVAS_WIDTH, CANVAS_HEIGHT, WINDOW);
ctx.putImageData(imageData);