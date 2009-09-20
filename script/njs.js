CGD.JS.require.within('script/njs.js', function() {
  var r = CGD.JS.require;
  r("../style/naked.css");

  r.under('jquery', function() {
    r("themes/base/ui.all.css");

    r('jquery-1.3.2.js');
    r('jquery.dimensions.js');
    r('ui.core.js');
    r('ui.draggable.js');
    r('ui.droppable.js');
    r('ui.resizable.js');
    r('ui.dialog.js');
    r('jquery.chili-2.2.js');
    r('recipes.js');
    r('jquery.editinplace.js');
  });

  r.under('cgd', function() {
    r('debug.js');
    r('js.js');
    r('html.js');
  });

  r('naked.js'); 
});

