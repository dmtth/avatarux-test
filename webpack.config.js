const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    watch: false,
    mode: 'production',
    cache: false,
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: 'ts-loader'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "resources/symbols", to: "resources/symbols" }
            ],
        })
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    experiments: {
        topLevelAwait: true
    }
};