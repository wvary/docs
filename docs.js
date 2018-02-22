#!/usr/bin/env node

var fs = require('fs');
var execSync = require('child_process').execSync;
var _ = require('lodash');
var semverCompare = require('semver-compare');
var yargs = require('yargs');

var statement;
var argv = yargs
  .usage('Usage: $0 <command> [options]')
  .example('$0 deploy --docs-folder --www-folder --docs-version', 'Builds the mkdocs project and copy the site folder to the www/v directory using the version specified.')
  .example('$0 delete --www-folder --docs-version', 'Removes a version from teh www folder "v" folder and the versions.json file.')
  .example('$0 link --www-folder --docs-version --orig-version', 'Creates a symbolic link in the "v" folder and add a new version to the versions.json file.')
  .demand(1)
  .command('deploy', 'Builds and deploys the mkdocs project')
  .command('delete', 'Removes a version from the www-folder')
  .command('link', 'Links one version to another by creating a symbolic link in the v folder')
  .option('docs-folder', {
    describe: 'Root folder of the mkdocs project.',
  })  
  .option('www-folder', {
    describe: 'Folder where the mkdocs built site folder is copied to.',
  })  
  .option('docs-version', {
    describe: 'The version to tag the build as.',
    type: 'string'
  })
  .count('v')
  .alias('v', 'verbose')
  .help('h')
  .alias('h', 'help')
  .argv;


function log() {
  if (argv.v) {
    console.log('>>> ' + arguments[0], arguments[1]);
  }
}


/*
 *  Copy custom folder to docs folder
 */
function addCustomFolder() {
  var statement = 'cp -r custom ' + argv.docsFolder + '/docs/custom';
  log('copy custom folder statement:', statement);
  execSync(statement);
}

/*
 * Inject custom-loader.js to mkdocs.yml if necessary
 */
function injectCustomLoader() {
  // set file name
  var file = argv.docsFolder + '/mkdocs.yml';
  log('adding custom-loader.js to mkdocs file:', file);

  // read file mkdocs.yml
  var mkdocsContent = fs.readFileSync(file, 'utf-8');

  // inject custom/custom-loader.js if necessary
  var ary = mkdocsContent.split('extra_javascript: ');
  if (ary.length === 1) {
    // there's no extra_javascript in the file, append it
    log('mkdodcs.yml does not have an "extra_javascript" line');
    mkdocsContent += '\nextra_javascript: [\'custom/custom-loader.js\']';
  } else {
    // mkdocs contains the extra_javascript property, see if we need to insert custom-loader.js
    log('found "extra_javascript" line in mkdocs.yml');
    var subary = ary[1].split('\n');
    var extraJavascript = JSON.parse(subary[0].replace(/\'/g, '"'));
    if (extraJavascript.indexOf('custom/custom-loader.js') === -1) {
      log('adding custom/custom-loader.js to extra_javascript');
      extraJavascript.push('custom/custom-loader.js');
      subary[0] = JSON.stringify(extraJavascript);
    }
    ary[1] = subary.join('\n');
    mkdocsContent = ary.join('extra_javascript: ');
  }

  fs.writeFileSync(file, mkdocsContent);
}

/*
 * Run the mkdcos build command
 */
function runBuildCommand() {
  // run the mkdocs build command
  log('Executing mkdocs build', 'cwd: ' + argv.docsFolder);
  execSync('mkdocs build', { cwd: argv.docsFolder });
}

/*
 * Remove version folder from v directory
 */
function removeVersionFolder() {
  var statement = 'rm -rf ' + argv.wwwFolder + '/v/' + argv.docsVersion;
  log('Removing existing version folder:', statement);
  execSync(statement);
}

/*
 * Move site folder to www folder
 */
function moveSiteFolder() {
  var statement = 'mv ' + argv.docsFolder + '/site ' + argv.wwwFolder + '/v/' + argv.docsVersion;
  log('Moving site folder, statement: ', statement);
  execSync(statement);
}

/*
 * Update versions.json in www folder
 */
function updateVersionsJson(mode) {
  var file = argv.wwwFolder + '/versions.json';
  log('Updating version file:', file);
  var content = fs.readFileSync(file, 'utf-8');
  var json = JSON.parse(content);
  var idx = _.findIndex(json, function(row) {
    return (row.version === argv.docsVersion);
  });
  log('idx is', idx);
  if (mode === 'add' && idx === -1) {
    // version not in array, and we want to add it
    var row = {
      aliases: [],
      version: argv.docsVersion,
      title: argv.docsVersion      
    };
    log('adding version row:', row);
    json.push(row);
  } else if (mode === 'delete' && idx > -1) {
    // version is in array and we want to remove it
    log('removing row', idx);
    json.splice(idx, 1);
  }

  // sort list for descending order
  json.sort(function(rowA, rowB) {
    return -semverCompare(rowA.version, rowB.version);
  });

  // only first item in first should be latest version
  _.each(json, function(row, k) {
    row.latest = (k === 0);
  });

  fs.writeFileSync(file, JSON.stringify(json));
}

/*
 * deploy a version
 */
function deploy() {
  addCustomFolder();
  injectCustomLoader();
  runBuildCommand();
  removeVersionFolder();
  moveSiteFolder();
  updateVersionsJson('add');
}

/*
 * remove a version

 */
function delele() {
  removeVersionFolder();
  updateVersionsJson('delete');
}

/*
 * creates a symbolic link from one version to another
 */
function link() {
  createLink();
  updateVersionsJson('link');
}

log('command:', argv._[0]);
log('docs-folder:', argv.docsFolder);
log('www-folder:', argv.wwwFolder);
log('docs-version:', argv.docsVersion);

switch(argv._[0]) {
  case 'deploy':
    deploy();
    break;
  case 'delete':
    delele();
    break;
  case 'link':
    link();
    break;
}
