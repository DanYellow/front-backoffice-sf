var gulp = require('gulp');



var swig = require('gulp-swig');

gulp.task('templates', function() {
  gulp.src('./dev/views/**/*.html')
    .pipe(swig())
    .pipe(swig({defaults: { cache: false }}))
    .pipe(gulp.dest('./public/views/'));
});



var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function () {
  gulp.src('./dev/assets/styles/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./public/assets/styles'))
    .pipe(browserSync.stream()); 
});
 

var browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', ['sass', 'templates', 'fonts'], function() {
    browserSync.init({
        server: {
            baseDir: ["public", "dev"],
            index: "views/connexion.html"
        }
    });

    gulp.watch("./dev/assets/styles/**/*.scss", ['sass']);
    gulp.watch("./dev/views/**/*.html", ['templates'])
    .on('change', browserSync.reload);
});


gulp.task('fonts', function(){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src("./dev/assets/fonts/**")
  .pipe(gulp.dest('./public/assets/fonts'));
});


gulp.task('default', ['browser-sync']);