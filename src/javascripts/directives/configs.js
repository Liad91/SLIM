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
      const defaultColor = 'rgb(0,122,184)';

      let currentColor = $('.sidebar').css('background-color');
      /** Remove white spaces from currentColor */
      currentColor = currentColor.replace(/ /g,'');

      scope.colors = ['rgb(0,122,184)', 'rgb(132,53,51)', 'rgb(70,74,76)', 'rgb(77,57,75)', 'rgb(60,118,61)'];
      
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

      scope.compileCSS = function(color) {
        overlay.fadeIn(250);
        const data = {
          colors: ['$color: ' + color + ';']
        }
        // set bootstrap danger color to blue (if currentColor is red)
        if (color === 'rgb(132,53,51)') {
          data.colors.push('$brand-danger: #0275d8 !default;');
        }
        // set bootstrap success color to blue (if currentColor is green)
        else if (color === 'rgb(60,118,61)') {
          data.colors.push('$brand-success: #0275d8 !default;');
        }
        updateColors(color);
        
        // get the new css file and append it to the head
        $http.post('/compile/css', data)
          .then(function() {
            $('head').append('<link rel="stylesheet" href="css/main.css" type="text/css" />');
            overlay.fadeOut(250, function() {
              $('head').children('link').first().remove();
            });
          })
          .catch(error => {
            throw new Error('Can\'t compile new stylesheet file ' + error);
          });
      };

      /** Set the color to default */
      scope.resetColor = function() {
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