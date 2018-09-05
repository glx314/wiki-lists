var webpack = require("webpack");
var shared = require("./webpack.shared.js");
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var server_loaders = shared.common_loaders();
var client_loaders = shared.common_loaders();


// For SSR we need different CSS loader
server_loaders["css"] = {
    test: /\.css$/,
    exclude: /node_modules/,
    loader: 'css-loader'
};

// Server build needs a loader to handle external .css files
server_loaders["css_external"] = {
    test: /\.css$/,
    include: /node_modules/,
    loader: 'css-loader/locals'
};

// Client loader
client_loaders["css_external"] = {
    test: /\.css$/,
    include: /node_modules/,
    use: [MiniCssExtractPlugin.loader, 'css-loader'],
};

console.log("client loaders", client_loaders)
console.log("server loaders", server_loaders)

var client = {
    name: "prod.client",
    target: "web",
    mode:"production",
    entry: {
        "client.bundle": shared.APP_DIR + "/client"
    },
    output: {
        filename: "[name].js",
        path: shared.CLIENT_BUILD_DIR,
        publicPath: "/"
    },
    module: {
        rules: shared.flatten_loaders(client_loaders)
    },
    resolve: {
        extensions: [".rt", ".js", ".jsx", ".ts", ".tsx"]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new MiniCssExtractPlugin("[name].css")
    ]
};

var server = {
    name: "prod.server",
    target: "node",
    mode:"production",
    externals: [
        {
            "react-dom/server": true
        }
    ],
    entry: {
        "server.bundle": shared.APP_DIR + "/server"
    },
    output: {
        filename: "[name].js",
        path: shared.SERVER_BUILD_DIR,
        publicPath: "/",
        libraryTarget: "commonjs2"
    },
    module: {
        rules: shared.flatten_loaders(server_loaders)
    },
    resolve: {
        extensions: [".rt", ".js", ".jsx", ".ts", ".tsx"]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new MiniCssExtractPlugin("[name].css")
    ],
    node : {
        __dirname : true
    }
};

module.exports = [client, server];
