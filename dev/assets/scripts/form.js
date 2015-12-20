var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var ko = require('knockout');

function ProjectForm() {
  this.images = ko.observableArray();
  var self = this;

  this.imageSelected = function (e) {
    var imgPath = $(e.currentTarget).attr("data-img-path");
    if (self.images.indexOf(imgPath) > -1) {
        // Entry exists in the array so we remove it
        self.images.splice(self.images.indexOf(imgPath), 1);
    } else {
        self.images.push(imgPath);
    }
  }

  this.removeProjectImage = function (e) {
    var imgPath = $(e.currentTarget).attr("data-img-path");
    if (self.images.indexOf(imgPath) > -1) {
        // Entry exists in the array so we remove it
        self.images.splice(self.images.indexOf(imgPath), 1);
    } else {
        self.images.push(imgPath);
    }
  }

  this.bindEvents = function() {
      $('.gallery-library__item button').on('click', this.imageSelected)
      $('.list-images-selected').on('click', '.list-images-selected__item button', this.removeProjectImage)
  };
  this.bindEvents();
}

ko.applyBindings(new ProjectForm());