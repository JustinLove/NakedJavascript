// Creative Commons Attribution-Share Alike 3.0 Unported Licence
// http://creativecommons.org/licenses/by-sa/3.0/

var CGD = window.CGD || {};

// Global Object Definitions ;^)
CGD.god = window;

CGD.JS = CGD.JS || {};
(function() {
  function publish(s) {
    CGD.JS[s] = eval(s);
  }
  
  // The name expando comes from jQuery
  // This is a hopefully unique property name where we store further
  //   custom data.
  var expando = "CGD" + (new Date().getTime().toString(36));
  publish('expando');
  //CGD.DEBUG.p(CGD.JS.expando);
  
  function objectData(o) {
    return o['expando'] || (o['expando'] = {});
  }
  publish('objectData');

  // Douglas Crockford's prototypal inheritance.
  // http://javascript.crockford.com/prototypal.html
  function object(o) {
    function F() {};
    F.prototype = (o || {});
    return new F();
  }
  publish('object');

  // As in 'mixin'
  //  Not so useful now that I'm not mucking with standard .prototypes
  //  This one will overwrite existing properties.
  function mix(into, what) {
    for (var p in what) {
      if (what.hasOwnProperty(p)) {
        into[p] = what[p];
      }
    }
  };
  publish('mix');

  // Doesn't overwrite existing properties.
  function mixSafe(into, what) {
    for (var p in what) {
      if (what.hasOwnProperty(p) && into[p] === undefined) {
        into[p] = what[p];
      }
    }
  }
  publish('mixSafe');

  // The event routines are basically a standards patch for IE
  function addEvent(obj, which, f) {
    if ('addEventListener' in obj) {
      obj.addEventListener(which, f, false);
    } else if ('attachEvent' in obj) {
      var data = objectData(obj);
      var fbound = function() {f.apply(obj, arguments);};
      var name = f['eventName'] || f;
      data[which + name] = fbound;
      obj.attachEvent('on'+which, fbound);
    } else {
      obj['on'+which] = function() {f.apply(obj, arguments);};
    }
  }
  publish('addEvent');

  function removeEvent(obj, which, f) {
    if ('addEventListener' in obj) {
      obj.removeEventListener(which, f, false);
    } else if ('attachEvent' in obj) {
      var data = objectData(obj);
      var name = f['eventName'] || f;
      var fbound = data[which + name];
      delete(data[which + name]);
      obj.detachEvent('on'+which, fbound);
    } else {
      obj['on'+which] = null;
    }
  }
  publish('removeEvent');

  // Image load event handling.
  function flagOnLoad() {
    objectData(this)['loaded'] = true; // not quite the same as complete - failed is still complete
    //CGD.DEBUG.p(['complete' in this, this.complete, this.src]);
    
    // Dashboard bug... again.
    if (!('complete' in this)) {
      this.complete = true;
    }
  }
  flagOnLoad.eventName = 'flagOnLoad';

  function loadFlag(image, src) {
    if (CGD.god['widget'] || image.complete) {
      image.src = src;
      flagOnLoad.call(image);
    } else {
      addEvent(image, 'load', flagOnLoad);
      image.src = src;
    }
  }
  publish('loadFlag');
  
  function windowSize () {
    if (innerWidth) {
      return {
        w: innerWidth, 
        h: innerHeight
      };
    } else if (document.body.clientWidth) {
      return {
        w: document.body.clientWidth,
        h: document.body.clientHeight
      };
    } else if (document.documentElement.clientWidth) {
      return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
      };
    }
  }
  publish('windowSize');
  
  var RADIANS = Math.PI * 2;
  publish('RADIANS');
  
  // Eval the result of explode to dump an object into the current namespace, i.e.
  //   eval(CGD.JS.explode('CGD.JS'));
  // Crudely equivelent to "use namespace"
  function explode(what) {
    return "" +
    "for (var i in " + what + ") {" +
    "  if (" + what + ".hasOwnProperty(i)) {" +
    "    eval('var ' + i + ' = " + what + "[i];');" +
    "  }" +
    "}";
  } 
  publish('explode');
  
  // Pass x = flag() to setTimeout, addEvent, etc,
  //  later, check x.flag to see if it has happened yet.
  function flag() {
    var my = function() {my.flag = true;};
    my.flag = false;
    return my;
  }
  publish('flag');
  
}());

CGD.STRING = CGD.STRING || {};
CGD.STRING.capital = function(s) {
  return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
};

CGD.ARRAY = CGD.ARRAY || {};
(function() {
  function publish(s) {
    CGD.ARRAY[s] = eval(s);
  }

  function describes(what) {
    return what && // null is an object...
      typeof(what) == 'object' && 
      'constructor' in what &&
      what.constructor === Array;
  }
  publish('describes');

  // Prototype for exception instances.
  var notFound = {
    name: 'Not Found',
    message: '--',
    toString: function() {
      return this.message;
    }
  };

  // Exception constructor
  function NotFound(message) {
    my = CGD.JS.object(notFound);
    my.message = message ? (my.name + ': ' + message) : my.message;
    return my;
  }
  publish('NotFound');
  
  // As in the DOM class Node; some functions return NodeList,
  //  'array-like' objects that don't work with our standard iterators.
  function forEachNode(what, f) {
    for (var i = 0;i < what.length;i++) {
      f(what.item(i), i, what);
    }
  }
  publish('forEachNode');

  // ordinary real array objects; use an optimized implementation if we have one
  if ('forEach' in Array) {
    function forEach(what, f) {
      what.forEach(f);
    }
  } else {
    function forEach(what, f) {
      for (var i in what) {
        if (what.hasOwnProperty(i)) {
          f(what[i], i, what);
        }
      }
    }
  }
  publish('forEach');

  // These are common functions for the search routines keyWhich and valueWhich
  function equals(x) {
    var f = function(y) {
      return y === x;
    };
    f.equals = x; // store in case we can use the built in indexOf
    f.toString = function() {return "equals " + x.toString();};
    return f;
  }
  publish('equals');

  function hasName(name) {
    var f = function(x) {
      return x.hasOwnProperty('name') && x.name == name;
    };
    f.toString = function() {return "hasName " + name;};
    return f;
  }
  publish('hasName');  

  // Search functions
  // Returns the key WHOSE VALUE has the property
  function keyWhich(what, f) {
    if ('equals' in f && 'constructor' in what && 'indexOf' in what.constructor) {
      //CGD.DEBUG.p('optimizing indexOf');
      var z = what.indexOf(f.equals);
      if (z < 0) {
        throw NotFound("Array.indexOf");
      }
      return z;
    } else {
      for (var i in what) {
        if (what.hasOwnProperty(i)) {
          if (f(what[i])) {
            return i;
          }
        }
      }
      throw NotFound("keyWhich " + f.toString());
    }
  }
  publish('keyWhich');

  // Returns the value which has the desired property
  function valueWhich(what, f) {
    return what[keyWhich(what, f)];
  }
  publish('valueWhich');
  
  // Extends an array to a specified length, by repeating elements
  function extendRepeat(array, to) {
    var l = array.length;
    var it = [];
    var a = 0;
    for (var i = 0;i < to;i++) {
      it.push(array[a]);
      a = (a + 1) % l;
    }
    return it;
  }
  publish('extendRepeat');

}());

