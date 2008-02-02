var CGD = window.CGD || {};

// Global Object Definitions ;^)
CGD.god = window;

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
