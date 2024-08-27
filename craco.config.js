const path = require("path");
const webpack = require("webpack");

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.resolve.fallback = {
                crypto: require.resolve("crypto-browserify"),
                stream: require.resolve("stream-browserify"),
                buffer: require.resolve("buffer"),
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

