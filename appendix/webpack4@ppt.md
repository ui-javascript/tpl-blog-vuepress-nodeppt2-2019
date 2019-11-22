# webpack4-PPT

title: webpack4配置使用基础
speaker: luo0412
theme: dark
headFiles: /static/css/melt.css


[slide]
# webpack配置使用基础
## 骆金参
## 2018-12-12

[slide]   
[magic data-transition="circle"]

<img src="/static/images/fe-tools-stat.png" class="mb-20">

- JavaScript生态圈调查报告 https://sdk.cn/news/7915
 
====

# 构建工具

- 构建工具 https://www.awesomes.cn/repos/Applications/Builds
- (一家独大) webpack
- (正面对手) parcel/rollup/fastpack/...
- (任务运行器) grunt -> gulp -> fis
- (其他对手) yeoman/brunch/browserify/cooking 

====

# 竞争历史

- (竞争对手)gulp/parcel/rollup/fastpack/...
- Gulp -> webpack2 
- Rollup(Tree Shaking) -> webpack3
- Parcel(零配置) -> webpack4
- 将来, 干掉XYZ... -> webpackN

====

# gulp

<div>
    <img src="/static/images/gulp-structure.png" width=365 height=463>
    <img src="/static/images/gulp-task.png" class="ml-30" width=340 height=382>
</div>

====

<div>
    <img src="/static/images/gulp-compile-js.png" width=443 height=221>
    <img src="/static/images/gulp-task-config.png" class="ml-30" width=408 height=442>
</div>

====

<img src="/static/images/browser-sync.png" width=749 height=349>

====

<div>
<img src="/static/images/browser-run.png" width=1497 height=491>
</div> 

====

# gulp的不足

- 没有实现js-module -> require.js/sea.js手动注册
- 单页面应用方面输出乏力
- 浏览器多页应用(MPA)首选方案

====

# 为什么使用webpack

- 一站式的解决方案
- 良好的生态和维护团队
- 一家独大

====

# 占比统计

<img src="/static/images/trend-build-stat.png">

- https://www.npmtrends.com/webpack-vs-parcel-vs-browserify-vs-gulp
- https://stateofdev.com/c/javascript

====

# webpack的不足

- 配置复杂,学习成本高 -> webpack4
- 目前主要用于采用模块化开发的项目
- 语义化 -> SSR
- 浏览器单页应用(SPA)首选方案
[/magic]



[slide]
[magic data-transition="circle"]

# 工作流 | Workflow

- weflow(gulp4) https://github.com/Tencent/WeFlow
- feflow(yeoman) https://github.com/feflow/feflow
- dawn(node.js) https://github.com/alibaba/dawn
- athena2(webpack3) https://github.com/o2team/athena2
- y-workflow(gulp3) https://github.com/yued-fe/y-workflow
- ...

====

# 脚手架 | Scaffold

- antd提供的脚手架市场 http://scaffold.ant.design/#/
- vue-cli
- create-react-app
- react-boilerplate 
- react-starter-kit 
- ...

====

# 快速构建 | Boilerplate

<div>
    <img src="/static/images/vue-scaffold.png" width=594 height=552> 
</div>


====
# Vue常用模板 | Template

<div>
    <img src="/static/images/vue-template.png" width=682 height=455> 
</div>

  
[/magic]


[slide]
[magic data-transition="circle"]
# webpack4升级

