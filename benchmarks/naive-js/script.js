'use strict';

// this version uses the most memory allocation, creating a new object every time 
// a complex number is added or multiplied

class Complex {
  constructor(real, imag){
    this.real = real;
    this.imag = imag;
  }

  add(cplx) {
    return new Complex(this.real + cplx.real, this.imag + cplx.imag);
  }

  mag(cplx) {
    //return Math.hypot(this.real,this.imag);
    return Math.sqrt(this.real * this.real + this.imag * this.imag)
  }

  mul(cplx) {
    // (a + ib)*(c + id) = (ac - bd) + i(bc + ad)
    const real_part = this.real*cplx.real - this.imag*cplx.imag;
    const imag_part = this.imag*cplx.real + this.real*cplx.imag;
    return new Complex(real_part, imag_part);
  }
}

// Max number of times mandelbrot will iterate
const ITER_CONST = 1000; 

// returns the number of iterations it takes to leave mandelbrot
function mandelbrot(cplx) {
  let z = new Complex(0,0);
  
  let count = 0;
  while (z.mag() <= 2 && count < ITER_CONST) {
    z = (z.mul(z)).add(cplx);
    count++;
  }
  
  return count;
}

// returns ImageData object with Mandelbrot
export function returnNaivejs(x_start, y_start, canvas_width, canvas_height, window) {

  const step_X = window/canvas_width;
  const step_Y = window/canvas_height;

  // initializes new array to store points
  const points_array = new Array(canvas_height*canvas_width*4).fill(0);

  let count = 0;

  for (let y = y_start, count_y = 0; count_y < canvas_width; y += step_Y, count_y++){
    for (let x = x_start, count_x = 0; count_x < canvas_height; x += step_X, count_x++){

        let val = mandelbrot(new Complex(x,y));
        let curr_pixel = count*4;

        points_array[curr_pixel] = val;
        points_array[curr_pixel+1] = val;
        points_array[curr_pixel+2] = val;
        points_array[curr_pixel+3] = 255;

        count++;
    }
  }

  return new ImageData(new Uint8ClampedArray(points_array), canvas_width, canvas_height);

} 