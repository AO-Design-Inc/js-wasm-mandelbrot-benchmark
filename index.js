import { returnImprovedjs } from "./benchmarks/improved-js/script.js";

let time = document.getElementById("time");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');


const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const START_X_TOTAL = 0.300283;
const START_Y_TOTAL =  -0.48857;
const WINDOW = 0.01;

const selectElement = document.querySelector('#version');
let selectedVersion = selectElement.value;

selectElement.addEventListener('change', (event) => {
    selectedVersion = event.target.value;
    
    let imageData;

    switch(selectedVersion){
        case 'improvedjs':
            let start = performance.now();
            imageData = returnImprovedjs(START_X_TOTAL, START_Y_TOTAL, CANVAS_WIDTH, CANVAS_HEIGHT, WINDOW);
            let end = performance.now();
            time.textContent = end-start;
            break;
    }

    ctx.putImageData(imageData, 0, 0);
});
