window.addEventListener("DOMContentLoaded", function() {
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
  var REL_BASE_URL = base_url;
  var ABS_BASE_URL = normalizePath(window.location.pathname + "/" +
                                   REL_BASE_URL);
  var CURRENT_VERSION = ABS_BASE_URL.split("/v/")[1] || 'latest';

  function makeSelect(options, selected) {
    var select = document.createElement("select");

    options.forEach(function(i) {
      var option = new Option(i.text, i.value, undefined,
                              i.value === selected);
      select.add(option);
    });

    return select;
  }

  var xhr = new XMLHttpRequest();
  // xhr.open("GET", REL_BASE_URL + "/../versions.json");
  xhr.open("GET", "/versions.json");
  xhr.onload = function() {
    var versions = JSON.parse(this.responseText);



    var currentVersion = versions.find(function(i) {
      return i.version === CURRENT_VERSION ||
             i.aliases.includes(CURRENT_VERSION) ||
             (CURRENT_VERSION === 'latest' && i.latest);
    });

    var select = makeSelect(versions.map(function(i) {
      return {text: i.title + (i.latest ? ' (latest)' : ''), value: i.version};
    }), currentVersion.version);
    select.id = "version-selector";
    select.addEventListener("change", function(event) {
      var match = window.location.href.match(/\/v\/[0-9]*\.[0-9]*\.[0-9]*\//);
      if (match) {
        // path has version number in it
        window.location.href = window.location.href.replace(/\/v\/[0-9]*\.[0-9]*\.[0-9]*\//,  '/v/' + this.value + '/');
      } else {
        // path does not have version in it
        window.location.href = window.location.href.replace(window.location.origin, window.location.origin + '/v/' + this.value);
      }
      // window.location.href = REL_BASE_URL + "/../" + this.value;
    });

    var div = document.createElement('div');
    div.className = 'version-selected-heading';
    div.append('v' + currentVersion.title + (currentVersion.latest ? ' (latest)' : ''));
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
});
