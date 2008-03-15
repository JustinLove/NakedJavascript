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
  browse(CGD);
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

function browse(x) {
  switch(typeof(x)) {
    case 'function':
      $(HTML.from({p: {code: x.toString()}})).appendTo('#naked');
      break;
    case 'object':
      browseCompound(x);
      break;
    default:
      $(HTML.from({p: x.toString()})).appendTo('#naked');
  }
}

function browseCompound(x) {
  var browser = $(HTML.from({table: {tr: {th: ['Name', 'Type', 'Value']}}}));
  var jq;
  
  function item(i) {
    jq = inspector(i, x[i]);
    // god(window) crashes when trying to hOP native properties, at least in firefox
    jq.addClass(x == god || x.hasOwnProperty(i) ? 'own' : 'prototype');
    jq.appendTo(browser);
  }
  for (var index in x) {
    item(index);
  }
  browser.appendTo('#naked');
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

function inspector(name, x) {
  var values = [name].concat(repr(x));
  var html = HTML.from({tr: {td: values}});
  var jq = $(html);
  if (browsable(x)) {
    var last = jq.find('td:last');
    last.click(function() {browse(x);}).addClass('link');
  }
  return jq;
}

//end CGD.naked
}());
