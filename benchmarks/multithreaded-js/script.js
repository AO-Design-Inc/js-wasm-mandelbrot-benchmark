function createWorker(parameters){
  return new Promise((resolve) => {
    var worker = new Worker("benchmarks/multithreaded-js/sharedworker.js");

    worker.postMessage(parameters);

    worker.onmessage = function(){
      resolve("worker finished");
    }
  });
}

async function returnSharedBufferjs(START_X_TOTAL, START_Y_TOTAL, CANVAS_WIDTH, CANVAS_HEIGHT, WINDOW){
  
  const X_LEN = CANVAS_WIDTH;
  const Y_LEN = CANVAS_HEIGHT;
  const window = WINDOW;
  const STEP_X = window/X_LEN;
  const STEP_Y = window/Y_LEN;
  const workerCount = 4;
  const sharedBuffer = new SharedArrayBuffer(X_LEN*Y_LEN*4);
  const sharedArray = new Uint8ClampedArray(sharedBuffer);
  sharedArray.fill(0);

  const N_ROWS_PER_THREAD = Math.floor(X_LEN/workerCount);
  var START_YC = N_ROWS_PER_THREAD;

  var parameters = {START_X_TOTAL,START_Y_TOTAL, START_YC, STEP_X, STEP_Y, N_ROWS_PER_THREAD, X_LEN, sharedArray};
  var promises = [];

  for(let i=0; i<workerCount; i++){

    parameters.START_YC = N_ROWS_PER_THREAD * i;

    promises.push(createWorker(parameters));
  }

  const promises_done = await Promise.all(promises);
  const array = new Uint8ClampedArray(sharedArray);
  return new ImageData(array, CANVAS_WIDTH, CANVAS_HEIGHT);
}

