const path = require("path")
const barConfig = require('./utils')

// console.log('----------环境变量')
// console.log(process.env.NODE_ENV)

function resolve(dir) {
    return path.join(__dirname, dir)
}


module.exports = {
    title: 'Web开发笔记',
    description: 'Web开发笔记',
    // head: [
    //   ['link', { rel: 'icon', href: 'https://www.xxxx.com/favicon.ico' }]
    // ],

    // @fix 路径 --> vuepress已优化，直接填最终路径即可
    // base: process.env.NODE_ENV !== 'development' ? '/note/' : '',
    base: '/note/',
    themeConfig: {
        nav: [
            ...barConfig.nav
            , {text: 'Github', link: 'https://github.com/luo0412'}
        ],
        sidebar: barConfig.sidebar,
        docsDir: '/',
        lastUpdated: '更新时间',
    },
    markdown: {
        extendMarkdown: md => {
            // console.log('---------md')
            // console.log(md)

            // md.set({ breaks: true })
            // md.use(require('markdown-it-xxx'))
        }
    },
    plugins: [
        // 返回顶部-插件
        ['@vuepress/back-to-top', true],
        // 图片缩放-插件
        ['@vuepress/medium-zoom', {
            selector: 'img',
            // See: https://github.com/francoischalifour/medium-zoom#options
            options: {
                margin: 16
            }
        }],
        // 代码复制-插件
        ['vuepress-plugin-code-copy', true],
        // 拼音导航-插件 -> 最终url的显示更改, 并不是真的改变了文件路径??
        'permalink-pinyin'
    ],

    // 配置
    // configureWebpack: (config, isServer) => {
    //     console.log('-----------config')
    //     console.log(config.plugins)
    //     console.log(config.plugins.HtmlWebpackPlugin)
    //
    //     if (!isServer) {
    //         // 修改客户端的 webpack 配置
    //     }
    // },
    chainWebpack: (config, isServer) => {
        // console.log('-----------config')
        // console.log(config)

        // 内嵌图片的阈值
        const inlineLimit = 10000
        config.module.rule('images')
            .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
            .use('url-loader')
            .loader('url-loader')
            .options({
                limit: inlineLimit,
                name: `assets/img/[name].[hash:8].[ext]`
            })

        // const excludePath = path.resolve(__dirname, "!../**/**{nice,readme}*.md");
        // console.log('---------路径')
        // console.log(excludePath)

        // config.module
        //     .rule('js')
        //     .test(/\.js$/)
        //     .use('babel-loader')
        //     .loader('babel-loader')
        //     .options({
        //         name: `assets/js/[resource-path].[namespace].[id].[hash:7].[ext]`
        //     })

    },

    // 仅主流浏览器上阅读
    evergreen: true,
}
