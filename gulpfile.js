var gulp = require('gulp');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var webpack = require('webpack-stream');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');
var merge2 = require('merge2');
var rename = require("gulp-rename");
var replace = require('gulp-replace');

function swallowError(error) {
  console.log(error.toString());
  this.emit('end');
}

gulp.task('webpack', function() {
  return webpack(require('./webpack.config.js'))
    .on('error', swallowError)
    //.pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('minify-css', function() {
  return gulp.src(['src/public/css/*.css', 'src/public/css/**/*.css'])
    .pipe(concat('all.css'))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('lint-server', function() {
  return gulp.src(['src/server/*.js', 'src/server/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint-public', function() {
  return gulp.src(['src/public/*.js', 'src/public/**/*.js', 'src/public/*.jsx', 'src/public/**/*.jsx'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint', ['lint-server', 'lint-public']);

gulp.task('build-server', function() {
  return gulp.src(['src/*.js', 'src/**/*.js', 'src/*.jsx', 'src/**/*.jsx'])
    .pipe(babel())
    .on('error', swallowError)
    .pipe(gulp.dest('build'));
});

gulp.task('build', ['build-server', 'webpack', 'minify-css']);

gulp.task('auto-lint', function() {
  gulp.watch(['src/*.*', 'src/**/*.*'], ['lint']);
});

gulp.task('auto-build', function() {
  gulp.watch(['src/*.*', 'src/**/*.*'], ['build']);
});

gulp.task('nodemon', function() {
  nodemon({
    script: 'build/server/web.js',
    delay: 1000,
    ignore: ['src/*.*', 'src/**/*.*'],
    env: {
      'NODE_ENV': 'development'
    }
  })
})
