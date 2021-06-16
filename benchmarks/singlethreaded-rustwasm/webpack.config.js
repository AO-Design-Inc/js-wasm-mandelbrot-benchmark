const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
//const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
    entry: './Mandelbrot.js',
    target: 'webworker',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),    
        new CleanWebpackPlugin(),
        /*
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, ".")
        }),
        */
        // Have this example work in Edge which doesn't ship `TextEncoder` or
        // `TextDecoder` at this time.
        new webpack.ProvidePlugin({
          TextDecoder: ['text-encoding', 'TextDecoder'],
          TextEncoder: ['text-encoding', 'TextEncoder']
        })
    ],
    experiments: {
        syncWebAssembly: true
    },
    mode: 'development'
};

/*
new HtmlWebpackPlugin({
            template: '../../index.html'
        }),
        */