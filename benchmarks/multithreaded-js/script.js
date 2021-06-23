/* exported start, end, returnSharedBufferjs */
//Abhi Allu
let start,
    end = 0;
const N_THREADS = 4;
const workers = new Array(N_THREADS);
for (let i = 0; i < N_THREADS; i++) {
    workers[i] = new Worker('benchmarks/multithreaded-js/sharedworker.js');
}

async function returnSharedBufferjs(
    START_X_TOTAL,
    START_Y_TOTAL,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    WINDOW
) {
    start = performance.now();
    var donecount = 0;

    const X_LEN = CANVAS_WIDTH;
    const Y_LEN = CANVAS_HEIGHT;
    const window = WINDOW;
    const STEP_X = window / X_LEN;
    const STEP_Y = window / Y_LEN;
    const workerCount = 4;
    const sharedBuffer = new SharedArrayBuffer(X_LEN * Y_LEN * 4);
    const sharedArray = new Uint8ClampedArray(sharedBuffer);
    sharedArray.fill(0);

    const N_ROWS_PER_THREAD = Math.floor(X_LEN / workerCount);
    var START_YC = N_ROWS_PER_THREAD;

    var parameters = {
        START_X_TOTAL,
        START_Y_TOTAL,
        START_YC,
        STEP_X,
        STEP_Y,
        N_ROWS_PER_THREAD,
        X_LEN,
        sharedArray,
    };

    for (let i = 0; i < N_THREADS; i++) {
        parameters.START_YC = N_ROWS_PER_THREAD * i;
        workers[i].postMessage(parameters);
    }

    return new Promise((res) => {
        workers.forEach(
            (worker) =>
                (worker.onmessage = () => {
                    donecount++;
                    if (donecount == N_THREADS) {
                        end = performance.now();
                        const array = new Uint8ClampedArray(sharedArray);
                        res(new ImageData(array, CANVAS_WIDTH, CANVAS_HEIGHT));
                    }
                })
        );
    });
}
