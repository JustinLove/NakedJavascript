// Creative Commons Attribution-Share Alike 3.0 Unported Licence
// http://creativecommons.org/licenses/by-sa/3.0/

CGD.TEST = CGD.TEST || {};
CGD.TEST.njs = function () {
  var t = arguments.callee;
  t.data.victim = document.getElementById('victim').childNodes[0];
  CGD.browser('data', t).browse({title: 'Test & Credits', position: 'right'});
  CGD.browser('playground', t.data).browse();
  //CGD.browser('nodeValue', document.getElementById('victim').childNodes[0]).browse();
  //CGD.browser('body', god.document).browse();
};
CGD.TEST.njs.data = {
  jQuery: "http://jquery.com",
  'jQuery.ui': "http://ui.jquery.com",
  chili: "http://noteslog.com/chili/",
  editInPlace: "http://davehauenstein.com/blog/archives/28",
  CGD: CGD,
  nakedjs: CGD.browser,
  god: CGD.god,
  playground: {
    n: 42,
    s: "blarg",
    b: "",
    f: function(x, y) {return x + y;},
    x: null,
    u: undefined,
    a: [1, 2, 3]
  },
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
