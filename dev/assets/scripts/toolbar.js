var $ = require('jquery');
var io = require('socket.io-client');

var toolBar = document.getElementById('pages-overview-toolbar');
var toolbarManager = document.getElementById('toolbar__display-manager');
var generatePSBtn = document.getElementById('generatePS');

var socket = io.connect('localhost:5000');

toolbarManager.addEventListener('click', function (e) {
  toolbarStatusManager()
})

generatePSBtn.addEventListener('click', function (e) {
  socket.emit('doPrintscreens', {port: window.location.port});
});

socket.on('started', function(){
  console.log('"fregtre')
});

var toolbarStatusManager = function toolbarStatusManager () {
  if (toolBar.classList.contains("collapsed")) {
    toolBar.classList.remove("collapsed");
  } else {
    toolBar.classList.add("collapsed");
  }
}

window.foo = function foo(){
    socket.emit('doPrintscreens');
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}