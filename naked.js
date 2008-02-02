// Global Object Definitions ;^)
CGD.god = window;

// appliction function
(function() {

var god = CGD.god;

var DEBUG = CGD.DEBUG;
function D(str) {
  DEBUG.p(str);
};

DEBUG.off();

CGD.JS.corrupt();
var mix = CGD.JS.mix;
var mixSafe = CGD.JS.mixSafe;

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
      $(CGD.HTML.from({p: {code: x.toString()}})).appendTo('#naked');
      break;
    case 'object':
      browseCompound(x);
      break;
    default:
      $(CGD.HTML.from({p: x.toString()})).appendTo('#naked');
  }
}

function browseCompound(x) {
  var browser = $(CGD.HTML.from({table: {tr: ['Name', 'Type', 'Value']}}, 'th'));
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
  var html = CGD.HTML.from({tr: values}, 'td');
  var jq = $(html);
  if (browsable(x)) {
    var last = jq.find('td:last');
    last.click(function() {browse(x);}).addClass('link');
  }
  return jq;
}

//end CGD.naked
}());
