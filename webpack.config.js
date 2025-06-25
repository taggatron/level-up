const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './script.js', // changed from main.js to script.js
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        static: {
          directory: path.join(__dirname, '.'),
        },
        compress: true,
        port: 9000,
      },
    mode: 'development',
    plugins: [
        new CopyPlugin({
          patterns: [
            { from: 'node_modules/three/examples/jsm/controls/OrbitControls.js', to: 'three/examples/jsm/controls/OrbitControls.js' },
          ],
        }),
      ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
              }
          }
        }
      ]
    }
  };