angular
  .module('slim')
  .service('Popover', Popover);

Popover.$inject = ['$compile'];

function Popover($compile) {
  this.create = (element, placement, title, content, scope) => {
    $(element).popover({
      placement,
      title,
      html: true,
      trigger: 'manual',
      content: $compile(content)(scope)
    })
      .on('shown.bs.popover', () => {
        scope.$apply();

        const popover = $('.popover');

        popover.attr('tabindex', '1');
        popover.focus();
        popover.on({
          focusout: () => {
            // remove popover on focusout
            element.attr('aria-describedby', '');
            this.dispose(element);
          },
          keydown: e => {
            if (e.which === 27) {
              // remove popover on Esc
              element.attr('aria-describedby', '');
              this.dispose(element);
            }
          }
        })
      })
      .popover('show');
  };

  this.dispose = element => {
    $(element).popover('dispose');
  };

  this.disposeAll = () => {
    $('.popover').popover('dispose');
  };
}