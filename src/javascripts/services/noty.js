angular
  .module('slim')
  .service('Noty', Noty);
  
function Noty() {
  this.displayNotes = function(message, type, layout) {
    $('.notes').noty({
      text: message,
      theme: 'bootstrapTheme',
      type: type,
      layout: layout || 'top',
      maxVisible: 3,
      killer: true,
      animation: {
        open: 'animated fadeInDown',
        close: 'animated fadeOutUp'
      },
      timeout: 399000,
      progressBar: true,
      template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>'
    });
  };

  this.displayDialogs = (message, confirmed, canceled) => {
    $('.notes').noty({
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
        {addClass: 'btn btn-sm btn-primary', text: 'Delete', onClick: $noty => {
            $noty.close();
            confirmed();
          }
        },
        {addClass: 'btn btn-sm btn-danger', text: 'Cancel', onClick: $noty => {
            $noty.close();
            canceled();
          }}
      ]
    });
  };

  this.clearQueue = () => {
    $.noty.clearQueue();
  };

  this.closeAll = () => {
    $.noty.closeAll();
  };
};