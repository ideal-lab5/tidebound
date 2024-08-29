const path = require("path");
const webpack = require("webpack");

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.resolve.fallback = {
                crypto: require.resolve("crypto-browserify"),
                stream: require.resolve("stream-browserify"),
                buffer: require.resolve("buffer"),
                path: require.resolve("path-browserify"),
                os: require.resolve("os-browserify/browser"),
                fs: require.resolve("fs"),
            };
            webpackConfig.plugins.push(
                new webpack.ProvidePlugin({
                    process: "process/browser.js",
                    Buffer: ["buffer", "Buffer"],
                })
            );
            return webpackConfig;
        },
    }

};

