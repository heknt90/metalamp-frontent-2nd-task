const path = require('path')
const PugPlugin = require('pug-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin  = require('copy-webpack-plugin')

const sourcePath = path.join(__dirname, 'src');
const keepPugFolderStructure = (pathData) => {
    const sourceFile = pathData.filename;                       
    const relativeFile = path.relative(sourcePath, sourceFile); 
    const { dir, name } = path.parse(relativeFile);             
    return `${dir}/${name}.html`;                         
};

module.exports = {
    mode: "production",
    entry: {
        index:'./src/index.pug',
        "ui-colors-and-types": {
            import: "./src/ui-kit/color-and-types.pug",
            filename: keepPugFolderStructure
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist/')
    },
    devServer: {
        port: 4200,
        liveReload: true,
        watchFiles: ["src/**/*"]
    },
    target: "web",
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
                {from: './src/assets/favicons', to: ""}
            ]
        }
        ),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: PugPlugin.loader,
                exclude: ['/node_modules']
            },
            {
                test: /\.scss$/,
                use: ['css-loader', 'postcss-loader', 'sass-loader'],
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
    }
}