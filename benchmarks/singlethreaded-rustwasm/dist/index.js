/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./Mandelbrot.js":
/*!***********************!*\
  !*** ./Mandelbrot.js ***!
  \***********************/
/***/ (() => {

eval("const wasm = Promise.resolve().then(function webpackMissingModule() { var e = new Error(\"Cannot find module './pkg'\"); e.code = 'MODULE_NOT_FOUND'; throw e; });\n\n/*\nlet canvas = document.getElementById('canvas');\nlet ctx = canvas.getContext('2d');\nlet time = document.getElementById('time');\n\nconst WIDTH = canvas.width;\nconst HEIGHT = canvas.height;\nconst START_X = 0.300283;\nconst START_Y =  -0.48857;\nconst WINDOW = 0.01; */\n\n\nasync function run_wrapper(START_X, START_Y, WIDTH, HEIGHT, WINDOW){\n\n  let m = await wasm;\n\n  let imageData = m.run(START_X, START_Y, WIDTH, HEIGHT, WINDOW); \n\n  return imageData;\n\n\n}\n\n//run_wrapper(START_X, START_Y, WIDTH, HEIGHT, WINDOW).then((e) => console.log(e));\n\n//# sourceURL=webpack:///./Mandelbrot.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./Mandelbrot.js"]();
/******/ 	
/******/ })()
;