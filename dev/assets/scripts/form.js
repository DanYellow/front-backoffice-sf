var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var ko = require('knockout');
var _ = require('underscore');

require('./utils');

var ProjectForm = function ProjectForm() {
  var self = this;

  var galleryDatabaseDatas = $('.gallery-library').attr("data-gallery-items");
  if (!galleryDatabaseDatas) { return; };
  // Contains every datas from database 
  galleryDatabaseDatas = ko.utils.parseJson(galleryDatabaseDatas);

  this.galleryDatabaseDatas = ko.observableArray(galleryDatabaseDatas);

  this.projectImages = ko.observableArray(_.where(galleryDatabaseDatas, {isInProject: true}));
  this.imageName = ko.observable();
  this.classItems = ko.observable();

  

  this.searchResults = ko.computed(function() {
    if(!this.imageName()) {
      return this.galleryDatabaseDatas(); 
    } else {
      return ko.utils.arrayFilter(self.galleryDatabaseDatas(), function(item) {
          return String(item.projectName).toLowerCase().startsWith(String(self.imageName().toLowerCase())) || String(item.imgPath).toLowerCase().startsWith(String(self.imageName().toLowerCase()));
      });
    }
  }, this);

  this.classItems = ko.computed(function() {
    var classSuffix = 0;
    if (this.searchResults().length <= 2) {
      classSuffix = 6;
    } else if (this.searchResults().length >= 3 && this.searchResults().length < 16) {
      classSuffix = 4;
    } else if (this.searchResults().length >= 16 && this.searchResults().length < 20) {
      classSuffix = 3;
    } else if (this.searchResults().length >= 20) {
      classSuffix = 2;
    };

    return classSuffix;
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
    
    if (_.findIndex(self.projectImages(), {imgPath: imgPath}) > -1) {
      var indexEl = _.findIndex(self.projectImages(), {imgPath: imgPath});
        // Entry exists in the array so we remove it
        //console.log( self.projectImages())
       self.projectImages.remove(function (item) { return String(item.imgPath) === String(imgPath); });
      /*self.projectImages().splice(indexEl, 1);
      self.projectImages(self.projectImages());*/
    } else {
        self.projectImages().push(imgPath);
    }
  }

  this.bindEvents = function() {
      $('.gallery-library').on('click', '.gallery-library__item button', this.imageSelected);
      $('.list-images-selected').on('click', '.list-images-selected__item button', this.removeProjectImage);
  };
  this.bindEvents();
}

ko.applyBindings(new ProjectForm());