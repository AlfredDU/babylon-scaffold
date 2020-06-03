/** Webpack configure file. */
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    mode: "production",
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    // ignore libraries that imported in browser tag
    externals: {
        axios: 'axios'
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            // Pack images
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {loader: 'url-loader', options: {limit: 8192}}
                ]
            }
        ]
    },

    // copy unpacked files to server static path
    plugins: [
        new CopyPlugin({ patterns: [
            { from: './node_modules/babylonjs/babylon.js', to: 'babylon.min.js' },
            { from: './node_modules/hammerjs/hammer.min.js', to: 'hammer.min.js' }
        ]}),
    ],

    // large assets are necessary and need no worry
    performance: {
        hints: false
    }
}
