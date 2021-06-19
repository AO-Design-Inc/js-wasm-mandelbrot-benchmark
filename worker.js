
// WIDTH and HEIGHT are passed in from main thread
const START_X_TOTAL = 0.300283;
const START_Y_TOTAL =  -0.48857;
const WINDOW = 0.01;

let imageData;
let start;
let end;
let scriptImported = false;

onmessage = async function(e) {
    console.log('Message received from main script');

    start = performance.now();
    
    switch (e.data[0]){
        case 'naivejs':
            if (!scriptImported) {
                self.importScripts("/benchmarks/naive-js/script.js");
                scriptImported = true;
            }
            imageData = returnNaivejs(START_X_TOTAL, START_Y_TOTAL, e.data[1], e.data[2], WINDOW);
            break;
        case 'improvedjs':
            if (!scriptImported) {
                self.importScripts("/benchmarks/improved-js/script.js");
                scriptImported = true;
            }
            imageData = returnImprovedjs(START_X_TOTAL, START_Y_TOTAL, e.data[1], e.data[2], WINDOW);
            break;
        case 'multijs':
            if (!scriptImported) {
                self.importScripts("/benchmarks/multithreaded-js/script.js");
                scriptImported = true;
            }
            imageData = await returnSharedBufferjs(START_X_TOTAL, START_Y_TOTAL, e.data[1], e.data[2], WINDOW);
            break;
        case 's-rustwasm':
            if (!scriptImported) {
                self.importScripts('./benchmarks/singlethreaded-rustwasm/Mandelbrot.js');
                scriptImported = true;
            }
            imageData = await run_wrapper(START_X_TOTAL, START_Y_TOTAL, e.data[1], e.data[2], WINDOW); 
            break;
        case 'assemblyscript-simple':
            if (!scriptImported) {
                self.importScripts("/benchmarks/simple-assemblyscript/main.js");
                scriptImported = true;
            }
            imageData = await returnSharedBufferjs(START_X_TOTAL, START_Y_TOTAL, e.data[1], e.data[2], WINDOW);
            break;
        case 'assemblyscript-multithreaded':
            if (!scriptImported) {
                self.importScripts("/benchmarks/assemblyscript-multithreaded/main.js");
                scriptImported = true;
            }
            imageData = await computeAndDrawMandel(START_X_TOTAL, START_Y_TOTAL, e.data[1], e.data[2], WINDOW);
            break;
        case 'assemblyscript-optimized-single':
            if (!scriptImported) {
                self.importScripts("/benchmarks/optimized-assemblyscript-singlethreaded/main.js");
                scriptImported = true;
            }
            imageData = await returnSharedBufferjs(START_X_TOTAL, START_Y_TOTAL, e.data[1], e.data[2], WINDOW);
            break;
        case 'simd-assemblyscript-single':
            if (!scriptImported) {
                self.importScripts("./benchmarks/simd-assemblyscript-singlethreaded/main.js");
                scriptImported=true;
            }
            imageData = await returnSharedBufferjs(START_X_TOTAL, START_Y_TOTAL, e.data[1], e.data[2], WINDOW);
            break;
    }

    end = performance.now();

    console.log('Posting message back to main script');
    postMessage([imageData, end-start]);
}
