var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    order = require("gulp-order"),
    del = require('del');
//压缩css
gulp.task('minifycss', function() {
    return gulp.src('src/css/*.css')        //压缩的文件
    .pipe(                                  //在压缩前设定排序
        order([
            '**/base.css',
            '**/GridManager.css'
        ])
    )
 //   .pipe(concat('GridManager.min.css'))    //合并所有css到GridManager.css
    .pipe(minifycss())                      //执行压缩
    .pipe(gulp.dest('dist/css'));           //输出文件夹
});
//压缩GridManager.js
gulp.task('minifygm', function() {
    return gulp.src('src/js/GridManager.js')
   //     .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('dist/js'));  //输出GridManager.min.js
});
//copy jquery to dist js
gulp.task('movejquery', function() {
    return gulp.src('src/js/jquery-2.1.4.min.js')
        .pipe(gulp.dest('dist/js'));  //输出GridManager.min.js
});
//移动html文件
gulp.task('movehtml', function () {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
});
//移动json文件
gulp.task('movejson', function () {
    return gulp.src('src/data/*.json')
        .pipe(gulp.dest('dist/data'))
});
//移动fonts
gulp.task('movefonts', function () {
    return gulp.src('src/fonts/*.*')
        .pipe(gulp.dest('dist/fonts'))
});
//执行压缩前，先删除文件夹里的内容
gulp.task('clean', function() {
    del.sync(['dist/*']);
});
//默认命令，在cmd中输入gulp后，执行的就是这个命令
gulp.task('default', ['clean'], function() {
    gulp.start('minifycss', 'minifygm', 'movejquery', 'movehtml', 'movejson', 'movefonts');
});