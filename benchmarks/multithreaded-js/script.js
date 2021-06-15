function createWorker(parameters){
  return new Promise(() => {
    var worker = new Worker("sharedworker.js");

    worker.postMessage(parameters);

    worker.onmessage = function(){
      const end = performance.now();
      time.textContent = end-start;
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
  const sharedBuffer = new SharedArrayBuffer(4*X_LEN*Y_LEN);
  const sharedArray = new Uint8ClampedArray(sharedBuffer)
  sharedArray.fill(0);

  //const INDEXES_PER_WORKER = Math.floor((X_LEN*Y_LEN)/workerCount);
  const N_ROWS_PER_THREAD = Math.floor(X_LEN/workerCount);
  var START_XC = N_ROWS_PER_THREAD;

  var parameters = [START_X_TOTAL,START_Y_TOTAL, START_XC, STEP_X, STEP_Y, N_ROWS_PER_THREAD, Y_LEN, sharedArray];
  var promises = [];

  for(let i=0; i<workerCount; i++){
    console.log("sharedArray");

    //const worker = new Worker("sharedworker.js");

    parameters[2] = N_ROWS_PER_THREAD * i;

 /*   worker.postMessage({
      START_X_TOTAL,START_Y_TOTAL,START_XC, STEP_X, STEP_Y, N_ROWS_PER_THREAD, Y_LEN,sharedArray
    }); */

    promises.push(createWorker(parameters));
  }

  Promise.all(promises)
  .then(() => {
      return draw(sharedArray);
  });

/*  worker.onmessage = function(){
    const end = performance.now();
    time.textContent = end-start;
    return draw(sharedArray);
  } */

}


function draw(array) {
    const imageArrayMemory = array;
    const arr = new Uint8ClampedArray(X_LEN * Y_LEN * 4);
    arr.fill(0);
    imageArrayMemory.forEach(
        (val, i) => {
            if (val) {
                arr[4 * i + 0] = val; arr[4 * i + 1] = val; arr[4 * i + 2] = val; arr[4 * i + 3] = 255;
            }
        });
  
    let imageData = new ImageData(arr, X_LEN, Y_LEN);
    return imageData;
}