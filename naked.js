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
  browse(CGD, 'CGD');
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

function browse(x, name) {
  browseContents(x).
    appendTo('#naked').
    wrap('<div class="browser"></div>').
    toDialog({title: name});
}

function browseContents(x) {
  switch(typeof(x)) {
    case 'function':
      return $(HTML.from({div: {p: {code: x.toString()}}})).
        append(browseCompound(x));
    case 'object':
      return browseCompound(x);
    case 'string':
      return $(HTML.from({form: {textarea: x}}));
    default:
      return $(HTML.from({p: x.toString()}));
  }
}

function browseCompound(x) {
  var browser = $(HTML.from({table: {tr: {th: ['Name', 'Type', 'Value']}}}));
  
  function item(i) {
    try {
      propertyInspector(x, i).appendTo(browser);
    } catch (e) {
      D(e);
      //DEBUG.dump(e);
      //D([x, i]);
    }
  }
  for (var index in x) {
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

function action(x, name) {
  switch(typeof(x)) {
    case 'string':
      return function() {browse(x, name);};
    default:
      if (browsable(x)) {
        return function() {browse(x, name);};
      }
      break;
  }
}

function propertyInspector(container, name) {
  try {
    return inspector(container[name], name).
      addClass(container.hasOwnProperty(name) ? 'own' : 'prototype');
  } catch (e) {
    //DEBUG.dump(e);
    return $(HTML.from({tr: {td: [name, 'error', e.name]}})).addClass('error');
  }
}

function inspector(x, name) {
  var values = [name].concat(repr(x));
  var html = HTML.from({tr: {td: values}});
  var jq = $(html);
  var act = action(x, name);
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
