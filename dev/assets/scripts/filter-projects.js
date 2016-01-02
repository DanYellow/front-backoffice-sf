var $ = jQuery = require('jquery');

var FilterProjects = function FilterProjects () {
    var self = this;
    var timeoutOpacity;

    this.filter = function (e) {
      clearTimeout(timeoutOpacity);
      var filterName = $(e.currentTarget).attr('data-filter-name');
      if (String(filterName.toLowerCase()) === "all") {
        $('.list-gallery__elmt').css({'opacity' : 1});
        return;
      };

      if (e.type === "mouseout") {
        timeoutOpacity = setTimeout(function() {
           $('.list-gallery__elmt').css({'opacity' : 1});
        }, 250);
       
        return;
      };

      $('.list-gallery__elmt').css({'opacity' : .5});
      $('.list-gallery__elmt.' + filterName).css({'opacity' : 1});
    }

    
    this.bindEvents = function () {
        $('[data-filter-name]').on('mouseover', this.filter);
        $('[data-filter-name]').on('mouseout', this.filter);
    }

    this.bindEvents();

    
}

new FilterProjects();