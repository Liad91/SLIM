angular
  .module('slim')
  .directive('configs', configs);

configs.$inject = ['$http', 'Popover'];

function configs($http, Popover) {
  return {
    restrict: 'E',
    templateUrl: 'templates/partials/configs',
    replace: true,
    scope: {},
    link(scope, element, attrs) {
      const overlay = $('.overlay');   
      const defaultColor = 'rgb(53,142,215)';

      let currentColor = $('.sidebar').css('background-color');
      /** Remove white spaces from currentColor */
      currentColor = currentColor.replace(/ /g,'');

      scope.colors = ['rgb(53,142,215)', 'rgb(83,187,179)', 'rgb(131,140,199)', 'rgb(189,198,207)', 'rgb(125,200,85)'];
      
      /** Update colors array with new color and check if reset button is needed */
      function updateColors(color) {
        const index = scope.colors.indexOf(color);

        if (scope.lastColor) {
          scope.colors.push(scope.lastColor);
        }
        scope.lastColor = color;
        scope.colors.splice(index, 1);
        scope.reset = color === defaultColor ? false : true;
      }
      updateColors(currentColor);

      scope.compileCSS = color => {
        overlay.fadeIn(250);
        const data = {
          colors: ['$color: ' + color + ';']
        }

        // set bootstrap success color to blue (if currentColor is green)
        if (color === 'rgb(125,200,85)') {
          data.colors.push('$brand-success: #358ed7 !default;');
        }
        updateColors(color);
        
        // get the new css file and append it to the head
        $http.post('/compile/css', data)
          .then(() => {
            $('head').append('<link rel="stylesheet" href="css/main.css" type="text/css" />');
            overlay.fadeOut(250, function() {
              $('head').children('link').first().remove();
            });
          })
          .catch(error => {
            throw new Error(`Can\'t compile new stylesheet file ${error}`);
          });
      };

      /** Set the color to default */
      scope.resetColor = () => {
        scope.compileCSS(defaultColor);
        scope.reset = false;
      };

      /** Popover content */
      const content = `
        <div class="color-box" ng-repeat="color in colors" style="background-color: {{color}}" ng-click="compileCSS(color)"></div>
        <a class="btn btn-sm btn-primary" ng-show="reset" ng-click="resetColor()">Reset</a>
      `;

      element.on('mousedown', () => {
        const hasPopover = $(element).attr('aria-describedby');

        if (!hasPopover){
          Popover.create(element, 'bottom', 'Select Color', content, scope);
        }
      });
    }
  }
}