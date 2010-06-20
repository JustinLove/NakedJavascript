new CGD.Module('script/njs', function(m) {
  m.enqueue("style/naked", 'text/css');

  m.under('jquery/', function(m) {
    m.enqueue("./themes/base/ui.all", 'text/css');

    m.require('./jquery-1.3.2');
    $.ready();
    m.require('./jquery.dimensions');
    m.require('./ui.core');
    m.require('./ui.draggable');
    m.require('./ui.droppable');
    m.require('./ui.resizable');
    m.require('./ui.dialog');
    m.require('./jquery.chili-2.2');
    m.require('./recipes');
    m.require('./jquery.editinplace');
  });

  m.under('cgd/', function(m) {
    m.require('./debug');
    m.require('./js');
    m.require('./html');
  });

  m.require('./naked'); 
});

