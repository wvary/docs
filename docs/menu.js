$(function highlightNav() {

  function resetNavEl(navEl) {
    $(navEl).attr('style', '');
  }

  function highlightNavEl(navEl) {
    $(navEl).attr('style',
      'color: #404040;' +
      'font-weight: bold;' +
      'background-color: #d6d6d6;'
    );
  }

  try {
    var headers = [];
    $('h1[id], h2[id], h3[id], h4[id]').each(function(i, value) {
      var navEl = $('li.current a[href="#' + $(value).attr('id') + '"]');
      if (navEl.length) {
        headers.push({
          el: value,
          navEl: navEl[0]
        });
      }
    });

    var previouslyHighlightedHeader;
    $(document).scroll(function() {
      var top = $(document).scrollTop();

      headers.forEach(function(header) {
        var distance = top - $(header.el).offset().top;

        if (distance < 60 && distance > -60) {
          if (previouslyHighlightedHeader) {
            resetNavEl(previouslyHighlightedHeader.navEl);
          }
          highlightNavEl(header.navEl);
          previouslyHighlightedHeader = header;
        }
      });

    });
  } catch(e) {
    console.log('Error: ', e);
  }

});

/*
 *  This script should run on every page load to vertically center the currently selected left nav menu.
 */
$(function centerNav() {

  try {
    var current = $('ul.subnav li.current');
    if (current.length > 0) {
      var nav = $('nav.wy-nav-side');
      var y = current.height() / 2 + current.position().top - nav.height() / 2;
      if (y > 0) {
        nav.scrollTop(y);
      }
    }
  } catch(e) {
    console.log('Error: ', e);
  }

});