/*************************************************************************
         (C) Copyright AudioLabs 2017

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law.

**************************************************************************/

function checkOrientation() {//when changing from potrait to landscape change to the rigth width

  var siteWidth = document.body.scrollWidth;
  $("#header").css("width", siteWidth.toString());

}

window.onresize = function(event) {
  if (pageManager.getCurrentPage() && pageManager.getCurrentPage().isMushra == true) {
    pageManager.getCurrentPage().renderCanvas("mushra_items");
  }

  checkOrientation();
};


// callbacks
function callbackFilesLoaded() {
  pageManager.start();
  pageTemplateRenderer.renderProgressBar(("page_progressbar"));
  pageTemplateRenderer.renderHeader(("page_header"));
  pageTemplateRenderer.renderNavigation(("page_navigation"));

  if (config.stopOnErrors == false || !errorHandler.errorOccurred()) {
    $.mobile.loading("hide");
    $("body").children().children().removeClass('ui-disabled');
  } else {
    var errors = errorHandler.getErrors();
    var ul = $("<ul style='text-align:left;'></ul>");
    $('#popupErrorsContent').append(ul);
    for (var i = 0; i < errors.length; ++i) {
      ul.append($('<li>' + errors[i] + '</li>'));
    }
    $("#popupErrors").popup("open");
    $.mobile.loading("hide");
  }

  if ($.mobile.activePage) {
    $.mobile.activePage.trigger('create');
  }
}

function callbackURLFound() {
  var errors = errorHandler.getErrors();
  var ul = $("<ul style='text-align:left;'></ul>");
  $('#popupErrorsContent').append(ul);
  for (var i = 0; i < errors.length; ++i) {
    ul.append($('<li>' + errors[i] + '</li>'));
  }
  $("#popupErrors").popup("open");
}

function melange(tableau) {
  for (let i = 0; i < tableau.length; i += 2) {
    const j = Math.floor(Math.random() * (tableau.length / 2)) * 2;
    const temp1 = tableau[i];
    const temp2 = tableau[i+1];
    tableau[i] = tableau[j];
    tableau[i+1] = tableau[j+1];
    tableau[j] = temp1;
    tableau[j+1] = temp2;
  }
  return tableau;
}

function addPagesToPageManager(_pageManager, _pages) {
  var j = 1
  for (var i = 0; i < _pages.length; ++i) {
    if (Array.isArray(_pages[i])) {
      if (_pages[i][0] === "random") {
        _pages[i].shift()
        melange(_pages[i]);
      }
      addPagesToPageManager(_pageManager, _pages[i]);
    } else {
      var pageConfig = _pages[i];
      if (pageConfig.type == "generic") {
        _pageManager.addPage(new GenericPage(_pageManager, pageConfig));
      } else if (pageConfig.type == "test_page") {
        var videoPage = new VideoPage(_pageManager, pageTemplateRenderer, session, config, pageConfig, errorHandler, config.language, j, _pages.length, true);
        _pageManager.addPage(videoPage);
      } else if (pageConfig.type == "video_believable") {
        var videoPage = new VideoPage(_pageManager, pageTemplateRenderer, session, config, pageConfig, errorHandler, config.language, j, _pages.length, false);
        _pageManager.addPage(videoPage);
      } else if (pageConfig.type == "video_synchronized") {
        var videoPage = new VideoPage(_pageManager, pageTemplateRenderer, session, config, pageConfig, errorHandler, config.language, j, _pages.length, true);
        _pageManager.addPage(videoPage);
      } else if (pageConfig.type == "finish") {
        var finishPage = new FinishPage(_pageManager, session, dataSender, pageConfig, config.language);
        _pageManager.addPage(finishPage);
      } else {

        errorHandler.sendError("Type not specified.");

      }
    }
    j = j + 1
  }
}

for (var i = 0; i < $("body").children().length; i++) {
  if ($("body").children().eq(i).attr('id') != "popupErrors" && $("body").children().eq(i).attr('id') != "popupDialog") {
    $("body").children().eq(i).addClass('ui-disabled');
  }
}




function startup(config) {

  if (config == null) {
    errorHandler.sendError("URL couldn't be found!");
    callbackURLFound();
  }

  $.mobile.page.prototype.options.theme = 'a';
  var interval = setInterval(function() {
    $.mobile.loading("show", {
      text : "Loading...",
      textVisible : true,
      theme : "a",
      html : ""
    });
    clearInterval(interval);
  }, 1);
  
  
  if (pageManager !== null) { // clear everything for new experiment
    pageTemplateRenderer.clear();
    $("#page_content").empty();
    $('#header').empty();
  }

  localizer = new Localizer();
  localizer.initializeNLSFragments(nls);

  pageManager = null;
  audioContext;
  audioFileLoader = null;
  mushraValidator = null;
  dataSender = null;
  session = null;
  pageTemplateRenderer = null;
  interval2 = null;

  document.title = config.testname;
  $('#header').append(document.createTextNode(config.testname));

  pageManager = new PageManager("pageManager", "page_content", localizer);
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  if ( typeof AudioContext !== 'undefined') {
    audioContext = new AudioContext();
  } else if ( typeof webkitAudioContext !== 'undefined') {
    audioContext = new webkitAudioContext();
  }

  document.addEventListener("click", function () {
    if (audioContext.state !== 'running') {
      audioContext.resume();
    }
  }, true);

  try {
    audioContext.destination.channelCountMode = "explicit";
    audioContext.destination.channelInterpretation = "discrete";
    audioContext.destination.channelCount = audioContext.destination.maxChannelCount;
  } catch (e) {
    console.log("webMUSHRA: Could not set channel count of destination node.");
    console.log(e);
  }
  audioContext.volume = 1.0;

  audioFileLoader = new AudioFileLoader(audioContext, errorHandler);
  mushraValidator = new MushraValidator(errorHandler);
  dataSender = new DataSender(config);

  session = new Session();
  session.testId = config.testId;
  session.config = configFile;

  if (config.language == undefined) {
    config.language = 'fr';
  }
  pageTemplateRenderer = new PageTemplateRenderer(pageManager, config.showButtonPreviousPage, config.language);
  pageManager.addCallbackPageEventChanged(pageTemplateRenderer.refresh.bind(pageTemplateRenderer));

  addPagesToPageManager(pageManager, config.pages);

  interval2 = setInterval(function() {
    clearInterval(interval2);
    audioFileLoader.startLoading(callbackFilesLoaded);
  }, 10);

}

// start code (loads config) 
function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

var config = null;
var configArg = getParameterByName("config");
var configFile = '';
if (configArg) {
  configFile = 'configs/' + configArg;
} else {
  configFile = 'configs/default.yaml';
}


// global variables
var errorHandler = new ErrorHandler();
var localizer = null;
var pageManager = null;
var audioContext = null;
var audioFileLoader = null;
var mushraValidator = null;
var dataSender = null;
var session = null;
var pageTemplateRenderer = null;
var interval2 = null;


YAML.load(configFile, (function(result) {
  config = result;
  startup(result);
}));
