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

#[inline(always)]
fn build_complex(real: f64, imag: f64) -> Complex {
    Complex {
        real,
        imag,
    }
}

// methods for complex numbers
impl Complex {
    #[inline(always)]
    fn add(mut self, other: &Complex) -> Complex {
        self.real += other.real;
        self.imag += other.imag;
        self
    }

    #[inline(always)]
    fn mag(&self) -> f64 {
        (self.real * self.real + self.imag * self.imag).sqrt()
    }

    #[inline(always)]
    fn square(mut self) -> Complex {
        // foil operation to multiply complex numbers
        let real = self.real * self.real - self.imag * self.imag;
        let imag = self.imag * self.real + self.real * self.imag;
        self.real = real;
        self.imag = imag;
        self
    }
}

#[inline(always)]
fn mandelbrot(cplx: &Complex) -> u8 {
    const ITER_CONST: i32 = 1000;

    let mut z = build_complex(0.0, 0.0);
    let mut count: i32 = 0;

    while z.mag() <= 2.0 && count < ITER_CONST {
        z = (z.square()).add(&cplx); // z = z^2 + cplx
        count += 1;
    }

    if count > 255 {
        count = 255;
    }

    count as u8

}

fn fill_mandelbrot(
    points_array: &mut Vec<u8>,
    start_x: f64,
    start_y: f64,
    x_len: i32,
    y_len: i32,
    window: f64
) {
    let x_step = window / (x_len as f64);
    let y_step = window / (y_len as f64);

    for y in 0..y_len {
		for x in 0..x_len {
            // real and imaginary parts of complex number for
            // specified canvas pixel
            let x_com = start_x + x as f64 * x_step;
            let y_com = start_y + y as f64 * y_step;

            let in_set = mandelbrot(&build_complex(x_com, y_com));

            let i = 4 * (y * x_len + x) as usize;

            points_array[i + 0] = in_set;
            points_array[i + 1] = in_set;
            points_array[i + 2] = in_set;
            points_array[i + 3] = 255;
        }
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
pub fn run(start_x: f64, start_y: f64, width: u32, height: u32, window: f64) -> ImageData {

    let y_len: i32 = height as i32;
    let x_len: i32 = width as i32;

    let pixels: usize = (x_len * y_len) as usize;

    let mut points_array = vec![0; pixels * 4];
    fill_mandelbrot(&mut points_array, start_x, start_y, x_len, y_len, window);

    let pointer = points_array.as_ptr() as usize;

    let mem = wasm_bindgen::memory().unchecked_into::<WebAssembly::Memory>();
    let new_array = Uint8ClampedArray::new(&mem.buffer()).slice(pointer as u32, (pointer + pixels*4) as u32);
    ImageData::new(&new_array, x_len.into(), y_len.into()).unwrap()

}
