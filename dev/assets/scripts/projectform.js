var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');
var ko = require('knockout');
var _ = require('underscore');
var Sortable = require('sortablejs');

require('./utils');

/**
 * ProjectForm
 * @class [description]
 * 
 * @param {[type]} searchDelay [description]
 */
var ProjectForm = function ProjectForm(searchDelay) {
  // Prevent error if there no need of filter
  if ($('[data-modal-project-images]').length == 0) { return };

  var self = this;

  this.searchDelay = searchDelay;

  var galleryDatabaseDatas = $('[data-modal-project-images]').attr("data-gallery-items");
  var galleryBasePath = $('[data-modal-project-images]').attr("data-img-basepath");
  var gallerySearchFields = $('[data-modal-project-images]').attr("data-search-fields").split(',');
  var searchType = $('[data-modal-project-images]').attr("data-search-type");

  var finalFilter = [];
  var hiddenInput = $('[data-hidden-input-id]').attr("data-hidden-input-id")
  self.hiddenInput = $(hiddenInput);

  // Mapping property for sf2 or any backend language
  var galleryImgKey = $('[data-modal-project-images]').attr("data-img-key");

  // There is no images so nothing to show
  if (!galleryDatabaseDatas) { return; };
  // Contains every datas from database 
  galleryDatabaseDatas = ko.utils.parseJson(galleryDatabaseDatas);

  var projectsImagesId = self.hiddenInput.val().split(',');

  // If image are stored in a "weird" base path, we map it
  galleryDatabaseDatas = _.map(galleryDatabaseDatas, function(object){ 
    object[galleryImgKey] = galleryBasePath + object[galleryImgKey];
    object["inProject"] = (projectsImagesId.indexOf(String(object.id)) > -1) ? true : false;
    
    return object; 
  });

  // We associate these datas to a class property for knockoutjs
  this.galleryDatabaseDatas = ko.observableArray(galleryDatabaseDatas);
  // this.galleryDatabaseDatas.subscribe(function (newValue) { alert(JSON.stringify(newValue )); });

  
  this.projectImages = ko.observableArray(_.filter(galleryDatabaseDatas, function(item){
                          return projectsImagesId.indexOf(String(item.id)) > -1; }));

  // Item order in the project
  var orderedDatas = [];
  orderedDatas = _.map(this.projectImages(), function(item) {
    item["order"] = projectsImagesId.indexOf(String(item.id));
    
    return item;
  });

  // force focus on popin display 
  $('#galleryModal').on('shown.bs.modal', function (e) {
    $("#gallerySearchInput").focus();
  })

  // We order the gallery items by by "order". This key is set by the backoffice
  this.projectImages(_.sortBy(orderedDatas, "order"));
  
  this.searchTyped = ko.observable();
  this.classItems = ko.observable();

  
  this.searchResults = ko.computed(function() {

    if(!this.searchTyped()) {
      // console.log(self.galleryDatabaseDatas())
      return self.galleryDatabaseDatas(); 
    } else {
      // console.log('no searchTyped')
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

    self.updateItemInSearch(idImg);
    
    if (_.findIndex(self.projectImages(), {id: idImg}) > -1) {
        // Entry exists in the array so we remove it
      self.projectImages.remove(function (item) { item.isInProject = false; return Number(item.id) === Number(idImg); });
    } else {
      // Technically none should entry in this case
      console.error('how did you make this ?');
    }
    self.hiddenInput.val(_.pluck(self.projectImages(), 'id').join(','));
  }

  this.endReorder = function(evt) {
    self.projectImages().move(evt.oldIndex, evt.newIndex);
    self.hiddenInput.val(_.pluck(self.projectImages(), 'id').join(','));
  }

  this.bindEvents = function() {
      $('[data-modal-project-images]').on('click', '.gallery-library__item button', this.imageSelected);
      $('.list-images-selected').on('click', '.list-images-selected__item button', this.removeProjectImage);

      var el = document.getElementById('images-project');
      var sortable = Sortable.create(el, {
            onEnd: function(evt) {
              self.projectImages().move(evt.oldIndex, evt.newIndex);
              self.hiddenInput.val(_.pluck(self.projectImages(), 'id').join(','));
            }
      });
  };
  this.bindEvents();
}

module.exports = ProjectForm;
