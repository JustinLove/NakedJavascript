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
  b.browsers = {};
  return b;
}
CGD['browser'] = browser;

browser.prototype = {
  name: "",
  container: null,
  knownType: undefined,
  header: $(HTML.from({table: {tr: {th: ['Name', 'Type', 'Value']}}})),
  target: null,
  scratchpad: null,
  scratchpadBrowser: null,
  id: 0,
  tag: '',
  browsers: null,
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
        return eval(s);
      case 'undefined':
        return eval('('+s+')');
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
    if ($(".browser."+this.tag).size() > 0) {
      return this.updateLater();
    }
    // creates dialog view
    var it = this.dialogContents();
    it = it.wrap(document.createElement('div')).parent();
    it.attr({title: this.name});
    $(document).ready(function() {
      it.toDialog(dialogOptions);
    });
    return this;
  },           
  dialogContents: function() {
    var it = this.browseContents();
    it.appendTo(this.target);
    it = it.wrap(document.createElement('div')).parent();
    it.attr({'class': 'browser '+this.tag}).data('browser', this);
    return it;
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
        if (!this.browsers[index] || !this.browsers[index].browsers) {
          this.browsers[index] = browser(index, v);
        }
        this.browsers[index].view().appendTo(jq);
      }
    } catch (e) {
      return browser(0, [e]).browseCompound();
      //browser('name', e).view().appendTo(jq);
    }
    return jq;
  },
  view: function() {
    // creates a table row view
    try {
      var values = [{'span.name': this.name}, this.type(), {'span.value': this.brief()}];
      var x = {};
      x['tr.'+this.tag] = {td: values};
      var html = HTML.from(x);
      var jq = $(html).
        addClass('view').
        addClass(this.owner()).
        addClass(this.type()).
        data('browser', this);
      this.make_browseable(jq.find('td:first span'));
      this.make_actionable(jq.find('td:last span'));
      return jq;
    } catch (e) {
      D(e);
      var values = [this.name, 'view error', e.name];
      var html = HTML.from({tr: {td: values}});
      return $(html).addClass('error');
    }
  },
  changed: function(oldValue) {
    $('.browser').each(function(i, el) {
      var b = $(el).data('browser');
      if (b.container == oldValue) {
        b.updateLater();
      }
    });
    $('.view').each(function(i,el) {
      var b = $(el).data('browser');
      if (b.value() == oldValue) {
        b.updateLater();
      }
    });
  },
  updateLater: function() {
    var b = this;
    setTimeout(function() {b.update();});
    return this;
  },  
  update: function() {
    var b = this;
    $('.'+this.tag).each(function (i, el) {
      var jq = $(el);
      if (el.tagName == "TR") {
        $(el).replaceWith(b.view());
      } else {
        $(el).replaceWith(b.dialogContents());
      }
    });
    return this;
  },
  make_actionable: function(jq) {
    switch(this.value()) {
      case null:
        return jq;
      default:
        switch(this.type()) {
          case 'function':
            return this.make_executable(jq);
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
        b.changed(old);
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
        D(args);
        if (args) {
          browser('arguments', {arguments: args}).browse({
            close: function() {b.apply(values(args));}
          });
        } else {
          b.apply();
        }
      }).addClass('link');
  },
  apply: function(args) {
    var result = this.value().apply(this.container, args);
    $('.browser').each(function(i, el) {$(el).data('browser').update();});
    if (result) {
      this.scratch(result);
    }
  },
  argument_object: function() {
    var args = (this.value() + "").match(/\((.*)\)/)[1].split(', ');
    if (args[0] == "") {
      return undefined;
    }
    var obj = {};
    forEach(args, function(a) {
      obj[a] = undefined;
    });
    return obj;
  },
  scratch: function(item) {
    if (!browser.prototype.scratchpad) {
      browser.prototype.scratchpad = [item];
      browser.prototype.scratchpadBrowser = browser('scratchpad', browser.prototype).browse();
    } else {
      browser.prototype.scratchpad.push(item);
      browser.prototype.scratchpadBrowser.browse();
    }
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
