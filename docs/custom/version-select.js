function initializeVersionSelection() {
  function normalizePath(path) {
    var normalized = [];
    path.split("/").forEach(function(bit, i) {
      if (bit === "." || (bit === "" && i !== 0)) {
        return;
      } else if (bit === "..") {
        if (normalized.length === 1 && normalized[0] === "") {
          // We must be trying to .. past the root!
          throw new Error("invalid path");
        } else if (normalized.length === 0 ||
                   normalized[normalized.length - 1] === "..") {
          normalized.push("..");
        } else {
          normalized.pop();
        }
      } else {
        normalized.push(bit);
      }
    });
    return normalized.join("/");
  }

  // `base_url` comes from the base.html template for this theme.
  var REL_BASE_URL = (typeof base_url === 'undefined' ? '.' : base_url);
  var ABS_BASE_URL = normalizePath(window.location.pathname + "/" +
                                   REL_BASE_URL);
  var CURRENT_VERSION = (ABS_BASE_URL.match(/^(\/v\/)([A-Za-z0-9\.\-_]+)(\/)/i) || [])[2] || '';

  function makeSelect(options, selected) {
    var select = document.createElement("select");

    options.forEach(function(i) {
      var option = new Option(i.text, i.value, undefined,
                              i.value === selected);
      select.add(option);
    });

    return select;
  }

  var checkIfPageExistsInSelectedVersion = function(href2, versionSelect, event) {
    var xhttp= new XMLHttpRequest();  
    xhttp.open("GET", href2, true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 404) {
        window.location.href = window.location.origin +  '/v/' + versionSelect.value + '/'; //home page
      }
      else if (this.readyState == 4 && this.status == 200) {
        window.location.href = href2;
      }
    };  
  }


  var xhr = new XMLHttpRequest();
  // xhr.open("GET", REL_BASE_URL + "/../versions.json");
  xhr.open('GET', '/versions.json?t=' + Date.now());
  xhr.onload = function() {
    var versions = JSON.parse(this.responseText || '[]');

    if (versions.length) {
      versions.unshift({
        aliases: versions[0].aliases,
        title: 'latest (' + versions[0].title + ')',
        version: ''
      });
    }

    var currentVersion = versions.find(function(i) {
      return i.version === CURRENT_VERSION ||
             i.aliases.includes(CURRENT_VERSION);
    });
    var select = makeSelect(versions.map(function(i) {
      return {text: i.title, value: i.version};
    }), currentVersion.version);
    select.id = "version-selector";

    select.addEventListener("change", function(event) {
      var selectedVersion = this.value === '' ? '' : '/v/' + this.value;
      var match = window.location.href.match(/\/v\/[0-9]*\.[0-9]*\.[0-9]*\//);
      var href2;
      if (match) {
        // path has version number in it
        href2 = window.location.href.replace(/\/v\/[0-9]*\.[0-9]*\.[0-9]*\//,  selectedVersion + '/');
      } else {
        // path does not have version in it
        href2 = window.location.href.replace(window.location.origin, window.location.origin + selectedVersion);
      }
      checkIfPageExistsInSelectedVersion(href2, this, event);
      // window.location.href = REL_BASE_URL + "/../" + this.value;
    });

    var div = document.createElement('div');
    div.className = 'version-selected-heading';
    div.append((currentVersion.title.indexOf('latest') === -1 ? 'v' : '') + currentVersion.title);
    var title = document.querySelector("div.wy-side-nav-search");
    title.insertBefore(div, title.querySelector(".icon-home").nextSibling);


    // place select in div
    div = document.createElement('div');
    div.className = 'version-select';
    div.append('Version:');
    div.append(select);

    var versionSection = document.querySelector("div.rst-versions");
    versionSection.prepend(div);
  };
  xhr.send();
}

initializeVersionSelection();
