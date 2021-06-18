use std::f64;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use js_sys::{Uint8ClampedArray, WebAssembly};

// neat macro wrapper for js console.log 
#[allow(unused_macros)]
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

// struct for complex numbers
struct Complex {
    real: f64,
    imag: f64,
}

fn build_complex(real: f64, imag: f64) -> Complex {
    Complex {
        real,
        imag,
    }
}

// methods for complex numbers
impl Complex {
    fn add(mut self, other: &Complex) -> Complex {
        self.real += other.real;
        self.imag += other.imag;
        self
    }

    fn mag(&self) -> f64 {
        self.real.hypot(self.imag)
    }

    fn square(mut self) -> Complex {
        // foil operation to multiply complex numbers
        let real = self.real*self.real - self.imag*self.imag;
        let imag = self.imag*self.real + self.real*self.imag;
        self.real = real;
        self.imag = imag;
        self
    }

}

fn in_mandelbrot(cplx: &Complex) -> u8 {
    const ITER_CONST: i32 = 100;
    let mut z = build_complex(0.0, 0.0);
    let mut count: i32 = 0;

    while z.mag() <= 2.0 && count < 1000 {
        z = (z.square()).add(&cplx); // z = z^2 + cplx
        count += 1;
    }

    if count > 255 {
        count = 255;
    }

    count as u8

}

fn fill_mandelbrot(
    points_array: & mut Vec<u8>, 
    start_x: f64, 
    start_y: f64, 
    x_len: i32, 
    y_len: i32, 
    window: f64) {

    let num_pixels = x_len * y_len;

    let x_step = window/(x_len as f64);
    let y_step = window/(y_len as f64);

    for count in 0..num_pixels {
        let c = count as i32;

        // calculate coordinates on canvas
        let x = (c % x_len) as f64;
        let y = (c / x_len) as f64;

        // real and imaginary parts of complex number for 
        // specified canvas pixel
        let x_com = start_x + x * x_step;
        let y_com = start_y + y * y_step;

        let in_set = in_mandelbrot(&build_complex(x_com, y_com));

        let i = count as usize;

        points_array[i*4] = in_set;
        points_array[i*4 + 1] = in_set;
        points_array[i*4 + 2] = in_set;
        points_array[i*4 + 3] = 255;
    }

}

// lets us make an ImageData
#[wasm_bindgen]
extern "C" {
    pub type ImageData;

    #[wasm_bindgen(constructor, catch)]
    fn new(data: &Uint8ClampedArray, width: f64, height: f64) -> Result<ImageData, JsValue>;
}

#[wasm_bindgen]
pub fn run(start_x: f64, start_y: f64, width: u32, height: u32, window: f64) -> ImageData{

    let y_len: i32 = height as i32;
    let x_len: i32 = width as i32;

    let pixels: usize = (x_len * y_len) as usize;

    let mut points_array = vec![0; pixels*4];
    fill_mandelbrot(&mut points_array, start_x, start_y, x_len, y_len, window);

    let pointer = points_array.as_ptr() as usize;

    let mem = wasm_bindgen::memory().unchecked_into::<WebAssembly::Memory>();
    let new_array = Uint8ClampedArray::new(&mem.buffer()).slice(pointer as u32, (pointer + pixels*4) as u32);
    ImageData::new(&new_array, x_len.into(), y_len.into()).unwrap()

}
