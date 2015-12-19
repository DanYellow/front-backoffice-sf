// var $ = require('jquery');
var $ = require( 'jquery' )
var io = require('socket.io-client'); 


var template = require("./toolbar.hbs"); 

var toolBar = document.getElementById('pages-overview-toolbar');
var toolbarManager = document.getElementById('toolbar__display-manager');
var printscreensList = document.getElementsByClassName('printscreens-list')[0];
var generatePSBtn = document.getElementById('generatePS');

var socket = io.connect('localhost:5000');

toolbarManager.addEventListener('click', function (e) {
  toolbarStatusManager()
})

generatePSBtn.addEventListener('click', function (e) {
  if (!socket.connected) {
    alert("Wow ! It look's like the socket server is not started");
    return;
  };
  generatePSBtn.disabled = true;
  socket.emit('doPrintscreens', {port: window.location.port});
});

socket.on('printScreensEnded', function(message){
  generatePSBtn.disabled = false;
  console.log(message.printscreensDatas)
  printscreensList.innerHTML = template({printscreensDatas: message.printscreensDatas})
  //document.location.reload();
  // document.getElementById('generatePS').disabled = true
});

var toolbarStatusManager = function toolbarStatusManager () {
  if (toolBar.classList.contains("collapsed")) {
    toolBar.classList.remove("collapsed");
  } else {
    toolBar.classList.add("collapsed");
  }
}
