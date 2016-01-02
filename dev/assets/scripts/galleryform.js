var $ = jQuery = require('jquery');



var GalleryForm = function GalleryForm() {
  var self = this;

  this.imageSelected = function (e) {
    var fakeInputLabelClass = $(e.currentTarget).attr('data-input-file');
    $(e.currentTarget).parent().find('.'+fakeInputLabelClass).text($(e.currentTarget).val());
  }

  this.bindEvents = function() {
      $('[data-input-file]').on('change', this.imageSelected);
  };
  this.bindEvents();
}

new GalleryForm();