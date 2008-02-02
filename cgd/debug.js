var CGD = window.CGD || {};

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
