angular
  .module('slim')
  .directive('settings', settings);

settings.$inject = ['$http'];

function settings($http) {
  return {
    restrict: 'E',
    templateUrl: 'templates/partials/settings',
    replace: true,
    scope: {},
    link(scope, element, attrs) {
      const $overlay = $('.overlay');

      scope.currentPrimaryColor = $('.btn-primary').css('background-color').replace(/ /g,'');
      scope.primaryColors = ['rgb(53,142,215)', 'rgb(83,187,179)', 'rgb(131,140,199)', 'rgb(189,198,207)', 'rgb(125,200,85)'];
      scope.changePrimaryColor = color => {
        if (color !== scope.currentPrimaryColor) {
          scope.currentPrimaryColor = color;
          scope.compileCSS();
        }
      };

      scope.currentSidebarImage = $('.sidebar-background').css('background-image').replace(/['"]?\)$/,'').substr(-15);
      scope.images = ['background1.jpg', 'background2.jpg', 'background3.jpg', 'background4.jpg'];
      scope.changeSidebarImage = image => {
        if (image !== scope.currentSidebarImage) {
          scope.currentSidebarImage = image;
          scope.compileCSS();
        }
      };

      scope.currentSidebarColor = $('.sidebar').css('border-color').replace(/ /g,'');
      scope.sidebarColors = ['rgb(120,120,120)', 'rgb(49,112,143)', 'rgb(240,173,78)', 'rgb(169,68,66)']
      scope.changeSidebarColor = color => {
        if (color !== scope.currentSidebarColor) {
          scope.currentSidebarColor = color;
          scope.compileCSS();
        }
      };

      scope.currentFont = $('body').css('font-family').split(',')[0].replace(/"/g,'');
      scope.fonts = ['Segoe UI', 'Athiti', 'Mitr'];
      scope.changeFont = font => {
        if (font !== scope.currentFont) {
          scope.currentFont = font;
          scope.compileCSS();
        }
      };

      scope.compileCSS = () => {
        $overlay.fadeIn(250);

        const data = [];

        data.push(`$brand-primary: ${scope.currentPrimaryColor};`);

        /** Set bootstrap success color to blue (if currentPrimaryColor is green) */
        if (scope.currentPrimaryColor === scope.primaryColors[4]) {
          data.push('$brand-success: #358ed7;');
        }

        if (scope.currentFont !== scope.fonts[0]) {
          data.push(`
            @import url('https://fonts.googleapis.com/css?family=${scope.currentFont}:300,400,500');
            $font-family-base: '${scope.currentFont}', sans-serif;
          `);
        }
        else {
          data.push('$font-family-base: "Segoe UI", sans-serif;');
        }

        data.push(`$sidebar-background-image: url(../images/${scope.currentSidebarImage});`);

        data.push(`$sidebar-background-color: ${scope.currentSidebarColor};`)

        /** Get the new css file and append it to the head */
        $http.post('/compile/css', data)
          .then(() => {
            $('head').append('<link rel="stylesheet" href="css/app.css" type="text/css" />');
            $overlay.fadeOut(250, function() {
              /** Remove the old CSS file */
              $('head').children('link').first().remove();
            });
          })
          .catch(error => {
            throw new Error(`Can not compile new stylesheet file ${error}`);
          });
      };
    }
  }
}