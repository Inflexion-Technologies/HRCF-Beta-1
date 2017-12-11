const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./app.js",
    output: {
        path: __dirname+'/build',
        filename: "app.bundle.js"
    },
    devServer: {
        inline: false,
        contentBase: "./build",
    },
    target : 'node',
    externals : [nodeExternals()],
    module: {
        loaders: [{ 
            test: /\.js?$/, 
            loader: "babel-loader",
            query: {
                presets : ['es2015']
            }
        },{ test: /\.json$/, loader: 'json-loader' }]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //     },
        //     output: {
        //         comments: false,
        //     },
        // }),
         new CopyWebpackPlugin([{from : './resources/banks.json', to:'./resources/banks.json'}, 
                                {from : './resources/ic_banks.json', to:'./resources/ic_banks.json'},
                                {from : './resources/bank_branches.json', to : './resources/bank_branches.json'},
                                {from : './resources/id_types.json', to : './resources/id_types.json'},
                                {from : './resources/ic_import_sheet.xlsx', to : './uploads/ic_import_sheet.xlsx'}])
    ]
};