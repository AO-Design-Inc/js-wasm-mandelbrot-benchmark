
// WIDTH and HEIGHT are passed in from main thread
const START_X_TOTAL = 0.300283;
const START_Y_TOTAL =  -0.48857;
const WINDOW = 0.01;

let imageData;
let start;
let end;

onmessage = async function(e) {
    console.log('Message received from main script');

    start = performance.now();

    switch (e.data[0]){
        case 'naivejs':
            self.importScripts("/benchmarks/naive-js/script.js");
            imageData = returnNaivejs(START_X_TOTAL, START_Y_TOTAL, e.data[1], e.data[2], WINDOW);
            break;
        case 'improvedjs':
            self.importScripts("/benchmarks/improved-js/script.js");
            imageData = returnImprovedjs(START_X_TOTAL, START_Y_TOTAL, e.data[1], e.data[2], WINDOW);
            break;
        case 'multijs':
            self.importScripts("/benchmarks/multithreaded-js/script.js");
            imageData = await returnSharedBufferjs(START_X_TOTAL, START_Y_TOTAL, e.data[1], e.data[2], WINDOW);
            break;
        case 'rustwasm':
            self.importScripts('./benchmarks/singlethreaded-rustwasm/pkg');
    }

    end = performance.now();

    console.log('Posting message back to main script');
    postMessage([imageData, end-start]);
}