var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


io.on('connection', function(socket){
  socket.emit('started');
  socket.on('doPrintscreens', function(socket){
    doPrintscreens(socket.port)
  }); 
});

var path = require("path");
var fs = require("fs");
var Pageres = require('pageres');
var printscreensDirectory = "./public/printscreens";

// @doPrintscreens
// @desc : Generate printscreen of the html file in the "public" directory
// @param - port { Number } : Port of the server which runs the project
// @returs null
var doPrintscreens = function doPrintscreens(port) {
  var files = fs.readdirSync('./public')
  files.filter(function(file) { return file.substr(-5) === '.html'; })
  files = files.filter(function (file) {
      // Take only html file
      return file.substr(-5) === '.html';
  }).map(function (file) {
      // Prefix every html file by the root
      return 'http://127.0.0.1:'+ port + '/' + file;
  }).forEach(function (file) {
      // Prefix every html file by the root
      var pageres = new Pageres()
          .src(file, ['1000x1000'], {
            crop: false,
            filename: "<%= url %>",
            hide: ["#pages-overview-toolbar"],
            format: "jpg"
          })
          .dest(printscreensDirectory)
          .run()
          .then();
  });

  console.log(generatePrintScreensObject())
}

// @generatePrintScreensObject
// @desc : Generate a JSON Object contained every datas of the printscreens
// @returs JSON Object
var generatePrintScreensObject = function generatePrintScreensObject () {
  var printscreenPath = printscreensDirectory
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
          var tplToolbarObject = {tplName: tplName, imgPath: printscreensDirectory+fileName+path.extname(file), path: url};
          printscreensArray.push(tplToolbarObject)
      });
    }
  } catch (e) {

  }

  return printscreensArray;
}

/*http.listen(5000, function(res){
  console.log('listening on *:', http.address().port);
});*/