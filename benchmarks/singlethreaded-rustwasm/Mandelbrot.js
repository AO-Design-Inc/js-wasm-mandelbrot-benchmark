const wasm = import('./pkg');

/*
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let time = document.getElementById('time');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const START_X = 0.300283;
const START_Y =  -0.48857;
const WINDOW = 0.01; */


async function run_wrapper(START_X, START_Y, WIDTH, HEIGHT, WINDOW){

  let m = await wasm;

  let imageData = m.run(START_X, START_Y, WIDTH, HEIGHT, WINDOW); 

  return imageData;


}

//run_wrapper(START_X, START_Y, WIDTH, HEIGHT, WINDOW).then((e) => console.log(e));