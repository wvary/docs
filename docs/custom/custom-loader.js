// This block is used to load the version-select.js script
// This file is added to the mkdcos.yml file in the extra_javascript file.
// In doing so, the html files will reference it using a relative path.
// It should be OK to leave this file in the js folder and referenced using relative paths.

// It is the version-select.js file that we want to load using the absolute path.
// Since mkdocs does not support absolute path in the extra_javascript setting, we'll load it this way.
window.addEventListener("DOMContentLoaded", function() {
  function loadCss(path) {
    var tag = document.createElement('link');
    tag.rel = 'stylesheet';
    tag.type = 'text/css';
    tag.href = path;
    document.head.appendChild(tag);
  }

  function loadScript(path) {
    var tag = document.createElement('script');
    tag.src = path;
    document.head.appendChild(tag);
  }


  // loading custom menu files
  loadCss('/custom/menu.css');
  loadScript('/custom/menu.js');

  // loading custom version-select files
  loadCss('/custom/version-select.css');
  loadScript('/custom/version-select.js');
});