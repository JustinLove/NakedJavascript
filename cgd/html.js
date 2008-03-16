// Creative Commons Attribution-Share Alike 3.0 Unported Licence
// http://creativecommons.org/licenses/by-sa/3.0/

var CGD = window.CGD || {};

CGD.HTML = CGD.HTML || {};

// JSON to HTML.  Could be used like this:
/* 
{body: {
  head: {title: "Title"},
  body: {
    h1: "Title",
    div: {
      p: [
        "paragraph one",
        {b: "bold paragraph two"},
        "paragraph three"
      ]
    }
  }
}}
Of course normally, it's only used to build fragments.
*/
(function() {
  // From itself mostly handles the array special case.
  //   The label of an array is the tag name for each of it's elements.
  //   Normally every label generates exactly one tag.
  function from(structure, tag) {
    var text = "";
    if (CGD.ARRAY.describes(structure)) {
      CGD.ARRAY.forEach(structure, function(x) {
        text += from(x, tag);
      });
      return text;
    } else {
      return enclose(tag, nonArray(structure));
    }
  };
  CGD.HTML.from = from;
  
  // The regular value decode.
  function nonArray(structure) {
    if (structure == null) {
      return "";
    }

    var text = "";
    switch(typeof(structure)) {
      case 'object':
        CGD.OBJECT.forEach(structure, function(x, tag) {
          text += from(x, tag);
        });
        return text;
      case 'number':
        return structure.toFixed(2);
      default:
        return CGD.HTML.escape(structure);
    }
  };
  
  function enclose(tag, text) {
    if (tag) {
      return "<" + tag + ">" + text + "</" + tag + ">";
    } else {
      return text;
    }
  };
}());

CGD.HTML.escape = function(s) {
  return s.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};


// Rest are utility procedures for various tags.

CGD.HTML.select = CGD.HTML.select || {};
CGD.HTML.select.populate = function(selectId, arrayWithNames, initial)
{
  var select = document.getElementById (selectId);

  // remove all children
  while (select.hasChildNodes()) {
    select.removeChild(select.firstChild);
  }

  select.selectedIndex = 0;

  CGD.ARRAY.forEach(arrayWithNames, function(a, i) {
    var element = document.createElement('option');
    element.text = a.name;
    select.appendChild(element);
    if (a.name === initial) {
      select.selectedIndex = i;
    }
  });

  return select;
};

CGD.HTML.check = CGD.HTML.check || {};
CGD.HTML.check.set = function(id, value) {
  var box = document.getElementById(id);
  box.checked = value;
};

CGD.HTML.radio = CGD.HTML.radio || {};
CGD.HTML.radio.set = function(id) {
  var box = document.getElementById(id);
  box.checked = true;
};
