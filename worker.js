self.importScripts("/benchmarks/improved-js/script.js");
self.importScripts("/benchmarks/naive-js/script.js");


//let canvas = document.getElementById("canvas");
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;
const START_X_TOTAL = 0.300283;
const START_Y_TOTAL =  -0.48857;
const WINDOW = 0.01;

let imageData;
let start;
let end;

onmessage = function(e) {
    console.log('Message received from main script');

    start = performance.now();

    switch (e.data){
        case 'naivejs':
            imageData = returnNaivejs(START_X_TOTAL, START_Y_TOTAL, CANVAS_WIDTH, CANVAS_HEIGHT, WINDOW);
            break;
        case 'improvedjs':
            imageData = returnImprovedjs(START_X_TOTAL, START_Y_TOTAL, CANVAS_WIDTH, CANVAS_HEIGHT, WINDOW);
            break;
    }

    end = performance.now();

    console.log('Posting message back to main script');
    postMessage([imageData, end-start]);
}