var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');

// @class DeleteGalleryItemManager
// @desc : Manage delete of element in gallery (images or project)
var DeleteGalleryItemManager = function DeleteGalleryItemManager () {
    var self = this;
    
    this.displayElementWillDelete = function (e) {
      var $caller = $(e.relatedTarget);
      var $modal = $(this);

      $modal.modal('hide');
      var srcElementToDelete = $caller.attr('data-img-to-delete-src');
      $('.imgToDelete').attr('src', srcElementToDelete);
      
      $('[data-title]').text($caller.attr('data-title-modal'));

      $('[data-delete-link]').attr('href', 
        $('[data-delete-link]').attr('href').replace("__id__", $caller.attr("data-id"))
        );

      var nbImageOcurrences = $caller.attr('data-occurences-image');
      
      if (nbImageOcurrences) {
        var text = $('[data-text-image-occurences]').attr('data-default-text').replace("__nb__", Number(nbImageOcurrences));
        $('[data-text-image-occurences]').text(text);
      };
      
    }

    this.modalHidden = function (e) {
      $('[data-text-image-occurence]').text($('[data-text-image-occurence]').attr('data-default-text'));
    }
    
    this.bindEvents = function () {
      $('#removeItemGalleryModal').on('show.bs.modal', this.displayElementWillDelete);
      $('#removeItemGalleryModal').on('hidden.bs.modal', this.modalHidden);
    }

    this.bindEvents();   
}

new DeleteGalleryItemManager();