var gulp = require('gulp');
var clean = require('gulp-clean');
var path = require("path");
var fs = require("fs");



var swig = require('gulp-swig');

gulp.task('templates', function(req, res) {
  var printscreenPath = "./public/printscreens"
  var printscreensArray = [];
  var fileName = "", url = "";

  // Contains every files "prinscreened"
  var files = fs.readdirSync(printscreenPath)

  var isFolderExists = fs.lstatSync(printscreenPath);

    // Is it a directory?
    try {
      if (isFolderExists.isDirectory()) {
        files = files.map(function (file) {
          return path.join(printscreenPath, file);
        }).filter(function (file) {
            return fs.statSync(file).isFile();
        }).forEach(function (file) { 
            fileName = path.basename(file, path.extname(file))
            url = fileName + ".html";
            var tplToolbarObject = {name: fileName, imgPath: "printscreens/"+fileName+path.extname(file), path: url};
            printscreensArray.push(tplToolbarObject)
        });
      }
    } catch (e) {

    }

  var opts = {
        load_json: false,
        data: {
          printscreens: printscreensArray
        }
      };

  return gulp.src('./dev/views/*.html')
    .pipe(swig(opts))
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
    gulp.watch("./dev/views/**/*.html", ['printscreens', 'templates'])
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


var Pageres = require('pageres');
var rename = require("gulp-rename");

gulp.task('printscreens', function () {
  var pageres = new Pageres({delay: 2})
    .src('http://127.0.0.1:3000/index.html', ['1000x1000'], {
      crop: false,
      filename: "<%= url %>",
      hide: ["#pages-overview-toolbar"],
      format: "jpg"
    })
    .dest("./public/printscreens")
    .run()
    .then(() => sanitizeFilesNames());
});

// @sanitizeFilesNames
// @desc : clean file name to be correct for the toolbar
// @todo : remove old file
function sanitizeFilesNames () {
  gulp.src("./public/printscreens/**/*")
  .pipe(rename(function (path) {
    path.basename = path.basename.split('!')[path.basename.split('!').length-1].split('.')[0];
    path.extname = path.extname;
  }))
  .pipe(gulp.dest("./public/printscreens/"));
}







gulp.task('default', ['browser-sync']);


gulp.task('package', ['clean']);