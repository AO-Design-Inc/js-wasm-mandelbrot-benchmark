
console.log("Hello from the js");

/*
let WIDTH = canvas.width;
let HEIGHT = canvas.height;
let START_X = 0.300283;
let START_Y = -0.48857;
let WINDOW = 0.01; */

/*
// First up, but try to do feature detection to provide better error messages
function loadWasm() {
    let msg = 'This demo requires a current version of Firefox (e.g., 79.0)';
    if (typeof SharedArrayBuffer !== 'function') {
      alert('this browser does not have SharedArrayBuffer support enabled' + '\n\n' + msg);
      return
    }
    // Test for bulk memory operations with passive data segments
    //  (module (memory 1) (data passive ""))
    const buf = new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
      0x05, 0x03, 0x01, 0x00, 0x01, 0x0b, 0x03, 0x01, 0x01, 0x00]);
    if (!WebAssembly.validate(buf)) {
      alert('this browser does not support passive wasm memory, demo does not work' + '\n\n' + msg);
      return
    }
  
    wasm_bindgen('./wasm_threads_test_bg.wasm')
      .then(() => {
        run(START_X, START_Y, WIDTH, HEIGHT, WINDOW);
      }) 
      .catch(console.error); 
} */

// bad practice because it removes the warnings
// TODO: reimplement warnings after verifying that this works
function load(startX, startY, width, height, window){
  wasm_bindgen('./wasm_threads_test_bg.wasm')
  .then(async () =>{
    let imagedata = await run(startX, startY, width, height, window);
    return imagedata;
  }) 
  .catch(console.error); 
} 

load(START_X, START_Y, WIDTH, HEIGHT, WINDOW);
const { Scene, WorkerPool } = wasm_bindgen;

async function run(startX, startY, width, height, window){
    console.log("from inside the run");
    // The maximal concurrency of our web worker pool is `hardwareConcurrency`,
    // so set that up here and this ideally is the only location we create web
    // workers.
    pool = new WorkerPool(navigator.hardwareConcurrency);
    scene = new Scene(width, height);

    // scene.render(...) returns a RenderingScene object on which a promise can be extracted
    rendering = scene.render(pool, startX, startY, window);
    let imagedata = await rendering.promise();
    return imagedata;
}

