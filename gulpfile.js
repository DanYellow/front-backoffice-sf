var gulp = require('gulp');
var clean = require('gulp-clean');
var path = require("path");
var fs = require("fs");
var app = require('express');

var browserSync = require('browser-sync').create();

gulp.task('templates', function(req, res) {
  var printscreenPath = "./public/printscreens"
  var printscreensArray = [];
  var fileName = "", url = "", tplName = "";

  try {
    var isFolderExists = fs.lstatSync(printscreenPath);
    if (isFolderExists.isDirectory()) {
      var files = fs.readdirSync(printscreenPath)

      files = files.map(function (file) {
        return path.join(printscreenPath, file);
      }).filter(function (file) {
          return fs.statSync(file).isFile();
      }).forEach(function (file) { 
          fileName = path.basename(file, path.extname(file))
          tplName = fileName.split('!')[fileName.split('!').length-1].split('.')[0];

          url = tplName + ".html";
          var tplToolbarObject = {tplName: tplName, imgPath: "printscreens/"+fileName+path.extname(file), path: url};
          printscreensArray.push(tplToolbarObject)
      });
    }
  } catch (e) {

  }

  var opts = {
    datas: {
      printscreens: printscreensArray
    }
  };

  var nunjucksRender = require('gulp-nunjucks-render');

  nunjucksRender.nunjucks.configure(['./dev/views/'], {watch: false});
  return gulp.src('./dev/views/*.html')
    .pipe(nunjucksRender(opts))
    .pipe(gulp.dest('public'));
});


var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', function () {
  gulp.src('./dev/assets/styles/**/*.scss')
    .pipe(sass({outputStyle: 'outputStyle'}).on('error', sass.logError))
    .pipe(gulp.dest('./public/assets/styles'))
    .pipe(browserSync.stream()); 
});
 



// Static server
gulp.task('browser-sync', ['sass', 'templates', 'fonts', 'browserify'], function() {
    browserSync.init({
        server: {
            baseDir: "./public",
            index: "index.html"
        }
    }, function (err, bs){
      //console.log(bs.ui.port)
    });

    gulp.watch("./dev/assets/styles/**/*.scss", ['sass']);
    gulp.watch("./dev/views/**/*.html", ['templates']).on('change', browserSync.reload);;
    gulp.watch("./dev/assets/scripts/**/*.js", ['browserify'])
    .on('change', browserSync.reload);
});

gulp.task('fonts', function(){
  // the base option sets the relative root for the set of files,
  // preserving the folder structure 
  gulp.src("./dev/assets/fonts/**")
  .pipe(gulp.dest('./public/assets/fonts'));
});


gulp.task('clean', function () {
  console.log('frfre')
  /*return gulp.src(['public'], {read: false})
    .pipe(clean());*/
});


var Pageres = require('pageres');

gulp.task('printscreens', function () {

  var files = fs.readdirSync('./public')
  files.filter(function(file) { return file.substr(-5) === '.html'; })


  files = files.filter(function (file) {
      // Take only html file
      return file.substr(-5) === '.html';
  }).map(function (file) {
      // Prefix every html file by the root
      return 'http://127.0.0.1:3000/' + file;
  }).forEach(function (file) {
      // Prefix every html file by the root
      var pageres = new Pageres()
          .src(file, ['1000x1000'], {
            crop: false,
            filename: "<%= url %>",
            hide: ["#pages-overview-toolbar"],
            format: "jpg"
          })
          .dest("./public/printscreens")
          .run()
          .then();
  });
});

var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {
    return browserify('./dev/assets/scripts/app.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./public/'));
});



gulp.task('default', ['browser-sync']);


gulp.task('pst', ['printscreens', 'templates']);

gulp.task('package', ['clean']);