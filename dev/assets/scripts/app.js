var ko        = require('knockout');

if (App.environment == "dev") {
  var toolbar = require('./toolbar'); 
};

var form = require('./galleryform');
var ProjectForm = require('./projectform');
var GalleryModal = require('./gallery-modal');


// var projectForm = new ProjectForm(500);
// ko.applyBindings(projectForm);

// var galleryModal = new GalleryModal(500);
// ko.applyBindings(galleryModal, document.getElementById('gallerySliderModal'));

var viewModel = {
    shell: new GalleryModal(500),
    profile: new ProjectForm(500)
};

ko.applyBindings(viewModel);



require('./filter-projects'); 
require('./deletegalleryitemanager');