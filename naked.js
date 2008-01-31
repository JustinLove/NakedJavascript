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
CGD.stopWhining = function() {
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
}();


CGD.new_ticker = CGD.new_ticker || function (call, timeout) {
  // originally used a true interal (set/clearInterval), but they drift
  var my = {
    interval: null,
    configure: function(period) {
      if (isNaN(period) || period < 10) {
        throw new RangeError('Timer');
      }
      timeout = period;
      if (my.interval != null) {
        my.stop();
        my.start();
      }
    },
    restart: function(period) {
      timeout = period;
      my.stop();
      my.start();
    },
    start: function() {
      if (my.interval == null) {
        my.interval = setTimeout(ontimeout, timeout - (new Date().getTime() % timeout));
      }
      //call();
    },
    stop: function () {
      if (my.interval != null) {
        clearTimeout(my.interval);
        my.interval = null;
      }
    },
    running: function () {
      return (my.interval == null);
    },
    toString: function () {
      return '[Ticker ' + call + ' /' + timeout + ']';
    }
  };
  function ontimeout() {
    my.stop();
    call();
    my.start();
  }
  return my;
};

CGD.HTML = CGD.HTML || {};
CGD.HTML.from = function (structure) {
  var text = "";
  switch(typeof(structure)) {
    case 'object':
      for (var i in structure) {
        if (structure.hasOwnProperty(i)) {
          text += "<" + i + ">" + CGD.HTML.from(structure[i]) + "</" + i + ">";
        }
      }
      return text;
    case 'number':
      return structure.toFixed(2);
    default:
      return structure.toString();
  }
};

CGD.HTML.select = CGD.HTML.select || {};
CGD.HTML.select.populate = function(selectId, arrayWithNames, initial)
{
  var select = document.getElementById (selectId);

  // remove all children
  while (select.hasChildNodes()) {
    select.removeChild(select.firstChild);
  }

  arrayWithNames.each(function(a) {
    var element = document.createElement('option');
    element.innerText = a.name;
    select.appendChild(element);
  });
  
  select.selectedIndex = initial || 0;

  return select;
};

CGD.HTML.radio = CGD.HTML.radio || {};
CGD.HTML.radio.set = function(idPrefix, value) {
  var radio = document.getElementById(idPrefix + value);
  radio.checked = true;
};

CGD.draw = CGD.draw || {};
CGD.draw.on = function(id, f) {
  var canvas = document.getElementById(id);
  if (!id) {
    return;
  }
  var context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.save();
  context.scale(canvas.width, canvas.height);
  context.clearRect(0, 0, 1, 1);

  f(context);

  context.restore();
};

CGD.RGB = CGD.RGB || {};
CGD.STRING = CGD.STRING || {};
CGD.stopWhining = function() {
  CGD.RGB.STRINGS = {
    red: '#F00',
    green: '#0F0',
    blue: '#00F',
    orange: '#FFA500',
    yellow: '#FF0',
    purple: '#808',
    pink: '#FFC0CB',
    cyan: '#0FF',
    white: '#FFF',
    black: '#000',
    lastEntry: null
  };
  
  function rgbFromHex6(s) {
    function c(s, pos) {
      return parseInt(s.substr(pos,2), 16) / 255;
    }
    return {r: c(s, 1), g: c(s, 3), b: c(s, 5)};
  }

  function rgbFromHex3(s) {
    function c(s, pos) {
      return parseInt(s.substr(pos,1), 16) / 15;
    }
    return {r: c(s, 1), g: c(s, 2), b: c(s, 3)};
  }

  function rgbFromString(s) {
    if (!s) {
      return rgbFromString('white');
    } else if (CGD.RGB.STRINGS[s]) {
      return rgbFromString(CGD.RGB.STRINGS[s]);
    } else if (s.length == 4) {
      return rgbFromHex3(s);
    } else if (s.length == 7) {
      return rgbFromHex6(s);
    } else {
      throw s + ' is not a color';
    }
  }
  CGD.RGB.fromString = rgbFromString;

  function stringFromRgb(rgb) {
    function c(a) {
      b = Math.round(a * 255).toString(16);
      return (b.length == 1) ? ('0' + b) : b;
    }
    return '#' + c(rgb.r) + c(rgb.g) + c(rgb.b);
  }
  CGD.STRING.fromRgb = stringFromRgb;

  function interpolate(a, b, at, to) {
    return a + (b-a)*at/to;
  }

  function interpolateColors(a, b, at, to) {
    return {
      r: interpolate(a.r, b.r, at, to),
      g: interpolate(a.g, b.g, at, to),
      b: interpolate(a.b, b.b, at, to)
    };
  }

  function interpolateStringColors(a, b, steps) {
    var it = [a];
    var as = rgbFromString(a);
    var bs = rgbFromString(b);
    for (var i = 1;i < steps-1;i++) {
      it.push(stringFromRgb(interpolateColors(as, bs, i, steps-1)));
    }
    it.push(b);
    return it;
  }
  CGD.RGB.interpolate = interpolateStringColors;
}();

