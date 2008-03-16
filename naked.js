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

$(document).ready(function() {
  extendJQ();
  $('#debugDiv').toDialog({position: 'bottom', title: 'Debug'});
  DEBUG.onload();
  DEBUG.on();
  D('test');
  test();
});

function test() {
  browser('CGD', god).browse();
}

function extendJQ() {
  $.fn.extend({
      toDialog: function(options) {
        options = options || {};
        options.width = options.width || this.width() + 50;
        options.height = options.height || this.height() + 80;
        this.attr({'class': "flora"}).dialog(options).
          parents('.ui-dialog').hide().show('slow');
      }
    });
}

function browser(name, container) {
  var b = object(masterBrowser);
  b.name = name;
  b.container = container;
  return b;
}

var masterBrowser = {
  name: "",
  container: null,
  knownType: undefined,
  header: $(HTML.from({table: {tr: {th: ['Name', 'Type', 'Value']}}})),
  value: function() {
    try {
      return this.container[this.name];
    } catch (e) {
      this.knownType = 'error';
      return e.name;
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
  owner: function() {
    try {
      return this.container.hasOwnProperty(this.name) ? 'own' : 'prototype';
    } catch (e) {
      D(e);
      return 'error';
    }
  },
  browse: function() {
    var it = this.browseContents();
    it.appendTo('#naked').
      wrap('<div class="browser"></div>').
      toDialog({title: this.name});
    return this;
  },
  browseContents: function() {
    switch(this.type()) {
      case 'function':
        return $(HTML.from({div: {p: {code: this.full()}}})).
          append(this.browseCompound());
      case 'object':
        return this.browseCompound();
      case 'string':
        return $(HTML.from({form: {textarea: this.full()}}));
      default:
        return $(HTML.from({p: this.full()}));
    }
  },
  browseCompound: function() {
    var jq = this.header.clone();
    var v = this.value();

    for (var index in v) {
      browser(index, v).view().appendTo(jq);
    }
    return jq;
  },
  view: function() {
    var values = [this.name, this.type(), this.brief()];
    var html = HTML.from({tr: {td: values}});
    var jq = $(html).addClass(this.owner()).addClass(this.type());
    var act = this.action();
    if (act) {
      var last = jq.find('td:last');
      last.click(act).addClass('link');
    }
    return jq;
  },
  brief: function() {
    switch(this.type()) {
      case 'function':
        return '*';
      case 'undefined':
        return 'undefined';
      default:
        return this.value() + "";
    }
  },
  full: function() {
    return this.value().toString();
  },
  action: function() {
    var b = this;
    switch(this.type()) {
      case 'string':
        return function() {b.browse();};
      default:
        if (this.browsable()) {
          return function() {b.browse();};
        }
        break;
    }
  },
  browsable: function() {
    switch (this.value()) {
      case null:
      case undefined:
        return false;
      default:
        return this.type() in {'function': true, 'object': true};
    }
  }
};

//end CGD.naked
}());
