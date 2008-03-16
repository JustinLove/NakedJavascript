// Global Object Definitions ;^)
CGD.god = window;

// appliction function
(function() {

var god = CGD.god;

// load the most usefull library routines into our namespace
eval(CGD.JS.explode('CGD'));
eval(CGD.JS.explode('CGD.JS'));
eval(CGD.JS.explode('CGD.OBJECT'));
eval(CGD.JS.explode('CGD.ARRAY'));

function D(str) {
  DEBUG.p(str);
};

$(document).ready(function() {
  extendJQ();
  $('#debugDiv').toDialog({position: 'bottom', title: 'Debug'});
  DEBUG.onload();
  DEBUG.on();
  D('test');
  test();
});

function test() {
  browse(CGD, 'CGD', god);
}

function extendJQ() {
  $.fn.extend({
      toDialog: function(options) {
        options = options || {};
        options.width = options.width || this.width() + 50;
        options.height = options.height || this.height() + 80;
        this.attr({'class': "flora"}).dialog(options).
          parents('.ui-dialog').hide().show('slow');
      }
    });
}

function browser(name, container) {
  var b = object(masterBrowser);
  b.name = name;
  b.container = container;
}

var masterBrowser = {
  name: "",
  container: null,
  last: null
};

function browse(value, name) {
  var it = browseContents(value, name);
  it.find("td:contains('error')").parent().addClass('error').end().end();
  it.appendTo('#naked').
    wrap('<div class="browser"></div>').
    toDialog({title: name});
}

function browseContents(value, name) {
  switch(typeof(value)) {
    case 'function':
      return $(HTML.from({div: {p: {code: value.toString()}}})).
        append(browseCompound(value, name));
    case 'object':
      return browseCompound(value, name);
    case 'string':
      return $(HTML.from({form: {textarea: value}}));
    default:
      return $(HTML.from({p: value.toString()}));
  }
}

function browseCompound(value, name) {
  var browser = $(HTML.from({table: {tr: {th: ['Name', 'Type', 'Value']}}}));
  
  function item(i) {
    try {
      propertyInspector(value, i).appendTo(browser);
    } catch (e) {
      D(e);
      //DEBUG.dump(e);
      //D([value, i]);
    }
  }
  for (var index in value) {
    item(index);
  }
  return browser;
}

function repr(x) {
  var t = typeof(x);
  switch(t) {
    case 'function':
      return [t, '*'];
    case 'undefined':
      return [t, 'undefined'];
    default:
      return [t, x + ""];
  }
}

function action(value, name, container) {
  switch(typeof(value)) {
    case 'string':
      return function() {browse(value, name);};
    default:
      if (browsable(value)) {
        return function() {browse(value, name);};
      }
      break;
  }
}

// the differnent paramters are necessary so we do the object referenece
//   inside the try block.
function propertyInspector(container, name) {
  try {
    return inspector(container[name], name, container).
      addClass(container.hasOwnProperty(name) ? 'own' : 'prototype');
  } catch (e) {
    //DEBUG.dump(e);
    return $(HTML.from({tr: {td: [name, 'error', e.name]}}));
  }
}

function inspector(value, name, container) {
  var values = [name].concat(repr(value));
  var html = HTML.from({tr: {td: values}});
  var jq = $(html);
  var act = action(value, name, container);
  if (act) {
    var last = jq.find('td:last');
    last.click(act).addClass('link');
  }
  return jq;
}

function browsable(x) {
  switch (x) {
    case null:
    case undefined:
      return false;
    default:
      return typeof(x) in {'function': true, 'object': true};
  }
}

//end CGD.naked
}());
