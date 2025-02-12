const {defineConfig} = require('@vue/cli-service')
const path = require("path");
module.exports = defineConfig({
    transpileDependencies: true, lintOnSave: false, devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:12000', changeOrigin: true, pathRewrite: {'^/api': ''}
            }
        }
    }, chainWebpack: config => {
        config.module
            .rule('svg')
            .exclude.add(path.join(__dirname, './src/assets/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.join(__dirname, './src/assets/icons'))
            .end()
            .use('svg-sprite')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    },
})
