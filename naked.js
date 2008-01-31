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

CGD.DisClock = function() {

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

var CONFIG = {
  image: {src: 'Disk.pdf', size: 172},
  size: 172,
  normal: 'Disk Clock',
  //normal: 'Tzolkin',
  //normal: 'Debug',
  hover: 'Calendar',
  last: null
};

CGD.JS.corrupt();
var mix = CGD.JS.mix;
var mixSafe = CGD.JS.mixSafe;

var ARC = CGD.ARC;

var DISKS = function() {
  var exportObject = {};
  function publish(symbol) {
    exportObject[symbol] = eval(symbol);
  }

  function relativeAngleFromRevolutions(rev, turns) {
    return (turns == ARC.COUNTERCLOCKWISE ? (1.0 - rev) : rev) * Math.RADIANS;
  }

  function absoluteAngleFromRevolutions(rev, turns) {
    return relativeAngleFromRevolutions(rev, turns) - 0.25 * Math.RADIANS;
  }

  function normalizePartial(a) {
    var n = a % 1;
    return n < 0 ? n+1 : n;
  }

  
  var master = {
    name: 'disk',
    enabled: false,
    scale: 0,
    position: 0,
    time: 0,
    factor: 1,
    unit: 1,
    calcUnit: 1,
    count: 1,
    minor: 1,
    minorWeight: 1.0,
    median: 1,
    medianWeight: 1.0,
    major: 1,
    majorWeight: 1.0,
    subDivide: 1,
    offset: 0,
    root: 0,
    radius: 0.485,
    border: 0.03,
    //src: CONFIG.image.src,
    toString: function() {
      return '[' + this.name + ' Disk ' + [this.describe()].join(', ') + ']';
    },
    describe: function(partial) {
      partial = partial || this.position;
      return (partial * this.count).toFixed(2) + " " + nameUnit(this.calcUnit * this.unit) + 's';
    },
    postDescription: function(partial, adjective) {
      postInfo({h2: this.name, p: this.describe(partial) + ' ' + adjective});
    },
    enable: function (as) {
      this.enabled = as;
    },
    active: function () {
      return this.scale > 0;
    },
    unscale: function() {
      return Math.sqrt(1/this.scale);
    },
    partial: function (ms) {
      var root = ((ms / this.calcUnit) - this.root);
      var unit = ((root / this.unit) + this.offset);
      return (unit % this.count) / this.count;
    },
    drawCircle: function(context, color) {
      context.save();
      context.beginPath();
      context.arc(0, 0, this.radius, 0, Math.RADIANS, ARC.CLOCKWISE);
      context.fillStyle = color || 'white';
      context.fill();
      context.restore();
    },
    drawRing: function(context, options) {
      options = options || {};
      var turns = options.turns || ARC.CLOCKWISE;
      context.save();
      context.beginPath();
      context.arc(0, 0, this.radius, 
        absoluteAngleFromRevolutions(options.start || 0, turns), 
        absoluteAngleFromRevolutions(options.stop || 1, turns), 
        turns);
      context.lineWidth = this.border;
      if (options.scaleCorrection) {
        context.lineWidth *= this.unscale();
      }
      context.strokeStyle = options.color || 'black';
      context.stroke();
      context.restore();
    },
    drawImage: function(context) {
      if (this.image && this.image.loaded) {
        context.drawImage (this.image, -0.5, -0.5 * this.imageDirection, 1, 1);
      } else {
        this.drawCircle(context);
      }
    },
    drawWedges: function(context, colors, alpha) {
      if (!colors) {
        return;
      }
      var stride = Math.PI * 2 / colors.length;
      var radius = this.radius;
      context.save();
      context.globalAlpha = alpha || 1.0;
      context.rotate(Math.PI / -2);
      colors.each_index(function (d) {
        if (colors[d]) {
          context.beginPath();
          context.moveTo(0, 0);
          context.arc(0, 0, radius, stride * d, stride * (1 + Number(d)), ARC.CLOCKWISE);
          context.closePath();
          context.fillStyle = colors[d];
          context.fill();
        }
      });
      context.restore();
    },
    drawVariableWedges: function(context, colors, options) {
      if (!colors) {
        return;
      }
      options = options || {};
      var radius = (options.radius || 1) * this.radius;
      var from ;
      var to;
      context.save();
      context.globalAlpha = options.alpha || 1.0;
      colors.each(function (it) {
        if (typeof(it) == 'string') {
          context.fillStyle = it;
        } else {
          from = to;
          to = it;
          if (from !== undefined) {
            context.beginPath();
            context.moveTo(0, 0);
            context.arc(0, 0, radius, from, to, ARC.CLOCKWISE);
            context.closePath();
            context.fill();
          }
        }
      });
      context.restore();
    },
    drawMarkers: function(context, options) {
//      D(this.major);
//      D(this.median);
//      D(this.minor);
//      D(this.subDivide);
//      D(this.count);
      options = options || {};
      var count = this.count * this.subDivide;
      var stride = Math.RADIANS / count;
      var my = this;
      var perimeter = my.scale * CONFIG.size * Math.PI;
      function markerScale(divisor) {
        var interMarkPercent = divisor / count;
        var factor = Math.sqrt(interMarkPercent / my.scale);
        var interMarkDistance = interMarkPercent * perimeter;
        return (interMarkDistance < 5) ? 0 : factor;
      }
      var majorWeight = markerScale(this.major) * this.majorWeight;
      var medianWeight = markerScale(this.median) * this.medianWeight;
      var minorWeight = markerScale(this.minor) * this.minorWeight;
      var weight;
      var radius;
      var angle;
      var width;
      context.save();
      context.strokeStyle = options.color || 'black';
      context.rotate(Math.PI / -2);

      for (var i = 0;i < count; i++) {
        if (i == 0) {
          weight = 1;
        } else if (i % this.major == 0) {
          weight = majorWeight;
        } else if (i % this.median == 0) {
          weight = medianWeight;
        } else if (i % this.minor == 0){
          weight = minorWeight;
        } else {
          weight = 0;
        }
        if (weight > 0.0001) {
          context.lineWidth = 0.3 * weight;
          radius = this.radius - this.border/2 - context.lineWidth/2;
          if (radius < 0) {
            continue;
          }
          angle = stride * i;
          width = Math.RADIANS * 0.015 * weight;
          if (options.colorFunc) {
            context.strokeStyle = options.colorFunc.call(this, angle);            
          }
          context.beginPath();
          context.arc(0, 0, radius, angle - width, angle + width, ARC.CLOCKWISE);
          context.stroke();
        }
      }
      context.restore();
    },
    drawSpiral: function(context, count, color) {
      if (!color) {
        return;
      }
      var stride = Math.PI * 2 / count;
      var radius = 0.25;
      context.save();
      context.strokeStyle = color;
      context.globalAlpha = 1;
      context.rotate(Math.PI / -2);
      context.lineWidth = 0.43;
      for (var i = 0;i < count; i++) {
//        if (i % 2) {
          var factor = i/count;
          context.globalAlpha = 0.25 + factor*2/3;
//          context.globalAlpha = 0.4 + 0.4*(i%2);
          context.beginPath();
//          context.lineWidth = 0.44*0.8 + 0.44*0.2*factor;
//          radius = 0.26*0.8 + 0.26*0.2*factor;
          context.arc(0, 0, radius, stride * i, stride * (1 + i), ARC.CLOCKWISE);
          context.stroke();
//        }
      }
      context.restore();
    },
    render: function(context) {
      this.drawImage(context);
      this.drawWedges(context, this.colors);
      if (!this.image) {
        this.drawRing(context);
        this.drawMarkers(context);
      }
    },
    animate: function(property, to) {
      var delta = to - this[property];
      delta = Math.min(delta, 1);
      delta = Math.max(delta, -1);
//      D([this.name, delta]);
      if (-0.01 < delta && delta < 0.01) {
        this[property] = to;
        return true;
      } else {
        this[property] += Math.sin(delta * Math.PI / 2) * DISKS.animating();
        return false;
      }
    },
    update: function(ms, scale) {
      this.animate('scale', this.enabled ? scale : 0);
      //this.scale = this.enabled ? scale : 0;
      if (this.active()) {
        var delta = ms - this.time;
        if (this.calcUnit < 1000 || delta <= this.calcUnit * 2) {
          this.position = this.partial(ms);
          this.time = ms;
        } else {
          var to = this.partial(ms);
          to += (delta > this.calcUnit * this.unit * this.count) ? 1 : 0;
          if (this.animate('position', to)) {
            this.time = ms;
          }
        }
      }
      return this.active();
    },
    draw: function(context) {
      //besides being more efficient, firefox will stop talking to us if we
      // ever try to do scale 0
      if (this.scale > 0) {
        context.save();
        context.rotate(relativeAngleFromRevolutions(this.position, ARC.COUNTERCLOCKWISE));
        var x = this.scale;
        context.scale(x, x);
        //context.scale(this.scale, this.scale);
        this.render(context);
        context.restore();
      }
    },
    drawOverlay: function(context, partial, kind) {
      var color;
      var turns;
      if (kind == 'future') {
        partial = 1-partial;
        color = 'red';
        turns = ARC.CLOCKWISE;
      } else {
        color = 'blue';
        turns = ARC.COUNTERCLOCKWISE;
      }
      context.save();
      context.scale(this.scale, this.scale);
      this.drawRing(context, {
        color: color,
        scaleCorrection: true,
        start: 0,
        stop: partial,
        turns: turns});
      context.rotate(relativeAngleFromRevolutions(partial, turns));
      context.beginPath();
      context.arc(0, -(this.radius), this.border*2*this.unscale(), 0, Math.RADIANS, ARC.CLOCKWISE);
      context.fillStyle = color;
      context.fill();
      context.restore();
      this.postDescription(partial, kind == 'future' ? 'remaining' : 'past');
    },
    delay: function () {return this.calcUnit;},
    cacheColors: function () {
      if (this.color && !this.colors) {
        this.colors = CGD.RGB.interpolate(null, this.color,
          (this.major == this.count) ? 4 : (this.count*this.subDivide/this.major));
      }
    },
    loadImage: function() {
      if (this.src) {
        this.image = new Image(CONFIG.image.size, CONFIG.image.size);
        mix(this.image, CGD.JS.LoadProgress);
        this.image.src = this.src;
        if (window.widget) {
          this.image.onload();
        }
        this.imageDirection = (window.widget && this.src.substr(-3, 3) == 'pdf') ? -1 : 1;
      }
    },
    cache: function () {
      this.cacheColors();
    },
    lastEntry: null
  };

  function create(name, calcUnit, unit, count, args) {
    var my = object(master);
    my.name = name;
    my.calcUnit = calcUnit;
    my.unit = unit;
    my.count = count;
    if (count % 4 == 0) {
      my.major = Math.floor(count / 4);
    } else if (count % 5 == 0) {
      my.major = 5;
    } else {
      my.major = count;
    }
    if (count < 10) {
      my.subDivide = 4;
      my.major = 4;
      my.median = 1;
    } else if (count % 12 == 0) {
      my.median = Math.floor(count / 12);
    } else if (count % 5 == 0) {
      my.median = 5;
    } else {
      my.median = count;
    }
    //my.args = args;
    mix(my, args);
    my.loadImage(); // waiting until cache, the image isn't available on first draw.
    return my;
  }
  
  function extend(array, to) {
    var l = array.length;
    var it = [];
    var a = 0;
    for (var i = 0;i < to;i++) {
      it.push(array[a]);
      a = (a + 1) % l;
    }
    return it;
  }

  var MS_S = 1000;
  var S_M = 60;
  var M_H = 60;
  var H_D = 24;
  var MS_D = MS_S * S_M * M_H * H_D;
  var D_W = 7;
  var D_LM = 29.530589;
  var D_SY = 365.24219;
  var Y_G = 20;
  var G_L = 4;
  var Y_C = 100;
  var D_TM = 20;
  var D_TR = 13;
  // kin - day
  var D_U = 20;
  var U_T = 18;
  var T_KAT = 20;
  var KAT_BAKT = 20;
  var BAKT_PICT = 20;
  var MAYAN_EPOCH = 2440587 - 584282;
  
  var MS = {per: object(CGD.JS.Enumerable)};
  mix(MS.per, {
    ms: 1,
    tenth: 100,
    second: MS_S,
    minute: MS_S * S_M,
    hour: MS_S * S_M * M_H,
    day: MS_D
  });

  var DAYS = {per: object(CGD.JS.Enumerable)};
  mix(DAYS.per, {
    day: 1,
    week: D_W,
    moon: D_LM,
    year: D_SY,
    generation: D_SY * Y_G,
    lifetime: D_SY * Y_G * G_L,
    century: D_SY * Y_C,
    kin: 1,
    uinal: D_U,
    tun: D_U * U_T,
    katun: D_U * U_T * T_KAT,
    baktun: D_U * U_T * T_KAT * KAT_BAKT,
    pictun: D_U * U_T * T_KAT * KAT_BAKT * BAKT_PICT,
    tzolkinMonth: D_TM,
    tzolkinTrecena: D_TR,
    tzolkinYear: D_TM * D_TR
  });
  
  function nameUnit(ms) {
    if (ms < MS_D) {
      try {
        return MS.per.indexOf(ms);
      } catch (e) {
        return '??';
      }
    } else {
      try {
        return DAYS.per.indexOf(ms/MS_D);
      } catch (e) {
        return '??';
      }
    }
    return 'huh?';
  }

  var pictun = create('Pictun', MS_D, D_U * U_T * T_KAT * KAT_BAKT, BAKT_PICT, {
    color: 'blue'
  });
  var baktun13 = create('13 Baktun', MS_D, D_U * U_T * T_KAT * KAT_BAKT, 13, {
    color: 'purple'
  });
  var baktun = create('Baktun', MS_D, D_U * U_T * T_KAT, KAT_BAKT, {
    color: 'red'
  });
  var katun = create('Katun', MS_D, D_U * U_T, T_KAT, {
    color: 'pink'
  });
  var tun = create('Tun', MS_D, D_U, U_T, {
    major: 6,
    color: 'yellow'
  });
  var uinal = create('Uinal', MS_D, 1, D_U, {
    color: 'green'
  });
  
  [pictun, baktun13, baktun, katun, tun, uinal].each(function(d) {
    d.root = -MAYAN_EPOCH;
  });

  var tzolkinDays = create('Tzolkin Days', MS_D, 1, D_TM, {
    color: 'red'
  });

  var trecena = create('Tzolkin Trecena', MS_D, 1, D_TR, {
    color: 'yellow'
  });

  var tzolkinYear = create('Tzolkin Year', MS_D, 1, D_TM * D_TR, {
    dayColors: extend([trecena.color, null], D_TR),
    trecenaColors: extend([tzolkinDays.color, null], D_TM),
    render: function(context) {
      this.drawCircle(context);
      this.drawWedges(context, this.dayColors, 0.5);
      this.drawWedges(context, this.trecenaColors, 0.5);
      this.drawRing(context);
      this.drawMarkers(context);
    },
    major: D_TM * D_TR,
    median: D_TM,
    minor: D_TR
  });

  [tzolkinYear, tzolkinDays, trecena].each(function(d) {
    d.root = -4 - 16*D_TM;
  });

  var century = create('Century', MS_D, D_SY, Y_C, {
    color: '#F0F',
    root: -70 * D_SY,
    major: 20,
    median: 5
  });

  var lifetime = create('Lifetime', MS_D, D_SY, Y_G * G_L, {
    color: '#80F',
    root: new Date(1975, 12 - 1, 15, 5, 45).getTime() / MS_D
  });

  var generation = create('Generation', MS_D, D_SY, Y_G, {
    color: 'blue',
    root: lifetime.root
  });

  var year = create('Solar Year', MS_D, 1, D_SY, {
    colors: ['blue', 'green', 'orange', 'brown'],
    subDivide: 12*4/D_SY,
    major: 3*4,
    median: 1*4,
    render: function(context) {
      context.save();
      context.rotate(-2 * Math.PI * 9 / 365);
      this.drawWedges(context, this.colors);
      this.drawRing(context);
      context.fillStyle = "black";
      context.globalAlpha = 0.5;
      context.arc(0, -0.01, 0.44, 0, 0.0001, ARC.COUNTERCLOCKWISE);
      context.fill();
      context.restore();
      this.drawMarkers(context);
    },
    lastEntry: null    
  });

  var moon = create('Moon', MS_D, 1, D_LM, {
    root: Date.UTC(2007, 11, 9, 17, 41) / MS_D,
    src: 'Moon.png',
    xrender: function(context) {
      this.drawCircle(context);
      this.drawRing(context);
      context.fillStyle = "black";
      context.globalAlpha = 0.5;
      context.arc(0, -0.032, 0.43, 0, 0.0001, ARC.COUNTERCLOCKWISE);
      context.fill();
    }
  });

  var week = create('Week', MS_S * S_M * M_H, H_D, D_W, {
    offset: 4,
    colors: ['red', 'yellow', 'pink', 'green', 'orange', '#88F', 'purple'],
    subDivide: 6,
    major: 6,
    median: 3
  });

  var day = create('Day', MS_S * S_M, M_H, H_D, {
    major: 12,
    median: 4,
    minorWeight: 0.8,
    cache: function() {
      var A = CGD.ASTRO;
      var noon = A.m_solarNoon() / 60;
      var daylight = A.m_hourAngle(90.833) / 60;
      var twilight = A.m_hourAngle(99) / 60;
      var my = this;
      function partial(hours) {
        return hours / 24;
      }
      function angle(hours) {
        return absoluteAngleFromRevolutions(partial(hours), ARC.CLOCKWISE);
      }
      this.nightBegin = angle(noon + twilight);
      this.nightEnd = angle(noon - twilight);
      this.sunset = angle(noon + daylight);
      this.sunrise = angle(noon - daylight);
      this.inBed = angle(noon - twilight - 8);
      this.outBed = angle(noon - twilight);
      // and save this in case we need them later
      this.noon = angle(noon);
      this.daylight = partial(daylight) * Math.RADIANS;
      this.twilight = partial(twilight) * Math.RADIANS;
    },
    render: function(context) {
      this.drawVariableWedges(context, [
        this.sunrise, '#3BB9FF',
        this.sunset, '#00F',
        this.nightBegin, '#424',
        this.nightEnd, '#00F',
        this.sunrise
      ]);
      // bed time can't be an ordinary wedge because it blows up at the
      //  summer solstice with less than 8 hours darkness
      this.drawVariableWedges(context, [
        this.inBed, '#000', this.outBed], {alpha: 0.7});
      this.drawRing(context);
      var darkness = '#BBB';
      var twilight = 'yellow';
      var daylight = 'white';
      this.drawMarkers(context, {colorFunc: function(angle) {
        angle += Math.RADIANS * 3 / 4;
        angle %= Math.RADIANS;
        if (angle < this.nightEnd) {
          return darkness;
        } else if (angle < this.sunrise) {
          return twilight;
        } else if (angle < this.sunset) {
          return daylight;
        } else if (angle < this.nightBegin) {
          return twilight;
        } else {
          return darkness;
        }
      }});
      var width = Math.RADIANS / 180;
      this.drawVariableWedges(context, [
        this.noon - width, 'red', this.noon + width]);
    },
    last: null
  });

  var hour12 = create('12 Hour', MS_S * S_M, M_H, 12, {
    subDivide: 5,
    major: 5*3,
    median: 5,
    color: 'cyan'
  });

  var hour4 = create('4 Hour', MS_S * S_M, M_H, 4, {
    subDivide: 12,
    major: 12,
    median: 3,
    color: 'green'
  });

  var hour = create('Hour', MS_S, S_M, M_H, {
    color: '#8F0'
  });

  var minute15 = create('15 Minute', MS_S, S_M, 15, {
    subDivide: 4,
    major: 5*4,
    median: 4,
    color: 'yellow'
  });

  var minute5 = create('5 Minute', MS_S, S_M, 5, {
    color: 'orange'
  });

  var minute = create('Minute', MS_S, 1, S_M, {
    color: 'red'
  });

  var second = create('Second', 100, 1, 10, {
    color: '#800',
    subDivide: 10,
    major: 10
  });

  var all = [
    pictun,
    baktun13,
    baktun,
    century,
    lifetime,
    generation,
    katun,
    year,
    tun,
    tzolkinYear,
    moon,
    uinal,
    tzolkinDays,
    trecena,
    week,
    day,
    hour12,
    hour4,
    hour,
    minute15,
    minute5,
    minute,
    second
  ];
  var sets = [
    {name: "Long Count", disks: [pictun, baktun, katun, tun, uinal, day]},
    {name: "Apocolyptic", disks: [baktun13, baktun, katun, tun, uinal, day]},
    {name: "Century", disks: [century, generation, year]},
    {name: "Lifetime", disks: [lifetime, generation, year]},
    {name: "Tzolkin", disks: [tzolkinYear, tzolkinDays, trecena, day]},
    {name: "Calendar", disks: [year, moon, week]},
    {name: "Disk Clock", disks: [week, day, hour4, minute15]},
    {name: "Classic Clock", disks: [hour12, hour, minute]},
    {name: "Fine", disks: [minute5, minute, second]},
    {name: "Debug", disks: [
    //    pictun,
    //    baktun13,
    //    baktun,
    //    century,
    //    lifetime,
    //    generation,
    //    katun,
    //    tun,
    //    uinal,
    //    tzolkinYear,
    //    tzolkinDays,
    //    trecena,
    //    year,
    //    moon,
//        week,
//        day,
    //    hour12,
//        hour4,
    //    hour,
        minute15
    //    minute5,
    //    minute
    //    second
      ]}
  ];
  
  var animationDelay = MS_D;
  var animationStep = 0.1;
  var normalDelay = MS_S;
  
  function setTicker() {
    clockTicker.configure(Math.min(
      animationDelay || MS_D,
      normalDelay || MS_S));
  }
  
  function update() {
    animationDelay = MS_D;
    var ms = now();
    var scale = 1.0;
    all.each(function(d) {
      if (d.update(ms, scale)) {
        if (d.enabled) {
          scale *= 0.8;
        }
      }
    });
    setTicker();
  }
  
  function draw(context) {
    context.save();
    context.translate (0.5, 0.5);
    all.each(function(d) {
      if (d.active()) {
        d.draw(context);
      }
    });
    context.restore();
  }
  
  function drawOverlay(context) {
    if (highlight.disk) {
      context.save();
      context.translate (0.5, 0.5);
      highlight.disk.drawOverlay(context, highlight.disk.position,
        highlight.partial > 0.5 ? 'future' : 'past');
      context.restore();
    }
  }
  publish('drawOverlay');

  function prop(element, p) {
    return parseInt(document.defaultView.getComputedStyle(element, "").getPropertyValue(p), 10);
  }

  function postInfo(info) {
    var div = document.getElementById('info');
    if (div) {
      div.innerHTML = CGD.HTML.from(info);
      if (window.widget) {
        window.resizeTo(prop(div, 'width'), prop(div, 'top') + prop(div, 'height'));
      }
    }
  }
  
  function animating(options) {
    animationDelay = MS_S / 24;
    if (options && options.slow != undefined) {
      if (options.slow) {
        animationStep = 0.01;
      } else {
        animationStep = 0.1;
      }
    }
    return animationStep;
  }
  
  function polarFromRect(x, y) {
    var r = Math.sqrt(x*x + y*y);
    var a = x == 0 ? 0.25 : Math.atan(Math.abs(y/x)) / Math.RADIANS;
    var p = x < 0 ? 0.5-a : a;
    return {p: y < 0 ? 1-p : p, r: r};
  }
  
  function over(px, py) {
    var polar = polarFromRect(
      (px / CONFIG.size) - 0.5,
      (py / CONFIG.size) - 0.5);
//    D(polar.p);
    var s = polar.r * 2;
    for (var i = all.length - 1; i >= 0; i--) {
      if (all[i].scale > s) {
        return {
          disk: all[i],
          partial: normalizePartial(1.0 - (polar.p + 0.25))
        };
      }
    }
    return {disk: null, partial: 0};
  }
  
  var highlight = {
    disk: null,
    partial: 0,
    side: null
  };
  publish('highlight');
  
  function select(s) {
    s = s || {disk: null, partial: 0};
    if (s.disk != highlight.disk || s.partial != highlight.partial) {
      highlight.disk = s.disk;
      highlight.partial = s.partial;
      if (!highlight.disk) {
        postInfo(null);
      }
      app.drawOverlay();
    }
  }
  
  function configure(whichSets) {
    var minimum = generation.delay();
    all.each(function(d) {
      d.enable(false);
    });
    whichSets.each(function(set) {
      sets[set].disks.each(function(d) {
        d.enable(true);
        minimum = Math.min(minimum, d.delay());
      });
    });
    normalDelay = minimum;
    setTicker();
  }
  
  function setup() {
    all.each(function(d) {
      d.cache();
    });
    configure([CONTROLSTATE.normal]);
    CGD.HTML.select.populate('normal-popup', sets, CONTROLSTATE.normal);
    CGD.HTML.select.populate('hover-popup', sets, CONTROLSTATE.hover);
    CGD.HTML.radio.set('mode-', CONTROLSTATE.hoverMode);
    clockTicker.start();
  }

  var oldExport = {
    master: master,
    all: all,
    sets: sets,
    update: update,
    draw: draw,
    animating: animating,
    over: over,
    select: select,
    configure: configure,
    setup: setup,
    pictun: pictun,
    baktun13: baktun13,
    baktun: baktun,
    katun: katun,
    generation: generation,
    year: year,
    tun: tun,
    moon: moon,
    uinal: uinal,
    week: week,
    day: day,
    hour12: hour12,
    hour4: hour4,
    hour: hour,
    minute15: minute15,
    minute5: minute5,
    minute: minute,
    second: second,
    toString: function () {return 'DISKS';}
  };
  mix(oldExport, exportObject);
  DEBUG.dump(oldExport);
  return oldExport;
} ();

function clear() {
  var canvas =    document.getElementById("canvas");
  var context = canvas.getContext("2d");

  context.clearRect (0, 0, context.width, context.height);
  context = null;
  canvas = null;
}

function now() {
  var my = new Date();
//  var my = new Date(2008, 5, 20, 23, 59);
  return my.getTime() - (my.getTimezoneOffset() * 60 * 1000);
}

function indicator(context) {
  context.save();
  context.fillStyle = "#800";
  context.fillRect(0.495, 0, 0.01, 0.5);
  context.restore();
}


function draw() {
  drawDisks();
  if (DISKS.highlight.disk) {
    drawOverlay();
  }
}

function drawDisks() {
  CGD.draw.on('canvas', DISKS.draw);
}

function drawOverlay() {
  CGD.draw.on('overlay', function(context) {
    DISKS.drawOverlay(context);
    indicator(context);
  });
}
publish('drawOverlay');

var clockTicker = CGD.new_ticker(function() {DISKS.update(); draw();}, 1000);
var doneButton;
var infoButton;

god.onerror = god.onerror || function(e) {
  D('stopping clock');
  clockTicker.stop();
};

function setup_buttons() {
  if (god.AppleGlassButton) {
    doneButton = new AppleGlassButton(
      document.getElementById("done"), 
      "Done",
      flipToFront);
  }
  if (god.AppleInfoButton) {
    infoButton = new AppleInfoButton(
      document.getElementById("infoButton"),
      document.getElementById("front"),
      "white", "white",
      flipToBack);
  }
  
  if (!god.widget) {
    var back = document.getElementById('back');
    back.style.left = 172;
    back.style.display = 'block';
    back.style.backgroundColor = '#444';
    var body = document.getElementsByTagName('body')[0];
    body.style.backgroundColor = '#444';
  }
}

function setup_events() {
  function mouseover(e) {
    DISKS.animating({slow: e.shiftKey});
    DISKS.configure(hoverModeDisplay(true));
  }

  function mouseout(e) {
    DISKS.select(null);
    DISKS.animating({slow: e.shiftKey});
    DISKS.configure(hoverModeDisplay(false));
  }
  
  function mousemove(e) {
//    D([e.clientX, e.clientY]);
    DISKS.select(DISKS.over(e.clientX, e.clientY));
  }

  var front = document.getElementById('front');
  front.addEventListener('mouseover', mouseover, true);
  front.addEventListener('mouseout', mouseout, true);
  front.addEventListener('mousemove', mousemove, true);
}

function setup()
{
  DEBUG.onload();
  DEBUG.on();
  D('test');
  load();
  setup_buttons();
  setup_events();
  DISKS.setup();
  drawDisks();
  drawOverlay();
  return 0;
}
publish('setup');

function onshow() {
  draw();
  clockTicker.start();
}

function onhide() {
  clockTicker.stop();
}

function onremove ()
{
  onhide();
  cleanse();
}

if (window.widget) {
  widget.onhide = onhide;
  widget.onshow = onshow;
  widget.onremove = onremove;
}

function flipToFront() {
  save();
  flip('back', 'front');
  clockTicker.start();
}

function flipToBack() {
  clockTicker.stop();
  flip('front', 'back');
}

function flip(from, to) {
  if (window.widget) {
    widget.prepareForTransition("To" + to.toCapital());
    document.getElementById(from).style.display = 'none';
    document.getElementById(to).style.display = 'block';
    setTimeout('CGD.DisClock.drawForTransition()', 0);
  }
}

function drawForTransition() {
  draw();
  if (window.widget) {
    setTimeout('widget.performTransition()', 0);     
  }
}
publish('drawForTransition');

var CONTROLSTATE = {
  normal: CGD.JS.findByName(DISKS.sets, CONFIG.normal),
  hover: CGD.JS.findByName(DISKS.sets, CONFIG.hover),
  hoverMode: 'add'
};

function eachPreference(f) {
  for (var p in CONTROLSTATE) {
    if (CONTROLSTATE.hasOwnProperty(p)) {
      f(p, CONTROLSTATE);
    }
  }
}

function createKey(key) {
  return (window.widget.identifier || 'com.computergenerateddreams.disclock') + 
    '-' + key;
}

function save() {
  if (window.widget) {
    eachPreference(function (p, o) {
      widget.setPreferenceForKey(o[p], createKey(p));
    });
  }
}

function cleanse() {
  if (window.widget) {
    eachPreference(function (p, o) {
      widget.setPreferenceForKey(null, createKey(p));
    });
  }
}

function load() {
  var value;
  if (window.widget) {
    D(window.widget.identifier);
    eachPreference(function (p, o) {
      value = widget.preferenceForKey(createKey(p));
      if (value != undefined) {
        o[p] = value;
      }
    });
  }
}

function hoverModeDisplay(active) {
  normal = [CONTROLSTATE.normal];
  hover = [CONTROLSTATE.hover];
  both = [CONTROLSTATE.normal, CONTROLSTATE.hover];
  return {
    add: [normal, both],
    replace: [normal, hover],
    subtract: [both, normal]
  }[CONTROLSTATE.hoverMode][active ? 1 : 0];
}

function diskchanged(what, index) {
  CONTROLSTATE[what] = index;
  DISKS.animating();
  DISKS.configure(hoverModeDisplay(false));
}

var changed = {
  normal: function(select) {
    diskchanged('normal', select.selectedIndex);
  },
  hover: function(select) {
    diskchanged('hover', select.selectedIndex);
  },
  hovermode: function(radio) {
  //  D(radio.value);
    CONTROLSTATE.hoverMode = radio.value;
  //  D(CONTROLSTATE.hoverMode);
    DISKS.animating();
    DISKS.configure(hoverModeDisplay(false));
  }
};
publish('changed');

return app;
//end CGD.DisClock
}();
