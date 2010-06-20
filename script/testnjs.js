// Creative Commons Attribution-Share Alike 3.0 Unported Licence
// http://creativecommons.org/licenses/by-sa/3.0/

new CGD.Module('script/testnjs', function(m) {
  m.enqueue('style/test', 'text/css');
  m.require('script/njs');
});

CGD.TEST = CGD.TEST || {};
CGD.TEST.njs = function () {
  var t = arguments.callee;
  t.data.victim = document.getElementById('victim').childNodes[0];
  t.browsers = [];
  t.browsers[0] = CGD.browser('data', t).browse({title: 'Test & Credits', position: 'right'});
  t.browsers[1] = t.browsers[0].browsers['playground'].browse({position: 'left'});
  //t.browsers[2] = CGD.browser('u', t.browsers[1].browsers).browse({position: 'left'});
  //CGD.browser('nodeValue', document.getElementById('victim').childNodes[0]).browse();
  //CGD.browser('body', god.document).browse();
};
CGD.TEST.njs.data = {
  jQuery: "http://jquery.com",
  'jQuery.ui': "http://ui.jquery.com",
  chili: "http://noteslog.com/chili/",
  editInPlace: "http://davehauenstein.com/blog/archives/28",
  god: CGD.god,
  CGD: CGD,
  nakedjs: CGD.browser,
  tester: CGD.TEST.njs,
  playground: {
    n: 42,
    s: "blarg",
    b: "",
    f: function(x, y) {return x + y;},
    x: null,
    u: undefined,
    a: [1, 2, 3],
    o: {},
    h: {toString: function() {return "";}},
    beget: function() {return CGD.JS.object(this);},
    add: function(prop, value) {this[prop] = value;}
  },
  presentation: (function() {
    var cow = {
      name: "Bessie",
      color: "spotted",
      moo: function() {alert("Moo");},
      toString: function() {return this.name + ' the ' + this.color + ' cow';},
      beget: function() {return CGD.JS.object(this);},
      add: function(prop, value) {this[prop] = value;}
    };
    var purpleCow = cow.beget();
    purpleCow.name = "Penny";
    purpleCow.color = "purple";
    var purpleCalf = purpleCow.beget();
    
    var presentation = {
      title: "(Somewhat) Practical uses for Prototypal Inheritance",
      author: "Justin Love",
      email: "slides@JustinLove.name",
      twitter: "@wondible"
    };
    var performance = CGD.JS.object(presentation);
    performance.presenter = "Justin Love";
    performance.date = "2010-01-28";
    performance.event = "JS.chi";
    
    var klass = {a: function(a) {}};
    var instance = CGD.JS.object(klass);
    instance.b = "B";
    
    return {
      cow: cow,
      "Purple Cow": purpleCow,
      "Purple Calf": purpleCalf,
      F: function () {},
      object: CGD.JS.object,
      extend: function(obj, prop, value) {obj[prop] = value;},
      neu: function(constructor) {return new constructor;},
      "Object.prototype": {toString: function() {return "[object Object]";}},
      "class": klass,
      instance: instance,
      presentation: presentation,
      performance: performance
    };
  })(),
  victim: 'to be defined later'
};

CGD.TEST.njs.init = function() {
  $('#debugDiv').toDialog({position: 'bottom', title: 'Debug'});
  CGD.DEBUG.onload();
  CGD.DEBUG.on();
  CGD.DEBUG.p('test');
  CGD.TEST.njs();
};

//testing
$(document).ready(CGD.TEST.njs.init);
