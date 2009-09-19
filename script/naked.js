// Creative Commons Attribution-Share Alike 3.0 Unported Licence
// http://creativecommons.org/licenses/by-sa/3.0/

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

function browser(name, container) {
  browser.prototype.target =
    browser.prototype.target || browser.prototype.findTarget();
  browser.prototype.id += 1;
  var b = object(browser.prototype);
  b.name = name;
  b.container = container;
  b.id = browser.prototype.id;
  b.tag = 'Browser' + b.id;
  return b;
}
CGD['browser'] = browser;

browser.prototype = {
  name: "",
  container: null,
  knownType: undefined,
  header: $(HTML.from({table: {tr: {th: ['Name', 'Type', 'Value']}}})),
  target: null,
  id: 0,
  tag: '',
  toString: function() {
    return '['+this.tag+' '+this.container+'[' + this.name +'] ]';
  },
  value: function(set) {
    if (arguments.length == 1) {
      try {
        return this.container[this.name] = set;
      } catch (e) {
        return this.value();
      }
    } else {
      try {
        return this.container[this.name];
      } catch (e) {
        this.knownType = 'error';
        return e.name || e;
      }
    }
  },
  type: function() {
    if (this.knownType) {
      return this.knownType;
    } else {
      try {
        return (this.knownType = typeof(this.container[this.name]));
      } catch (e) {
        return (this.knownType = 'error');
      }
    }
  },
  coerce: function(s) {
    switch(this.type()) {
      case 'string':
        return s + "";
      case 'number':
        var n = parseInt(s, 10);
        return isNaN(n) ? undefined : n;
      case 'function':
      case 'object':
      case 'undefined':
        return eval(s);
      case 'error':
        return undefined;
      default:
        return this.value();
    }
  },
  owner: function() {
    try {
      return this.container.hasOwnProperty(this.name) ? 'own' : 'prototype';
    } catch (e) {
      D(e);
      return 'error';
    }
  },
  findTarget: function() {
    var naked = $('#naked');
    if (naked.length > 0) {
      return naked;
    } else {
      return $("<div id='naked'></div>").appendTo('body');
    }
  },
  browse: function(dialogOptions) {
    var it = this.browseContents();
    it.appendTo(this.target);
    it = it.wrap(document.createElement('div')).parent();
    it.attr({'class': 'browser', title: this.name});
    $(document).ready(function() {it.toDialog(dialogOptions);});
    return this;
  },
  browseContents: function() {
    switch(this.type()) {
      case 'function':
        return $(HTML.from({div: {pre: {code: this.full()}}})).
          find('code').addClass('js').chili().end().
          append(this.browseCompound());
      case 'object':
        return this.browseCompound();
      default:
        return this.browseOne();
        //return $(HTML.from({p: this.full()}));
    }
  },
  browseOne: function() {
    var jq = this.header.clone();

    try {
      this.view().appendTo(jq);
    } catch (e) {
      return browser(0, [e]).browseCompound();
      //browser('name', e).view().appendTo(jq);
    }
    return jq;
  },
  browseCompound: function() {
    var jq = this.header.clone();
    var v = this.value();

    try {
      for (var index in v) {
        browser(index, v).view().appendTo(jq);
      }
    } catch (e) {
      return browser(0, [e]).browseCompound();
      //browser('name', e).view().appendTo(jq);
    }
    return jq;
  },
  view: function() {
    try {
      var values = [{span: this.name}, this.type(), {span: this.brief()}];
      var html = HTML.from({tr: {td: values}});
      var jq = $(html).addClass(this.owner()).addClass(this.type());
      this.make_actionable(jq.find('td:last span'));
      if (this.type() == 'function') {
        this.make_executable(jq.find('td:first span'));
      }
      return jq;
    } catch (e) {
      D(e);
      var values = [this.name, 'view error', e.name];
      var html = HTML.from({tr: {td: values}});
      return $(html).addClass('error');
    }
  },
  make_actionable: function(jq) {
    switch(this.value()) {
      case null:
        return jq;
      default:
        switch(this.type()) {
          case 'function':
          case 'object':
            return this.make_browseable(jq);
          case 'string':
          case 'number':
          case 'undefined':
            return this.make_editable(jq);
          default:
            return jq;
        }
    }
  },
  make_browseable: function(jq) {
    var b = this;
    return jq.click(function() {b.browse();}).addClass('link');
  },
  make_editable: function(jq) {
    var b = this;
    // chili doesn't pretty-print function() syntax
    function commit(id, neu, old, params) {
      var v = b.coerce(neu);
      if (typeof(v) === b.type() || b.type() == 'undefined') {
        b.knownType = undefined;
        return b.value(v);
      } else {
        return old;
      }
    };
    return jq.editInPlace({
        default_text: "",
        callback: commit
      }).addClass('link');
  },
  make_executable: function(jq) {
    var b = this;
    return jq.click(function() {
        var args = b.argument_object();
        browser('arguments', {arguments: args}).browse({
          close: function() {
            var result = b.value().apply(b.container, values(args));
            if (result) {
              browser('result', {result: result}).browse();
            }
          }
        });
      }).addClass('link');
  },
  argument_object: function() {
    var args = (this.value() + "").match(/\((.*)\)/)[1].split(', ');
    var obj = {};
    forEach(args, function(a) {
      obj[a] = undefined;
    });
    return obj;
  },
  brief: function() {
    switch(this.type()) {
      case 'function':
        return (this.value() + "").match(/\(.*\)/);
      case 'undefined':
        return 'undefined';
      case 'string':
        return this.value();
      default:
        var s = this.value() + "";
        if (s == "") {
          return "--blank rep--";
        } else {
          return s;
        }
    }
  },
  full: function() {
    return HTML.NoEscape(this.value().toString());
  }
};

browser.extendJQ = function () {
  $.fn.extend(browser.extendJQ.fn);
};
browser.extendJQ.dialogDefaults = {
  show: 'slow',
  hide: 'slow'
};
browser.extendJQ.close = function(event, ui) {$(this).remove();};
browser.extendJQ.fn = {
  toDialog: function(options) {
    options = options || {};
    options.width = options.width || this.outerWidth() + 90;
    mixSafe(options, browser.extendJQ.dialogDefaults);
    this.dialog(options);
    this.bind('dialogclose', browser.extendJQ.close);
    return this;
  },
  tap: function (f) {
    f.call(this);
    return this;
  },
  print: function() {
    D(this.attr('class'));
    return this;
  },
  toString: function() {
    return '[jQuery ' + this.length + ']';
  },
  noop: function() {return this;} // for breaking chains
};

//necessary
$(document).ready(browser.extendJQ);

//end CGD.naked
}());
