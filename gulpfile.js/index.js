const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const $ = require('gulp-load-plugins')({ lazy: false })
const { envOptions } = require('./env.js')
var webpack = require('webpack')
var webpackConfig = require('../webpack.config.js')

function layoutHTML() {
    return gulp
        .src(envOptions.html.src)
        .pipe($.plumber())
        .pipe($.frontMatter())
        .pipe(
            $.layout((file) => {
                return file.frontMatter
            })
        )
        .pipe(gulp.dest(envOptions.html.path))
        .pipe(webpack(webpackConfig))
        .pipe(
            browserSync.reload({
                stream: true,
            })
        )
}

function browser() {
    browserSync.init({
        server: {
            baseDir: envOptions.browserSetting.dir,
        },
        port: envOptions.browserSetting.port,
    })
}

function watch() {
    gulp.watch(envOptions.html.src, gulp.series(layoutHTML))
    gulp.watch(envOptions.html.ejsSrc, gulp.series(layoutHTML))
}

gulp.task('default', gulp.series(layoutHTML, gulp.parallel(browser, watch)))
