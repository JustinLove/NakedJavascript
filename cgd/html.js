var CGD = window.CGD || {};

CGD.HTML = CGD.HTML || {};
CGD.HTML.from = function (structure, arrayElements) {
  arrayElements = arrayElements || "p";
  var text = "";
  switch(typeof(structure)) {
    case 'object':
      if (structure.constructor && structure.constructor === Array) {
        for (var i in structure) {
          if (structure.hasOwnProperty(i)) {
            text += "<" + arrayElements + ">" + CGD.HTML.from(structure[i], arrayElements) + "</" + arrayElements + ">";
          }
        }
      } else {
        for (var i in structure) {
          if (structure.hasOwnProperty(i)) {
            text += "<" + i + ">" + CGD.HTML.from(structure[i], arrayElements) + "</" + i + ">";
          }
        }
      }
      return text;
    case 'number':
      return structure.toFixed(2);
    default:
      return structure.toString();
  }
};

CGD.HTML.select = CGD.HTML.select || {};
CGD.HTML.select.populate = function(selectId, arrayWithNames, initial)
{
  var select = document.getElementById (selectId);

  // remove all children
  while (select.hasChildNodes()) {
    select.removeChild(select.firstChild);
  }

  arrayWithNames.each(function(a) {
    var element = document.createElement('option');
    element.innerText = a.name;
    select.appendChild(element);
  });
  
  select.selectedIndex = initial || 0;

  return select;
};

CGD.HTML.radio = CGD.HTML.radio || {};
CGD.HTML.radio.set = function(idPrefix, value) {
  var radio = document.getElementById(idPrefix + value);
  radio.checked = true;
};
