/*
 *  This script should run on every page load to vertically center the currently selected left nav menu.
 */
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
  console.log('Error', e)
}
