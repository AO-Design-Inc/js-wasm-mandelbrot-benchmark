function mandelbrot(cplx) {

    let z = new Complex(0,0);
    
    let count = 0;
    while (z.mag() < 2 && count < ITER_CONST) {
      z = (z.mul(z)).add(cplx);
      count++;
    }
    return count;
  
  }

    
  const ITER_CONST = 1000;
onmessage = function({data}) {
  console.log("worker got called");
  const{START_X_TOTAL,START_Y_TOTAL,START_XC, STEP_X, STEP_Y, N_ROWS_PER_THREAD, Y_LEN, sharedArray} = data;

    for(let x = START_X_TOTAL + START_XC * STEP_X, count_x = START_XC; count_x < N_ROWS_PER_THREAD+START_XC; x+=STEP_X, count_x++){
      for( let y = START_Y_TOTAL, count_y =0; count_y < Y_LEN; y+=STEP_Y, count_y++)
      {
          val= mandelbrot(new Complex(x,y));


          sharedArray[count_x * Y_LEN + count_y + 0] = val; 
          sharedArray[count_x * Y_LEN + count_y + 1] = val;
          sharedArray[count_x * Y_LEN + count_y+ 2] = val; 
          sharedArray[count_x * Y_LEN + count_y + 3] = 255;

        
      }
    }
    console.log("worker done");

    postMessage("done");
  }




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
  
    mag() {
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