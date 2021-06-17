
async function run_wrapper(START_X, START_Y, WIDTH, HEIGHT, WINDOW){

    //let m = await wasm;
  
    await init('./benchmarks/singlethreaded-rustwasm/pkg/Mandelbrot_bg.wasm');
  
    let imageData = run(START_X, START_Y, WIDTH, HEIGHT, WINDOW); 
  
    return imageData;
  
  
  }