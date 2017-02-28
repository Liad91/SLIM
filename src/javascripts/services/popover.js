angular
  .module('slim')
  .service('Popover', Popover);

Popover.$inject = ['$compile'];

function Popover($compile) {
  var self = this;

  self.create = function(element, placement, title, content, scope) {
    $(element).popover({
      placement: placement,
      title: title,
      html: true,
      trigger: 'manual',
      content: $compile(content)(scope)
    })
      .on('shown.bs.popover', function() {
        scope.$apply();

        var popover = $('.popover');

        popover.attr('tabindex', '1');
        popover.focus();
        popover.on({
          focusout: function() {
            // remove popover on focusout
            element.attr('aria-describedby', '');
            self.dispose(element);
          },
          keydown: function(e) {
            if (e.which === 27) {
              // remove popover on Esc
              element.attr('aria-describedby', '');
              self.dispose(element);
            }
          }
        })
      })
      .popover('show');
  };

  self.dispose = function(element) {
    $(element).popover('dispose');
  };

  self.disposeAll = function() {
    $('.popover').popover('dispose');
  };
}