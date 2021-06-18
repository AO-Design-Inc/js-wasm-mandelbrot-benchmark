use futures_channel::oneshot;
use js_sys::{Promise, Uint8ClampedArray, WebAssembly};
use rayon::prelude::*;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

mod pool;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

macro_rules! console_log {
    ($($t:tt)*) => (crate::log(&format_args!($($t)*).to_string()))
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
    fn add(&self, other: &Complex) -> Complex {
        build_complex(self.real + other.real, self.imag + other.imag)
    }

    fn mag(&self) -> f64 {
        self.real.hypot(self.imag)
    }

    fn mul(&self, other: &Complex) -> Complex {
        let real_part = self.real*other.real - self.imag*other.imag;
        let imag_part = self.imag*other.real + self.real*other.imag;
        build_complex(real_part, imag_part)
    }
}

fn in_mandelbrot(cplx: &Complex) -> i32 {
    const ITER_CONST: i32 = 255;
    let mut z = build_complex(0.0, 0.0);

    let mut count = 0;

    while z.mag() <= 2.0 && count < ITER_CONST {
        z = (z.mul(&z)).add(&cplx); // z = z^2 + cplx
        count += 1;
    }

    count
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn logv(x: &JsValue);
}

/*
#[wasm_bindgen(start)]
pub fn start() {
    console_log!("This is working!");
} */

// Scene struct that has a render implementation
#[wasm_bindgen]
pub struct Scene{
    width: u32,
    height: u32,
}

#[wasm_bindgen]
impl Scene {

    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> Result<Scene, JsValue> {
        Ok(Scene{
            width,
            height,
        })
    }

    pub fn render(self, pool: &pool::WorkerPool, start_x: f64, start_y: f64, window: f64) -> Result<RenderingScene, JsValue>{

        let width = self.width;
        let height = self.height;

        //imageData is created here
        let pixels = width * height;
        let mut rgb_data = vec![0; (4 * pixels) as usize];
        let base = rgb_data.as_ptr() as usize;
        let len = rgb_data.len();

        let x_step = window/(width as f64);
        let y_step = window/(height as f64);

        // code copied from raytracing
        // Configure a rayon thread pool which will pull web workers from
        // `pool`.
        console_log!("Making thread pool");
        let thread_pool = rayon::ThreadPoolBuilder::new()
            .num_threads(4)
            .spawn_handler(|thread| Ok(pool.run(|| thread.run()).unwrap()))
            .build()
            .unwrap();

        let (tx, rx) = oneshot::channel();
        pool.run(move || {
            thread_pool.install(|| {
                rgb_data
                    .par_chunks_mut(4)
                    .enumerate()
                    .for_each(|(i, chunk)| {
                        
                        let i = i as u32;
                        let x = i % width;
                        let y = i / width;

                        let x_com = start_x + x_step*(x as f64);
                        let y_com = start_y + y_step*(y as f64);

                        let result = in_mandelbrot(&build_complex(x_com, y_com));

                        chunk[0] = result as u8;
                        chunk[1] = result as u8;
                        chunk[2] = result as u8;
                        chunk[3] = 255 as u8;
                        
                        
                    });
            });
            drop(tx.send(rgb_data));
        })?;

        let done = async move {
            match rx.await {
                Ok(_data) => Ok(image_data(base, len, width, height).into()),
                Err(_) => Err(JsValue::undefined()),
            }
        };

        Ok(RenderingScene {
            promise: wasm_bindgen_futures::future_to_promise(done),
            base,
            len,
            width,
            height,
        })

    }
}

// RenderingScene struct that has a implementations to display imagesofar
#[wasm_bindgen]
pub struct RenderingScene {
    base: usize,
    len: usize,
    promise: Promise,
    width: u32,
    height: u32,
}

// Inline the definition of `ImageData` here because `web_sys` uses
// `&Clamped<Vec<u8>>`, whereas we want to pass in a JS object here.
#[wasm_bindgen]
extern "C" {
    pub type ImageData;

    #[wasm_bindgen(constructor, catch)]
    fn new(data: &Uint8ClampedArray, width: f64, height: f64) -> Result<ImageData, JsValue>;
}

#[wasm_bindgen]
impl RenderingScene {
    /// Returns the JS promise object which resolves when the render is complete
    pub fn promise(&self) -> Promise {
        self.promise.clone()
    }

    /// Return a progressive rendering of the image so far
    #[wasm_bindgen(js_name = imageSoFar)]
    pub fn image_so_far(&self) -> ImageData {
        image_data(self.base, self.len, self.width, self.height)
    }
}

fn image_data(base: usize, len: usize, width: u32, height: u32) -> ImageData {
    // Use the raw access available through `memory.buffer`, but be sure to
    // use `slice` instead of `subarray` to create a copy that isn't backed
    // by `SharedArrayBuffer`. Currently `ImageData` rejects a view of
    // `Uint8ClampedArray` that's backed by a shared buffer.
    //
    // FIXME: that this may or may not be UB based on Rust's rules. For example
    // threads may be doing unsynchronized writes to pixel data as we read it
    // off here. In the context of wasm this may or may not be UB, we're
    // unclear! In any case for now it seems to work and produces a nifty
    // progressive rendering. A more production-ready application may prefer to
    // instead use some form of signaling here to request an update from the
    // workers instead of synchronously acquiring an update, and that way we
    // could ensure that even on the Rust side of things it's not UB.
    let mem = wasm_bindgen::memory().unchecked_into::<WebAssembly::Memory>();
    let mem = Uint8ClampedArray::new(&mem.buffer()).slice(base as u32, (base + len) as u32);
    ImageData::new(&mem, width as f64, height as f64).unwrap()
}