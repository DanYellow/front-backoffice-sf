var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var ko = require('knockout');
var _ = require('underscore');

require('./utils');

var ProjectForm = function ProjectForm(searchDelay) {
  var self = this;

  this.searchDelay = searchDelay;

  var galleryDatabaseDatas = $('.gallery-library').attr("data-gallery-items");
  var galleryBasePath = $('.gallery-library').attr("data-img-basepath");
  var gallerySearchFilters = $('.gallery-library').attr("data-search-filters").split(',');

  // Mapping property for sf2 or any backend language
  var galleryImgKey = $('.gallery-library').attr("data-img-key");

  // There is no images so nothing to show
  if (!galleryDatabaseDatas) { return; };
  // Contains every datas from database 
  galleryDatabaseDatas = ko.utils.parseJson(galleryDatabaseDatas);

  // If image are stored in a "weird" base path, we map it
  if (galleryBasePath) {
    galleryDatabaseDatas = _.map(galleryDatabaseDatas, function(object){ 
      object[galleryImgKey] = galleryBasePath + object[galleryImgKey];
      
      return object; 
    });
  }
  

  // We associate these datas to a class property for knockoutjs
  this.galleryDatabaseDatas = ko.observableArray(galleryDatabaseDatas);

  this.projectImages = ko.observableArray(_.where(galleryDatabaseDatas, {isInProject: true}));
  this.searchTyped = ko.observable();
  this.classItems = ko.observable();

  
  this.searchResults = ko.computed(function() {
    if(!this.searchTyped()) {
      return this.galleryDatabaseDatas(); 
    } else {
      return ko.utils.arrayFilter(self.galleryDatabaseDatas(), function(item) {
          for (var i = 0; i < gallerySearchFilters.length; i++) {
            return String(item[gallerySearchFilters[i]]).toLowerCase().startsWith(String(self.searchTyped().toLowerCase()))
          };
      });
    }
  }, this);
  this.searchResults.extend({ rateLimit: this.searchDelay });

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
    var imgPath = ko.utils.parseJson($(e.currentTarget).attr("data-gallery-item")).imgPath;
    if (_.findIndex(self.projectImages(), {imgPath: imgPath}) > -1) {
        // Entry exists in the array so we remove it
        self.projectImages.remove(function (item) { return String(item.imgPath) === String(imgPath); });
    } else {
        self.projectImages.push(ko.utils.parseJson($(e.currentTarget).attr("data-gallery-item")));
    }
  }

  this.removeProjectImage = function (e) {
    var imgPath = $(e.currentTarget).attr("data-img-path");
    
    if (_.findIndex(self.projectImages(), {imgPath: imgPath}) > -1) {
      var indexEl = _.findIndex(self.projectImages(), {imgPath: imgPath});
        // Entry exists in the array so we remove it
       self.projectImages.remove(function (item) { return String(item.imgPath) === String(imgPath); });
    } else {
      console.error('how did you make this ?');
    }
  }

  this.bindEvents = function() {
      $('.gallery-library').on('click', '.gallery-library__item button', this.imageSelected);
      $('.list-images-selected').on('click', '.list-images-selected__item button', this.removeProjectImage);
  };
  this.bindEvents();
}

ko.applyBindings(new ProjectForm(500));