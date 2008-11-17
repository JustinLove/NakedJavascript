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
  var b = object(browser.prototype);
  b.name = name;
  b.container = container;
  return b;
}
CGD['browser'] = browser;

browser.prototype = {
  name: "",
  container: null,
  knownType: undefined,
  header: $(HTML.from({table: {tr: {th: ['Name', 'Type', 'Value']}}})),
  toString: function() {
    return '[Browser '+this.container+'[' + this.name +'] ]';
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
      case 'error':
        return undefined;
      default:
        return v;
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
  browse: function(dialogOptions) {
    var it = this.browseContents();
    it.appendTo('#naked');
    it = it.wrap(document.createElement('div')).parent();
    it.attr({'class': 'browser', title: this.name});
    it.toDialog(dialogOptions);
    return this;
  },
  browseContents: function() {
    switch(this.type()) {
      case 'function':
        return $(HTML.from({div: {p: {code: this.full()}}})).
          find('code').addClass('javascript').chili().end().
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
      var values = [this.name, this.type(), {span: this.brief()}];
      var html = HTML.from({tr: {td: values}});
      var jq = $(html).addClass(this.owner()).addClass(this.type());
      this.make_actionable(jq.find('td:last span'));
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
      case undefined:
        return jq;
      default:
        switch(this.type()) {
          case 'function':
          case 'object':
            return this.make_browseable(jq);
          case 'string':
          case 'number':
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
      if (typeof(v) === b.type()) {
        return b.value(neu);
      } else {
        return old;
      }
    };
    return jq.editInPlace({
        default_text: "",
        callback: commit
      }).addClass('link');
  },
  brief: function() {
    switch(this.type()) {
      case 'function':
        return (this.value() + "").match(/\(.*\)/);
      case 'undefined':
        return 'undefined';
      default:
        return this.value() + "";
    }
  },
  full: function() {
    return this.value().toString();
  }
};

browser.test = function () {
  browser('data', browser.test).browse({title: 'Test & Credits', position: 'right'});
  browser('playground', browser.test.data).browse();
  //browser('nodeValue', document.getElementById('victim').childNodes[0]).browse();
  //browser('body', god.document).browse();
};
browser.test.data = {
  jQuery: "http://jquery.com",
  'jQuery.ui': "http://ui.jquery.com",
  chili: "http://noteslog.com/chili/",
  editInPlace: "http://davehauenstein.com/blog/archives/28",
  CGD: CGD,
  nakedjs: browser,
  god: god,
  playground: {
    n: 42,
    s: "blarg",
    b: "",
    f: function(x, y) {return x + y;},
    x: null,
    u: undefined,
    a: [1, 2, 3]
  },
  victim: document.getElementById('victim').childNodes[0]
};

browser.extendJQ = function () {
  $.fn.extend(browser.extendJQ.fn);
};
browser.extendJQ.fn = {
  toDialog: function(options) {
    options = options || {};
    options.width = options.width || this.width() + 50;
    options.height = options.height || this.height() + 80;
    options.close = function() {
      $(this).parents('.ui-dialog').
        show().hide('slow', function() {$(this).remove();});
    };
    this.addClass('flora').dialog(options).
      parents('.ui-dialog').hide().show('slow');
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

//testing
$(document).ready(function() {
  $('#debugDiv').toDialog({position: 'bottom', title: 'Debug'});
  DEBUG.onload();
  DEBUG.on();
  D('test');
  browser.test();
});

//end CGD.naked
}());
