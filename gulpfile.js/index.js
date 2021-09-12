const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')({ lazy: false });
const { envOptions } = require('./env.js');


function layoutHTML() {
  return gulp.src(envOptions.html.src)
    .pipe($.plumber())
    .pipe($.frontMatter())
    .pipe(
      $.layout((file) => {
        return file.frontMatter;
      })
    )
    .pipe(gulp.dest(envOptions.html.path))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    );
}

gulp.task('layout',()=> {
  return gulp.src(envOptions.html.src)
    .pipe($.plumber())
    .pipe($.frontMatter())
    .pipe(
      $.layout((file) => {
        return file.frontMatter;
      })
    )
    .pipe(gulp.dest(envOptions.html.path))
})




gulp.task('default',gulp.series(layoutHTML));