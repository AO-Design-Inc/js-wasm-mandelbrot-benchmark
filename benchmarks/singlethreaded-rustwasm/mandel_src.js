/* exported start, end, run_wrapper */
/* eslint no-undef:"off" */

/* turning off the undefined warning is generally a bad idea except in this
 case because this file is ebing concatenated to a file with file definitions
 in our hacky workaround */
let start,
    end = 0;
async function run_wrapper(START_X, START_Y, WIDTH, HEIGHT, WINDOW) {
    await init('./benchmarks/singlethreaded-rustwasm/pkg/Mandelbrot_bg.wasm');

    start = performance.now();

    let imageData = run(START_X, START_Y, WIDTH, HEIGHT, WINDOW);

    end = performance.now();

    return imageData;
}
