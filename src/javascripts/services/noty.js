angular
  .module('slim')
  .service('Noty', Noty);
  
function Noty() {
  var self = this;

  self.displayNotes = function(message, type, layout) {
    noty({
      text: message,
      theme: 'bootstrapTheme',
      type: type,
      layout: layout || 'topCenter',
      maxVisible: 3,
      killer: true,
      animation: {
        open: 'animated medium fadeInDown',
        close: 'animated medium fadeOutUp'
      },
      timeout: 2000,
      template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>'
    });
  };

  self.displayDialogs = function(message, confirmed, canceled) {
    noty({
      type: 'confirm',
      text: message,
      theme: 'bootstrapTheme',
      layout: 'topCenter',
      animation: {
        open: 'animated medium fadeInDown',
        close: 'animated medium fadeOutUp'
      },
      killer: true,
      buttons: [
        {addClass: 'btn btn-sm btn-primary', text: 'Delete', onClick: function($noty) {
            $noty.close();
            confirmed();
          }
        },
        {addClass: 'btn btn-sm btn-danger', text: 'Cancel', onClick: function($noty) {
            $noty.close();
            canceled();
          }}
      ]
    });
  };

  self.clearQueue = function() {
    $.noty.clearQueue();
  };

  self.closeAll = function() {
    $.noty.closeAll();
  };
};