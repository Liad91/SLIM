angular
  .module('slim')
  .service('Tooltip', Tooltip);

function Tooltip() {
  var self = this;

  self.create = function(element) {
    $(element).tooltip({
      title: function() {
        return $(this).attr('title');
      },
      trigger: 'manual'
    });
  };

  self.dispose = function(element) {
    $(element).attr('data-original-title', '');
    $(element).tooltip('dispose');
  };

  self.show = function(element) {
    $(element).tooltip('show');
  };

  self.hide = function(element) {
    $(element).tooltip('hide');
  }

  self.disposeAll = function() {
    $('.tooltip').tooltip('dispose');
  }

  self.array = function(tooltips, method) {
    angular.forEach(tooltips, function(tooltip) {
      $(tooltip.element).tooltip(method)
    });
  };
};