# README

vuepress + nodeppt搭建博客

这个模板，只有作死小能手才能用...

# 使用

- 结构: article -> topic -> chapter -> nav

```
1. navPrefixArr 是数组类型 ['nav', 'ch'] 
2. README.md必须大写 --> @lazy
3. navbar上可点击的目录(含navPrefixArr前缀)都要有README.md, 否则不计入navbar,
普通目录可以没有README.md
4. 除README.md以外的文章, 要包含includeArticleSuffix(eg.@nice)后缀才会加入文章列表
--> 把一些low的文章藏起来
```

- 发布

```
安装过git bash
windows直接用点击 deploy.vuepress.sh
```

# TODO

- [x] 按照自己的笔记命名习惯调整vuepress-bar的递归逻辑!!!
- [x] 引入一些常用vuepress插件
- [x] 保证static绝对路径正常引用 --> 在github上直接阅读markdown也能正常加载图片路径

```
目前, vuepress提供的这种引入方法不适合...
![Image from alias](~@alias/image.png)

暂时用gulp4简单搬运那些静态文件 --> 文件一多就jj了

部署后还需要全局替换路径 --> 我太难了...
gulp.task('path:replace', function() {
    return gulp
        .src([
            '_docs/.vuepress/dist/**/*.{html,js}',
        ])
        // 理解一波 ??
        .pipe(gulpReplace(/(?<!note\/)static\/images/g, 'note/static/images'))
        .pipe(gulp.dest('_docs/.vuepress/dist'));
});
```

- [x] vuepress build时不要打包文件夹下的所有markdown!!!
    - Ignore some markdown files in source directory 
    - https://github.com/vuejs/vuepress/issues/1558

```
改为 在运行前将所有符合条件的markdown搬运到 _docs

gulp.task('copy:markdown', function () {
    return gulp.src([
        `**/*{README,@nice}.md`,
    ])
    .pipe(rename(function (path) {
        if (path.dirname.includes('[') && path.dirname.includes(']')) {
            path.dirname = path.dirname.replace(/\[/, 'nav.').replace(/\]/, ".")
        }
    }))
    .pipe(gulp.dest(`_docs`))
})

还是gulp大法好啊!!!
```

- [ ] 用nodeppt指定部分markdown, 渲染成ppt
- [ ] 发布时间 timeline
- [ ] 评论功能 vssue
- [ ] 对涉及正则表达式/路径匹配的代码进行优化 --> 构建前clean文件失败??
- [ ] 首页装饰
- [ ] 处理文件名里的tag + keyword

# 次要改进

- [x] 文件可以处理 "[" 等特殊符号, 但目录路径却无法处理这些符号!! --> ??

```
习惯给目录这样命名
eg. [8-2]xxxx
希望可以支持...

暂时也通过gulp搬运的时候顺便重命名了
```

- [ ] 放宽对README.md的格式要求
- [ ] 加入部分 vuepress-theme-meteorlxy主题包的内容 
- [ ] 英文对应的翻译文章

# FAQ

- Field 'browser' doesn't contain a valid alias configuration --> 找不到图片等

- 使用github-page需要配置的base路径 @ignore --> vuepress已处理

```
module.exports = {
  base: process.env.NODE_ENV === 'production' ? '/note/' : '',
}

并且.env.production里配置环境变量

vuepress build好像还是拿不到NODE_NEV?? --> cross-env
```


# 参考

- https://github.com/realpdai/tech-arch-doc-comments @nice
- https://github.com/ozum/vuepress-bar
- https://github.com/boboidream/note

