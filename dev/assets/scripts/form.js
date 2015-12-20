var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var ko = require('knockout');

require('./utils');

var ProjectForm = function ProjectForm() {
  var self = this;

  this.projectImages = ko.observableArray();
  this.imageName = ko.observable();

  var galleryDatabaseDatas = $('.gallery-library').attr("data-gallery-items");
  if (!galleryDatabaseDatas) { return; };
  // Contains every datas from database 
  galleryDatabaseDatas = ko.utils.parseJson(galleryDatabaseDatas);

  this.galleryDatabaseDatas = ko.observableArray(galleryDatabaseDatas);

  this.searchResults = ko.computed(function() {
    if(!this.imageName()) {
      return this.galleryDatabaseDatas(); 
    } else {
      return ko.utils.arrayFilter(self.galleryDatabaseDatas(), function(item) {
          return String(item.projectName).toLowerCase().startsWith(String(self.imageName().toLowerCase())) || String(item.imgPath).toLowerCase().startsWith(String(self.imageName().toLowerCase()));
      });
    }
  }, this);

  this.imageSelected = function (e) {
    var imgPath = $(e.currentTarget).attr("data-img-path");
    if (self.projectImages.indexOf(imgPath) > -1) {
        // Entry exists in the array so we remove it
        self.projectImages.splice(self.projectImages.indexOf(imgPath), 1);
    } else {
        self.projectImages.push(imgPath);
    }
  }

  this.removeProjectImage = function (e) {
    var imgPath = $(e.currentTarget).attr("data-img-path");
    if (self.projectImages.indexOf(imgPath) > -1) {
        // Entry exists in the array so we remove it
        self.projectImages.splice(self.projectImages.indexOf(imgPath), 1);
    } else {
        self.projectImages.push(imgPath);
    }
  }

  this.bindEvents = function() {
      $('.gallery-library').on('click', '.gallery-library__item button', this.imageSelected);
      $('.list-images-selected').on('click', '.list-images-selected__item button', this.removeProjectImage);
  };
  this.bindEvents();
}

ko.applyBindings(new ProjectForm());