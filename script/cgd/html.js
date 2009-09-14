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
      return enclose.apply(this, nonArray(structure, tag));
    }
  };
  CGD.HTML.from = from;
  
  // The regular value decode.
  function nonArray(structure, tag) {
    if (structure == null) {
      return ["", tag];
    }

    var text = "";
    switch(typeof(structure)) {
      case 'object':
        if (structure instanceof CGD.HTML.NoEscape) {
          return [structure.s, tag];
        }
        CGD.OBJECT.forEach(structure, function(x, key) {
          if (key.substr(0,1) == '_') {
            tag += ' ' + key.substr(1) + '="' + x + '"';
            if (key == '_id' && 
                (tag.substr(0,5) == 'input' || tag.substr(0,6) == 'select')) {
              tag += ' name="' + x + '"';
            }
          } else {
            text += from(x, key);
          }
        });
        return [text, tag];
      case 'number':
        return [structure.toFixed(2), tag];
      default:
        return [CGD.HTML.escape(structure), tag];
    }
  };
  
  function enclose(text, tag) {
    if (tag) {
      if (tag.substr(0,5) == 'input' || tag.substr(0,6) == 'select') {
        tag = tag.replace(/^([\w\.]+)#(\w+)/, '$1 id="$2" name="$2"');
      } else {
        tag = tag.replace(/^([\w\.]+)#(\w+)/, '$1 id="$2"');
      }
      tag = tag.replace(/^(\w+)\.([\w\.]+)/, function(m, name, classes) {
        return name + ' class="' + classes.replace('.', ' ') + '"';
      });
      return "<" + tag + ">" + text + "</" + tag.split(" ")[0] + ">";
    } else {
      return text;
    }
  };
}());

CGD.HTML.escape = function(s) {
  return s.toString().
    replace(/&/g, '&amp;').
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;').
    replace(/\n/g, '<br/>');
};

CGD.HTML.NoEscape = function(s) {
  if (this == window || this == CGD.HTML) {
    return new arguments.callee(s);
  } else {
    this.s = s;
    return this;
  }
};

// shorthand for computed style property
CGD.HTML.prop = function(element, p) {
  var style = document.defaultView.getComputedStyle(element, "");
  if (style) {
    return parseInt(style.getPropertyValue(p), 10);
  } else {
    return 0;
  }
};

CGD.HTML.addClassToIds = function(ids, className) {
  CGD.ARRAY.forEach(ids, function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.className += ' ' + className;
    }
  });
};

// Rest are utility procedures for various tags.

CGD.HTML.select = function(id) {
  return CGD.HTML.from({
    'div.select.control': {
      _id: id + "_control",
      'span.title.label': CGD.STRING.capital(id),
      'select.popup': {
        _id: id,
        'option value="placeholder"': "Placeholder"
      }
    }
  });
};

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
    var name = a.name || a;
    element.text = name;
    select.appendChild(element);
    if (name === initial) {
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
