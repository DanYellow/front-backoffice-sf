var gulp = require('gulp');
var clean = require('gulp-clean');
var path = require("path");
var fs = require("fs");



var swig = require('gulp-swig');

gulp.task('templates', function(req, res) {
  var printscreenPath = "public/printscreens"
  var printscreensArray = [];
  var fileName = "", url = "";

  fs.readdir(printscreenPath, function (err, files) {
      if (err) {
          throw err;
      }

      files.map(function (file) {
          return path.join(printscreenPath, file);
      }).filter(function (file) {
          return fs.statSync(file).isFile();
      }).forEach(function (file) { 
          fileName = path.basename(file, path.extname(file))
          url = fileName + ".html";
          var tplToolbarObject = {name: fileName, imgPath: "printscreens/"+fileName+path.extname(file), path: url};
          printscreensArray.push(tplToolbarObject)
      });

      var opts = {
        load_json: false,
        data: {
          printscreens: printscreensArray
        }
      };

      gulp.src('./dev/views/*.html')
        .pipe(swig(opts))
        .pipe(swig({defaults: { cache: false }}))
        .pipe(gulp.dest('./public/'));
  });
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
  return gulp.src(['public'], {read: false})
    .pipe(clean());
});


gulp.task('default', ['browser-sync']);


gulp.task('package', ['clean']);