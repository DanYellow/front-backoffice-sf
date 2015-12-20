var $ = jQuery = require('jquery');

var FilterProjects = function FilterProjects () {
    var self = this;

    this.filter = function (e) {
      var filterName = $(e.currentTarget).attr('data-filter-name');
      if (String(filterName.toLowerCase()) === "all") {
        console.log('trre')
        $('.list-gallery__elmt').css({'opacity' : 1});
        return;
      };

      $('.list-gallery__elmt').css({'opacity' : .5});
      $('.list-gallery__elmt.' + filterName).css({'opacity' : 1});
      console.log($('.list-gallery__elmt.' + filterName), $(e.currentTarget));
    }

    
    this.bindEvents = function () {
        $('[data-filter-name]').on('mouseover', this.filter);
    }

    this.bindEvents();

    
}

new FilterProjects();