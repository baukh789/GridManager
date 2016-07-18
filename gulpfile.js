var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del');
//压缩css
gulp.task('minifycss', function() {
    return gulp.src('src/css/*.css')      //压缩的文件
        .pipe(gulp.dest('dist/css'))   //输出文件夹
        .pipe(uglify());   //执行压缩
});
//压缩js
gulp.task('minifyjs', function() {
    console.log('minifyjs')
    return gulp.src('src/js/GridManager.js')
     //   .pipe(concat('main.js'))    //合并所有js到main.js
        .pipe(gulp.dest('dist/js'))    //输出main.js到文件夹
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('dist/js'));  //输出
});
//执行压缩前，先删除文件夹里的内容
gulp.task('clean', function(cb) {
    del(['dist/css', 'dist/js'], cb);
    gulp.start('minifycss', 'minifyjs');
});
//默认命令，在cmd中输入gulp后，执行的就是这个命令
gulp.task('default', ['clean'], function() {
});