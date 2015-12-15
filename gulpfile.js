var gulp = require('gulp');
var clean = require('gulp-clean');


var swig = require('gulp-swig');

gulp.task('templates', function() {
  gulp.src('./dev/views/*.html')
    .pipe(swig())
    .pipe(swig({defaults: { cache: false }}))
    .pipe(gulp.dest('./public/'));
});



var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function () {
  gulp.src('./dev/assets/styles/**/*.scss')
    .pipe(sass({outputStyle: 'outputStyle'}).on('error', sass.logError))
    .pipe(gulp.dest('./public/assets/styles'))
    .pipe(browserSync.stream()); 
});
 

var browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync', ['sass', 'templates', 'fonts',], function() {
    browserSync.init({
        server: {
            baseDir: ["public", "dev"],
            index: "index.html"
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


gulp.task('clean', function () {
  return gulp.src(['!public/assets/fonts', 'public'], {read: false})
    .pipe(clean());
});

gulp.task('default', ['browser-sync']);