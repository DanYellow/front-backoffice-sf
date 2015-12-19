// var $ = require('jquery');
var $ = require( 'jquery' )
var io = require('socket.io-client'); 

var template = require("./templates/toolbar.hbs");

var toolBar = document.getElementById('pages-overview-toolbar');
var toolbarManager = document.getElementById('toolbar__display-manager');
var printscreensList = document.getElementsByClassName('printscreens-list')[0];
var printscreensListItems = document.getElementsByClassName('printscreens-list__item');
var generatePSBtn = document.getElementById('generatePS');

var socket = io.connect('localhost:5000');

toolbarManager.addEventListener('click', function (e) {
  toolbarStatusManager();
});

var elementSelectedIndex = null;
var getItemSelected = function getItemSelected (index) {
  elementSelectedIndex = index;

  var currentPage = {index: index}
  window.localStorage.setItem('_toolbarCurrentPage', JSON.stringify(currentPage));
}

window.addEventListener("load", function() {
  var elementSelectedIndex = JSON.parse(window.localStorage.getItem('_toolbarCurrentPage')).index;
  if (!isNaN(elementSelectedIndex) ) {
    printscreensListItems[elementSelectedIndex].classList.add("active");
    printscreensListItems[elementSelectedIndex].scrollIntoView();
  };
});

for (var i = 0; i < printscreensListItems.length; i++) {
    printscreensListItems[i].addEventListener('click', getItemSelected.bind(null, i), false);
}

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
  printscreensList.innerHTML = template({printscreensDatas: message.printscreensDatas, port: window.location.port})
  
  

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
