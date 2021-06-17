const wasm = import('./pkg');


async function run_wrapper(START_X, START_Y, WIDTH, HEIGHT, WINDOW){

  let m = await wasm;

  let imageData = m.run(START_X, START_Y, WIDTH, HEIGHT, WINDOW); 

  return imageData;


}

//run_wrapper(START_X, START_Y, WIDTH, HEIGHT, WINDOW).then((e) => console.log(e));