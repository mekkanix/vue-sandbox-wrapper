const path = require('path')
const autoprefixer = require('autoprefixer')
const TerserPlugin = require('terser-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts")
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    }
  },
  output: {
    library: 'vue-sandbox-wrapper',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, './dist/'),
    publicPath: '/',
    filename: 'vue-sandbox-wrapper.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            }
          },
        ]
      },
      {
        test: /\.vue$/i,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: [
          path.join(__dirname, 'public/components/')
        ],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                indentedSyntax: true,
                includePaths: [
                  path.resolve(__dirname, 'node_modules'),
                  path.join(__dirname, 'src/assets/sass'),
                ]
              },
            },
          },
        ]
      },
      // User-provided components-related rules
      {
        test: /\.s[ac]ss$/i,
        exclude: [
          path.join(__dirname, 'src/')
        ],
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                indentedSyntax: true,
                includePaths: [
                  path.resolve(__dirname, 'node_modules'),
                  path.join(__dirname, 'src/assets/sass'),
                ]
              },
            },
          },
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CSSMinimizerPlugin(),
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'vue-sandbox-wrapper.css',
    }),
    new RemoveEmptyScriptsPlugin(),
    autoprefixer,
  ],
}
