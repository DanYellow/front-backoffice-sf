var $         = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var ko        = require('knockout');
var _         = require('underscore');

var GalleryModal = function ProjectForm(searchDelay) {
  // Prevent error if there no need of filter
  if ($('[data-modal-slider-image]').length == 0) { return };

  var self = this;

  this.searchDelay = searchDelay;

  var galleryDatabaseDatas = $('[data-modal-slider-image]').attr("data-gallery-items");
  var galleryBasePath = $('[data-modal-slider-image]').attr("data-img-basepath");
  var gallerySearchFields = $('[data-modal-slider-image]').attr("data-search-fields").split(',');
  var searchType = $('[data-modal-slider-image]').attr("data-search-type");

  var finalFilter = [];
  var hiddenInput = $('[data-hidden-input-slider-id]').attr("data-hidden-input-slider-id")
  self.hiddenInput = $(hiddenInput);

  // Mapping property for sf2 or any backend language
  var galleryImgKey = $('[data-modal-slider-image]').attr("data-img-key");
  this.searchResults = []
  // There is no images so nothing to show
  if (!galleryDatabaseDatas) { return; };
  // Contains every datas from database 
  galleryDatabaseDatas = ko.utils.parseJson(galleryDatabaseDatas);
  var projectSliderImageId = self.hiddenInput.val().split();

  // If image are stored in a "weird" base path, we map it
  galleryDatabaseDatas = _.map(galleryDatabaseDatas, function(object){ 
    object[galleryImgKey] = galleryBasePath + object[galleryImgKey];
    object["inProject"] = (projectSliderImageId.indexOf(String(object.id)) > -1) ? true : false;
    
    return object; 
  });

  // We associate these datas to a class property for knockoutjs
  this.galleryDatabaseDatas = ko.observableArray(galleryDatabaseDatas);
  // this.galleryDatabaseDatas.subscribe(function (newValue) { alert(JSON.stringify(newValue )); });

  this.sliderImage = ko.observable(_.filter(galleryDatabaseDatas, function(item){
                          return projectSliderImageId.indexOf(String(item.id)) > -1; })[0]);

  // force focus on popin display 
  $('#gallerySliderModal').on('shown.bs.modal', function (e) {
    $("#gallerySliderSearchInput").focus();
  })

  
  this.searchTyped   = ko.observable();
  this.classItems    = ko.observable();
  

  this.searchResults = ko.computed(function() {
    if(!this.searchTyped()) {

      return self.galleryDatabaseDatas(); 
    } else {
      return ko.utils.arrayFilter(self.galleryDatabaseDatas(), function(item) {  
        var finalFilter = [];
        var userQuery = String(self.searchTyped().toLowerCase());
        userQuery = userQuery.removeAccents();
        var objectField = '';

        for (var i = 0; i < gallerySearchFields.length; i++) {
          objectField = String(item[gallerySearchFields[i].trim()]);
          objectField = objectField.removeAccents();

          if (searchType === "contains") {
            finalFilter.push(objectField.toLowerCase().indexOf(userQuery) > -1 );
          } else if (searchType === "startsWith") {
            finalFilter.push(objectField.toLowerCase().startsWith(userQuery));
          } else {
            console.log("wow it looks like there is an issue with the param data-search-type");

            return true;
          }
        };
        
        return _.contains(finalFilter, true);
      });
    }
  }, this).extend({ notify: 'always' });
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

  // Update the status of the item in the gallery (change key "inProject")
  this.updateItemInSearch = function(id) {
    var galleryItem = oldItem = _.findWhere(self.galleryDatabaseDatas(), {id: id});
    galleryItem.inProject = !galleryItem.inProject;
  
    self.galleryDatabaseDatas.replace(oldItem, galleryItem);

    self.galleryDatabaseDatas(self.galleryDatabaseDatas());

    // ko.components.clearCachedDefinition(self.galleryDatabaseDatas);
  }

  this.imageSelected = function (e) {
    var idImg = ko.utils.parseJson($(e.currentTarget).attr("data-gallery-item")).id;
    
    self.updateItemInSearch(idImg);

    console.log("sliderImage", self.sliderImage(), self.hiddenInput.val() == self.sliderImage().id)

    /// Current image selected is already set
    if (self.hiddenInput.val() == idImg) {
      self.sliderImage({});
      self.hiddenInput.val(null);
    } else {
      self.sliderImage(ko.utils.parseJson($(e.currentTarget).attr("data-gallery-item")));
      self.hiddenInput.val(self.sliderImage().id);
    }    
  }

  this.removeProjectImage = function (e) {
    var idImg = ko.utils.parseJson($(e.currentTarget).attr("data-gallery-item")).id;

    self.updateItemInSearch(idImg);
    
    if (_.findIndex(self.sliderImage(), {id: idImg}) > -1) {
        // Entry exists in the array so we remove it
      self.sliderImage.remove(function (item) { item.isInProject = false; return Number(item.id) === Number(idImg); });
    } else {
      // Technically none should entry in this case
      console.error('how did you make this ?');
    }
    self.hiddenInput.val(_.pluck(self.sliderImage(), 'id').join(','));
  }

  this.endReorder = function(evt) {
    self.sliderImage().move(evt.oldIndex, evt.newIndex);
    self.hiddenInput.val(_.pluck(self.sliderImage(), 'id').join(','));
  }

  this.bindEvents = function() {
    $('[data-modal-slider-image]').on('click', '.gallery-library__item button', this.imageSelected);
    $('.list-images-selected').on('click', '.list-images-selected__item button', this.removeProjectImage);
  };
  this.bindEvents();
}

module.exports = GalleryModal;