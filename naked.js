// Global Object Definitions ;^)
CGD.god = window;

// appliction function
(function() {

var god = CGD.god;

// load the most usefull library routines into our namespace
eval(CGD.JS.explode('CGD'));
eval(CGD.JS.explode('CGD.JS'));
eval(CGD.JS.explode('CGD.ARRAY'));

function D(str) {
  DEBUG.p(str);
};

$(document).ready(function() {
  DEBUG.onload();
  DEBUG.on();
//  D('test');
  test();
});

function test() {
  browse(CGD, 'CGD');
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

function browse(x, name) {
  var it = browseContents(x).
    appendTo('#naked').
    wrap('<div class="browser"></div>');
  var dim = {
    width: it.width() + 40,
    height: it.height() + 60
  };
  it.
    attr({'class': "flora", title: name}).dialog(dim);
}

function browseContents(x) {
  switch(typeof(x)) {
    case 'function':
      return $(HTML.from({p: {code: x.toString()}}));
    case 'object':
      return browseCompound(x);
    default:
      return $(HTML.from({p: x.toString()}));
  }
}

function browseCompound(x) {
  var browser = $(HTML.from({table: {tr: {th: ['Name', 'Type', 'Value']}}}));
  var jq;
  
  function item(i) {
    jq = inspector(x[i], i);
    jq.addClass(x.hasOwnProperty(i) ? 'own' : 'prototype');
    jq.appendTo(browser);
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

function inspector(x, name) {
  var values = [name].concat(repr(x));
  var html = HTML.from({tr: {td: values}});
  var jq = $(html);
  if (browsable(x)) {
    var last = jq.find('td:last');
    last.click(function() {browse(x, name);}).addClass('link');
  }
  return jq;
}

//end CGD.naked
}());
