const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  // context: __dirname + '/src',
  entry: "./src/app.js",
  mode: "development",
  module: {
    rules: [
      //react(jsx)语法处理
      {
        test: /\.js?$/,
        exclude: /(node_mpdules)/,
        loader: 'babel-loader',
        options: {
          //这里的路径可能要根据文件名进行修改
          // presets:['E:\\WebstormProjects\\rays-product\\node_modules\\babel-preset-env','E:\\WebstormProjects\\rays-product\\node_modules\\babel-preset-react'],
          presets: ['env', 'react']
        }
      },
      //css文件处理
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      //sass文件处理
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'sass-loader']
        })
      },
      //图片的配置
      {
        test: /\.(png|jpg|gif)$/,
        // test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'resource/[name].[ext]'
            }
          }
        ]
      },
      //字体图标的配置
      {
        test: /\.(woff|woff2|svg|eot|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 8192,
              name: 'resource/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: "/budgetary/dist/",     //这里的路径可能要根据文件名进行修改
    filename: 'js/app.js'
  },
  plugins: [
    //处理html文件
    new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: './src/assets/images/favicon.ico'
      }
    ),
    //独立css文件
    new ExtractTextPlugin("css/[name].css"),
  ],
  //提出公共模块
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2
        }
      }
    }
  },
  devServer: {
    open: true,
    port: 8089,
    //在访问一个路径的时候，如果404找不到或其他位置的话会返回的指定的位置
    historyApiFallback: {
      index: '/dist/index.html'
    }
  }
};
