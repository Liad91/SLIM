angular
  .module('slim')
  .service('Tooltip', Tooltip);

function Tooltip() {
  this.create = element => {
    $(element).tooltip({
      title() {
        return $(this).attr('title');
      },
      trigger: 'manual'
    });
  };

  this.dispose = element => {
    $(element).attr('data-original-title', '');
    $(element).tooltip('dispose');
  };

  this.show = element => {
    $(element).tooltip('show');
  };

  this.hide = element => {
    $(element).tooltip('hide');
  }

  this.disposeAll = () => {
    $('.tooltip').tooltip('dispose');
  }

  this.array = (tooltips, method) => {
    angular.forEach(tooltips, tooltip => {
      $(tooltip.element).tooltip(method)
    });
  };
};