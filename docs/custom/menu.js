/*
 *  Vertically center the currently selected left nav menu.
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

/*
 * Highlights the active section in the sidenav as user scrolls through document.
 */
$(function startHeaderScrollspy() {

  function unsetActive(navEl) {
    $(navEl).attr('style', '');
  }
  function setActive(navEl) {
    $(navEl).attr('style',
      'color: #404040;' +
      'font-weight: bold;' +
      'background-color: #d6d6d6;'
    );
  }

  try {
    var headers = [];
    var ACCEPTABLE_OFFSET = 50; // pixels

    // find all headers in the document with an assigned navlink
    $('h1[id], h2[id], h3[id], h4[id]').each(function(i, value) {
      var navEl = $('li.current a[href="#' + $(value).attr('id') + '"]');
      if (navEl.length) {
        headers.push({
          el: value,
          navEl: navEl[0]
        });
      }
    });

    var prevActiveHeader;
    $(document).scroll(function() {
      var scrollTop = $(document).scrollTop();

      headers.forEach(function(header, index) {
        // get the top position of header, allow an ACCEPTABLE_OFFSET of space to
        // scroll above header before it transitions to a higher up section
        header.top = $(header.el).offset().top - ACCEPTABLE_OFFSET;

        // get the bottom of the header section, we then have the position range of each header section
        if (index !== headers.length - 1) {
          // if this is not the last array element, use next header as a stopping point for this section
          header.bottom = $(headers[index + 1].el).offset().top;
        } else {
          // last element, assign stopping point to bottom to bottom of page
          header.bottom = $(document).outerHeight(true);
        }

        if (scrollTop > header.top && scrollTop < header.bottom) {
          // scrollTop within range of this header, set its navEl to active
          if (prevActiveHeader) {
            unsetActive(prevActiveHeader.navEl);
          }
          setActive(header.navEl);
          prevActiveHeader = header;
        } else if (scrollTop < headers[0].top) {
          // scrolled to the very top, remove active class from children
          if (prevActiveHeader) {
            unsetActive(prevActiveHeader.navEl);
          }
        }
      });
    });
  } catch(e) {
    console.log('Error: ', e);
  }

});