- [Webpack 4 和单页应用入门](https://github.com/wallstreetcn/webpack-and-spa-guide) 
- 手摸手，带你用合理的姿势使用webpack4
    - (上) https://juejin.im/post/5b56909a518825195f499806
    - (下) https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc
    
====

# 1.升级

- 升级Node.js -> nvm
- 升级webpack -> webpack cli(提取命令行相关)
- 升级依赖

```shell
npm install webpack@latest -g
npm install webpack-cli -g

npm i --save-dev html-webpack-plugin@next
```

====

# 2.扬弃与加强

- CommonsChunkPlugin -> optimization.splitChunks
- NamedModulesPlugin/NamedChunksPlugin/DefinePlugin/... -> mode
- extract-text-webpack-plugin -> mini-css-extract-plugin 
- css压缩并优化 -> optimize-css-assets-webpack-plugin

```js
// hash > chunkhash > contenthash
new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: devMode ? "[name].css" : "[name].[contenthash:8].css",
  chunkFilename: devMode ? "[id].css" : "[id].[contenthash:8].css"
});
```

====

# 3.常见问题

- DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
- cnpm安装各种诡异 -> node-sass下载???

```shell
1.npm install --registry=https://registry.npm.taobao.org

2.yarn install

3.翻墙/proxy
```

====

# 3.热更新速度

- 开发时不要压缩提取，计算hash等
- souce map -> cheap-source-map
- exclude/include -> 指定资源范围
- babel-plugin-dynamic-import-node -> import()转化为require()

```json
{
  "env": {
    "development": {
      "plugins": ["dynamic-import-node"]
    }
  }
}
```

====

# 4.打包速度

- Uglifyjs -> cache: true、parall: true
- dll
- parallel-webpack 
- happypack


[/magic]


[slide]
[magic data-transition="circle"]

# webpack4 + vue-cli3
# (vue-admin && d2)

- vue-admin-template 
    - https://github.com/PanJiaChen/vue-admin-template
    - 文档 https://panjiachen.github.io/vue-element-admin-site/
- d2-admin 
    - https://github.com/d2-projects/d2-admin
    - 文档 https://doc.d2admin.fairyever.com/zh/
    
====

# vue-element-admin

![](/static/images/logo-element.png)

====

# element-界面预览

<img src="/static/images/element-preview.png"> 
 
- https://panjiachen.github.io/vue-element-admin/#/dashboard

====

# d2-admin

<div> 
 <img src="/static/images/logo-d2.png" width=560 height=560> 
</div>

====

# d2-界面预览

<img src="/static/images/d2-preview.png"> 

- https://d2admin.fairyever.com/#/demo/d2-crud/demo1

====

# 目录对比

<div>
    <img src="/static/images/structure-panjiachen.png" width=424 height=652> 
    <img src="/static/images/structure-d2.png" class="ml-20" width=412 height=593> 
</div>

====

# build/util.js

<img src="/static/images/vue-loader-simplify.png"> 

====

# build/vue-loader.js

<div>
<img src="/static/images/element/vue-loader-old.png" width=503 height=773> 
</div>

====

# 拆包

- https://panjiachen.gitee.io/vue-element-admin/bundle-report

```
1.基础类库 chunk-libs(vue/vuex/vue-router/axios)
2.UI 组件库 chunk-elementUI
3.自定义共用组件/函数 chunk-commons(Layout/Nav/Footer/...)
4.低频组件 chunk-eachrts/chunk-xlsx等
5.业务代码 lazy-loading xxxx.js
```

```
optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        },
        elementUI: {
          name: 'chunk-elementUI', // 单独将 elementUI 拆包
          priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
          test: /[\\/]node_modules[\\/]element-ui[\\/]/
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src/components'), // 可自定义拓展你的规则
          minChunks: 3, // 最小公用次数
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
}
``` 

[/magic]


[slide]
[magic data-transition="circle"]

# vue-cli3

- 官方文档 https://cli.vuejs.org/zh/guide/

```shell 
npm i -g @vue/cli

npm i -g yarn
# yarn global add @vue/cli

vue create my-project

cd vue-project
npm run serve
# yarn serve
```

====

# 界面预览

```shell
# 运行
vue ui
```

![](/static/images/vuecli-ui.png)

====

# 主要功能

- 安装搜索依赖
- 运行管理
- 保存配置文件
- 杀死端口
- 可能官方接入vue生态

====

# 1.env 文件与环境设置

- mode
- env文件

```shell
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略

# 优先级
.env.[mode].local > .env.[mode] > .env.local > .env 

# 如果没找到对应配置文件，其会使用默认环境 
"scripts": {
    "serve": "vue-cli-service serve --mode stage",
}

# 客户端注入
plugins: [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
    }),
],
```

====

# 2.vue.config.js

<img src="/static/images/vue-cli3.png"> 

====

# 2.vue.config.js

- chainWebpack

```js
chainWebpack: config => {
    config.module
        .rule('images')
        .use('url-loader')
        .tap(options =>
            merge(options, {
              limit: 5120,
            })
        )
}
```

<div class="tl">
<img src="/static/images/old-test.png"> 
</div>

- configureWebpack

```
chainWebpack 是链式修改
而 configureWebpack 更倾向于整体替换和修改
```


[/magic]


[slide]

# 感谢倾听


[slide]
[magic data-transition="circle"]

# webpack3
# (vue-boilerplate-template)

- [vue-boilerplate-template](https://github.com/nicejade/vue-boilerplate-template) @old
- @杨琼璞
- PWA + dll + happypack
- [开箱即用的 Vue Webpack 脚手架模版](https://www.jeffjade.com/2018/05/20/140-vue-webpack-boilerplate-template/)
- [Webpack 打包优化之速度篇](https://www.jeffjade.com/2017/08/12/125-webpack-package-optimization-for-speed/)
- [Webpack 打包优化之体积篇](https://www.jeffjade.com/2017/08/06/124-webpack-packge-optimization-for-volume/)

====

<img src="/static/images/nicejade.png" width=677 height=127> 
<img src="/static/images/nicejade-gender.png" width=328 height=198> 

====

# 目录结构

====

# 安装依赖

==== 

# 陌生命令

- yarn run build:dll -> 构建出 vendor.dll.js
- yarn run jarvis -> 非常智能的基于浏览器的Webpack仪表板
- yarn run pretest -> 对生产环境所构建的包进行简单的“预测”

====

# PWA

- sw-precache-webpack-plugin 

[/magic]
