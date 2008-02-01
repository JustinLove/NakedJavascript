var CGD = window.CGD || {};

// Global Object Definitions ;^)
CGD.god = window;

CGD.DEBUG = function() {
  // Send a simple alert to Console when in Dashboard.
  function p_widget(str) {
    alert(str);
  }

  function p_alert(str) {
    alert(str);
  }

  var style = 'none';
  function setDiv(s) {
    if (style != s) {
      document.getElementById('debugDiv').style.display = s;
      style = s;
    }
  }

  // Write to the debug div when in Safari.
  function p_div(str) {
    setDiv('block');
    var debugDiv = document.getElementById('debugDiv');
    debugDiv.appendChild(document.createTextNode(str));
    debugDiv.appendChild(document.createElement("br"));
    debugDiv.scrollTop = debugDiv.scrollHeight;
  }

  function p_off(str) {};

  var p_on = p_alert;

  function on() {
    this.p = p_on;
  }

  function off() {
    this.p = p_off;
    setDiv('none');
  }

  function onload() {
    if (window.widget) {
      p_on = p_widget;
    } else {
      p_on = p_div;
    }
    if (this.p != p_off) {
      this.on();
    }
  }

  function die(str) {
    if (Error) {
      throw Error(str);
    } else {
      throw str;
    }
  }

  function dump(x) {
    this.p(x);
    for (var i in x) {
      if (typeof(x[i]) == 'function') {
        this.p([i, '*', 'function', x.hasOwnProperty(i)]);
      } else {
        this.p([i, x[i], typeof(x[i]), x.hasOwnProperty(i)]);
      }
    }
  };

  return {p: p_off, die: die, on: on, off: off, onload: onload, dump: dump};
} ();

CGD.JS = CGD.JS || {};
(function() {
  function publish(s) {
    CGD.JS[s] = eval(s);
  }

  function object(o) {
    function F() {};
    F.prototype = (o || {});
    return new F();
  }
  publish('object');

  function mix (into, what) {
    for (var p in what) {
      if (what.hasOwnProperty(p)) {
        into[p] = what[p];
      }
    }
  };
  publish('mix');

  function mixSafe(into, what) {
    for (var p in what) {
      if (what.hasOwnProperty(p) && !into[p]) {
        into[p] = what[p];
      }
    }
  }
  publish('mixSafe');

  var notFound = {
    name: 'Not Found',
    message: '--',
    toString: function() {
      return this.name + ": " + this.message;
    }
  };

  function NotFound(message) {
    my = object(notFound);
    my.message = message || my.message;
    return my;
  }
  publish('NotFound');

  var Enumerable = {
    each_index: function(f) {
      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          f(i);
        }
      }
    },
    each: function(f) {
      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          f(this[i]);
        }
      }
    },
    find: function(f) {
      for (var i in this) {
        if (this.hasOwnProperty(i)) {
          if (f(this[i])) {
            return i;
          }
        }
      }
      throw NotFound("Enumerable.find");
    },
    indexOf: function (x) {
      return this.find(function (y) {
        return y === x;
      });
    }
  };
  publish('Enumerable');
  mixSafe(Array.prototype, Enumerable);

  function each_with_index(what, f) {
    for (var i in what) {
      if (what.hasOwnProperty(i)) {
        f(i, what[i]);
      }
    }
  }
  publish('each_with_index');

  function findByName(what, name) {
    try {
      return what.find(function (x) {
        return x.hasOwnProperty('name') && x.name == name;
      });
    } catch (e) {
      if (e.name == 'Not Found') {
        e.message = name;
      }
      throw e;
    }
  }
  publish('findByName');

  var StringOps = {
    toCapital: function () {
      return this.charAt(0).toUpperCase() + this.substr(1).toLowerCase();
    }
  };
  publish('StringOps');

  // Image doesn't have a prototype; 
  var LoadProgress = {
    onload: function () {this.loaded = true;}
  };
  publish('LoadProgress');

  var RADIANS = Math.PI * 2;
  publish('RADIANS');
  
  function corrupt() {
    CGD.god.object = CGD.god.object || object;
    mixSafe(Array.prototype, Enumerable);
    mixSafe(String.prototype, StringOps);
    Math.RADIANS = Math.PI * 2;
  }
  publish('corrupt');
}());

CGD.HTML = CGD.HTML || {};
CGD.HTML.from = function (structure, arrayElements) {
  arrayElements = arrayElements || "p";
  var text = "";
  switch(typeof(structure)) {
    case 'object':
      if (structure.constructor && structure.constructor === Array) {
        for (var i in structure) {
          if (structure.hasOwnProperty(i)) {
            text += "<" + arrayElements + ">" + CGD.HTML.from(structure[i], arrayElements) + "</" + arrayElements + ">";
          }
        }
      } else {
        for (var i in structure) {
          if (structure.hasOwnProperty(i)) {
            text += "<" + i + ">" + CGD.HTML.from(structure[i], arrayElements) + "</" + i + ">";
          }
        }
      }
      return text;
    case 'number':
      return structure.toFixed(2);
    default:
      return structure.toString();
  }
};

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
    // god(window) crashes if when trying to HOP native properties, at least in firefox
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