CGD.ARC = CGD.ARC || {CLOCKWISE: 0, COUNTERCLOCKWISE: true};

CGD.ASTRO = CGD.ASTRO || {};
CGD.JS.mix(CGD.ASTRO, function() {
  function d_latitude() {
    return 42;
  }

  function d_longitude() {
    return new Date().getTimezoneOffset() / 4;  
  }

  function now() {
    var my = new Date();
  //  var my = new Date(2008, 5, 20, 23, 59);
    return my.getTime() - (my.getTimezoneOffset() * 60 * 1000);
  }
  
  var RADIANS = 2 * Math.PI;
  
  function radiansFromDegrees(degrees) {
    return degrees * RADIANS / 360;
  }

  function degreesFromRadians(radians) {
    return radians * 360 / RADIANS;
  }

  function r_gamma() {
    return ((now() / (1000 * 60 * 60 * 24 * 365.24219)) * RADIANS) % RADIANS;
  }

  function m_eqtime() {
    var y = r_gamma();
    return 229.18 * (
      0.0000075
      + 0.001868 * Math.cos(y)
      - 0.032077 * Math.sin(y)
      - 0.014615 * Math.cos(y * 2)
      - 0.040849 * Math.sin(y * 2)
    );
  }

  function r_declination() {
    var y = r_gamma();
    return 0.006918
      - 0.399912 * Math.cos(y)
      + 0.070257 * Math.sin(y)
      - 0.006758 * Math.cos(y * 2)
      + 0.000907 * Math.sin(y * 2)
      - 0.002697 * Math.cos(y * 3)
      + 0.001480 * Math.sin(y * 3);
  }

  function m_hourAngle(d_zenith) {
    var lat = radiansFromDegrees(d_latitude());
    var decl = r_declination();
    var c_zenith = Math.cos(radiansFromDegrees(d_zenith));
    var divisor = Math.cos(lat)*Math.cos(decl);
    var tanget = Math.tan(lat)*Math.tan(decl);
    var first = c_zenith / divisor;
    return 4 * degreesFromRadians(Math.acos(first - tanget));
  }

  function m_solarNoon() {
    return (12 * 60) + 4*d_longitude() - new Date().getTimezoneOffset() - m_eqtime();
  }
  
  return {m_hourAngle: m_hourAngle, m_solarNoon: m_solarNoon};
}());

CGD.naked = function() {

var god = CGD.god;

var app = {};
function publish(s) {
  app[s] = eval(s);
}

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
  D('test');
  test();
  return 0;
});

function test() {
  browse(CGD);
}

function browse(x) {
  //$(CGD.HTML.from({div: repr(x)})).appendTo('#naked');
  var browser = $("<div class='browser'></div>");
  CGD.JS.each_with_index(x, function (i, y) {browser.append(inspector(i, x));});
  browser.appendTo('#naked');
}

function repr(x) {
  if (typeof(x) == 'function') {
    return ['*', 'function'];
  } else {
    return [x, typeof(x)];
  }
}

function inspector(name, x) {
  return $("<div class='inspector'></div>").html(name + ": " + repr(x).toString());
}

return app;
//end CGD.naked
}();
