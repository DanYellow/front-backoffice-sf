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

  var hiddenInput = $('[data-hidden-input-id]').attr("data-hidden-input-id")
  self.hiddenInput = $(hiddenInput);

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
        var finalFilter = [];      
        for (var i = 0; i < gallerySearchFilters.length; i++) {
          finalFilter.push(String(item[gallerySearchFilters[i].trim()]).toLowerCase().startsWith(String(self.searchTyped().toLowerCase())));
        };
        
        return _.contains(finalFilter, true);
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
    var idImg = ko.utils.parseJson($(e.currentTarget).attr("data-gallery-item")).id;
  
    if (_.findIndex(self.projectImages(), {id: idImg}) > -1) {
        // Entry exists in the array so we remove it
        self.projectImages.remove(function (item) { return Number(item.id) === Number(idImg); });
    } else {
        self.projectImages.push(ko.utils.parseJson($(e.currentTarget).attr("data-gallery-item")));
    }
    self.hiddenInput.val(_.pluck(self.projectImages(), 'id').join(','));
  }

  this.removeProjectImage = function (e) {
    var idImg = ko.utils.parseJson($(e.currentTarget).attr("data-gallery-item")).id;
    
    if (_.findIndex(self.projectImages(), {id: idImg}) > -1) {
        // Entry exists in the array so we remove it
      self.projectImages.remove(function (item) { return Number(item.id) === Number(idImg); });
    } else {
      // Technically none should entry in this case
      console.error('how did you make this ?');
    }
    self.hiddenInput.val(_.pluck(self.projectImages(), 'id').join(','));
  }

  this.bindEvents = function() {
      $('.gallery-library').on('click', '.gallery-library__item button', this.imageSelected);
      $('.list-images-selected').on('click', '.list-images-selected__item button', this.removeProjectImage);
  };
  this.bindEvents();
}

ko.applyBindings(new ProjectForm(500));