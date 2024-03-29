const path = require('path')
const PugPlugin = require('pug-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isProduction = process.env.NODE_ENV == "production"
const getPagePath = (page) => "./src/pages/" + page

module.exports = {
  target: "web",
  mode: isProduction ? "production" : "development",
  entry: {
    index: getPagePath('index/index.pug'),
    uikit: getPagePath("uikit/uikit.pug"),
    "uikit_colors_and_type": getPagePath("uikit-colors-and-type/uikit-colors-and-type.pug"),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, 'dist')
    },
    watchFiles: {
      paths: ["src/**/*.*"],
      options: {
        usePolling: true
      }
    },
  },
  resolve: {
    alias: {
      Root: path.join(__dirname),
      Layouts: path.join(__dirname, "./src/layouts/"),
      SCSS: path.join(__dirname, "./src/scss/"),
      Containers: path.join(__dirname, "./src/containers/"),
      Components: path.join(__dirname, "./src/components/"),
      Fonts: path.join(__dirname, "./src/assets/fonts/"),
    }
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
        options: {
          data: {
            isDev: !isProduction
          }
        }
      },
      {
        test: /\.scss|css$/,
        use: [
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(jpg|jpeg|png|webp|svg)$/,
        type: "asset/resource",
        exclude: [path.resolve(__dirname, 'src/assets/favicons')],
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(ttf|otf|woff|woff2|eot|svg)$/,
        type: "asset/resource",
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
    ]
  },
  plugins: [
    new PugPlugin({
      pretty: true,
      js: {
        filename: 'js/[name].[contenthash:8].js'
      },
      css: {
        filename: 'css/style.[contenthash:8].css'
      }
    }),
    require('autoprefixer'),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/assets/favicons', to: "images/favicons" }
      ]
    }
    ),
  ],
}
