//let canvas = document.getElementById("canvas");
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 1000;
const START_X_TOTAL = 0.300283;
const START_Y_TOTAL =  -0.48857;
const WINDOW = 0.01;

let imageData;
let start;
let end;

onmessage = async function(e) {
    console.log('Message received from main script');

    start = performance.now();

    switch (e.data){
        case 'naivejs':
            self.importScripts("/benchmarks/naive-js/script.js");
            imageData = returnNaivejs(START_X_TOTAL, START_Y_TOTAL, CANVAS_WIDTH, CANVAS_HEIGHT, WINDOW);
            break;
        case 'improvedjs':
            self.importScripts("/benchmarks/improved-js/script.js");
            imageData = returnImprovedjs(START_X_TOTAL, START_Y_TOTAL, CANVAS_WIDTH, CANVAS_HEIGHT, WINDOW);
            break;
        case 'multijs':
            self.importScripts("/benchmarks/multithreaded-js/script.js");
            await returnSharedBufferjs(START_X_TOTAL, START_Y_TOTAL, CANVAS_WIDTH, CANVAS_HEIGHT, WINDOW).then((data) => {
                imageData = data;
            })
            break;
    }

    end = performance.now();

    console.log('Posting message back to main script');
    postMessage([imageData, end-start]);
}