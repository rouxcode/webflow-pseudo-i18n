const path = require("path");

const node_modules = path.resolve(__dirname, 'node_modules')
const dist = path.resolve(__dirname, "../dist")
const src = path.resolve(__dirname, "../src/")


module.exports = [
    {
        resolve: {
            // add custom  node_modules import path
            modules: [node_modules, 'node_modules'],
        },
        entry: {
            // project assets
            'roux-i18n': src + "/languages.js",

        },
        output: {
            path: dist,
            filename: "[name].js",
        },
        plugins: [],
        module: {},
    },
]
