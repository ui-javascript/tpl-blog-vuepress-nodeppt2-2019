const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename')


// 删除之前生成的dist目录
gulp.task('clean:_docs', function (cb) {
    return del([
        '_docs/**',
        // @TODO 这样覆盖有用吗???
        '!_docs/.vuepress',
        '_docs/.vuepress/dist/**',
        '_docs/.vuepress/public/**',
    ], cb);
});

// 搬运静态资源
gulp.task('copy:static', function () {
    return gulp.src([
        `static/**/*.*`,
    ])
    .pipe(gulp.dest(`_docs/.vuepress/public/static`))
})

// 搬运Markdown
const appendixFolder = [
    ".vuepress", ".nodeppt", "_docs",
    ".idea", ".git", "node_modules", ".vscode", "static", "public",
    // 附录
    'appendix', 'activity', 'book', 'code', 'dying', 'ext', 'planB', 'regret'
]
gulp.task('copy:markdown', function () {
    return gulp.src([
        `**/*{README,@nice}.md`,
        // @TODO 好像不支持这种格式 {a,b}/**.md
        ...appendixFolder.map(item => `!${item}/**/**md`)
    ])
    .pipe(rename(function (path) {
        // @TODO 正则优化一波
        // eg. [9-1]xxxx-yyyy
        if (path.dirname.includes('[') && path.dirname.includes(']')) {
            path.dirname = path.dirname.replace(/\[/, 'nav.').replace(/\]/, ".")
        }
    }))
    .pipe(gulp.dest(`_docs`))
})

// 清理所有
gulp.task('clean', gulp.series('clean:_docs', function (done) {
    done();
}));

gulp.task('copy', gulp.series('clean:_docs', gulp.parallel('copy:static', 'copy:markdown'), function (done) {
    done();
}));


// gulp4调整了default写法
gulp.task('default', gulp.series('copy:static'));
