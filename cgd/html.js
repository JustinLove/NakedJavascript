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

