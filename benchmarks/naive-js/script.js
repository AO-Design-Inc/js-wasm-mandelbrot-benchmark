'use strict';

// this version uses the most memory allocation 
// creating a new object every time a complex number
// is added or multiplied

const start = performance.now();

const time = document.getElementById('time');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Complex {
  constructor(real, imag){
    this.real = real;
    this.imag = imag;
  }

  add(cplx) {
    this.real += cplx.real;
    this.imag += cplx.imag;
    return this;
    //return new Complex(this.real + cplx.real, this.imag + cplx.imag);
  }

  mag(cplx) {
    //return Math.hypot(this.real,this.imag);
    return Math.sqrt(this.real * this.real + this.imag * this.imag)
  }

  mul(cplx) {
    // (a + ib)*(c + id) = (ac - bd) + i(bc + ad)
    const real_part = this.real*cplx.real - this.imag*cplx.imag;
    const imag_part = this.imag*cplx.real + this.real*cplx.imag;
    this.real = real_part;
    this.imag = imag_part;
    return this;
  }
}

//Find out whether cplx is in mandelbrot set
// Number of times mandelbrot will iterate
const ITER_CONST = 1000; 

function mandelbrot(cplx) {
  let z = new Complex(0,0);
  
  let count = 0;
  while (z.mag() <= 2 && count < ITER_CONST) {
    z = (z.mul(z)).add(cplx);
    count++;
  }
  
  return count;
}

function initializePoints(x_len, y_len){
  // creates an array in preparation of making an
  // imageData object, so there are four
  // array slots per pixel for rgba
  let points_array = new Array(x_len * y_len * 4).fill(0);
  return points_array;
} 

const canvas_width = canvas.width;
const canvas_height = canvas.height;

const START_X_TOTAL = 0.300283;
const START_Y_TOTAL =  -0.48857;
const WINDOW = 0.01;
const step_X = WINDOW/canvas_width;
const step_Y = WINDOW/canvas_height;

const points_array = initializePoints(canvas_width, canvas_height);

let count = 0;
// this part hasn't been optimized but eh
for (let y = START_Y_TOTAL, count_y = 0; count_y < canvas_width; y += step_Y, count_y++){
  for (let x = START_X_TOTAL, count_x = 0; count_x < canvas_height; x += step_X, count_x++){
      let num = mandelbrot(new Complex(x,y));
      let pixel_num = count*4;
      points_array[pixel_num] = num;
      points_array[pixel_num+1] = num;
      points_array[pixel_num+2] = num;
      points_array[pixel_num + 3] = 255;
      count++;
  }
}
const end = performance.now();

time.textContent = end-start;
// creates new imageData object and puts it on the canvas
let imageData = new ImageData(new Uint8ClampedArray(points_array), canvas_width, canvas_height);
ctx.putImageData(imageData, 0, 0);

/*
function returnImageData(x_start, y_start, canvas_width, canvas_height, window_x, window_y) {


} */