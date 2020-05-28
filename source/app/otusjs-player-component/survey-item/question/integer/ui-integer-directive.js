(function () {
  'use strict';

  angular.module('otusjs.player.component').directive("uiInteger", function () {
    return {
      link: function ($scope, element, attrs, ngModelCtrl) {
        var lastValidValue;

        element.on('keydown', shouldPrintChar);

        function shouldPrintChar(event) {
          var element = angular.element(event.currentTarget);
          var keycode = event.which;
          if (keycode === 9) {
            element.next().focus();
          }
          return (isNumberKey(keycode) || isValidKey(keycode));
        }

        element.on('keyup', formatedInteger);

        function formatedInteger(event) {
          var element = angular.element(event.currentTarget);
          var keycode = event.which;
          var currentValue = element.val();
          var isValidKeyCode = isValidKey(keycode);

          if (currentValue.length === 0) {
            lastValidValue = '';
          } else if (isNumberKey(keycode) || isValidKeyCode) {
            lastValidValue = element.val();
          } else if (!isValidKeyCode) {
            element.val(lastValidValue);
          }
        }

        function isNumberKey(keyCode) {
          return ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105));
        }

        function isValidKey(keyCode) {
          return [
            109,  // minus
            16,   // shift
            8,    // backspace
            36,   // home
            35,   // end
            9,    // tab
            46,   // delete
            17,   // control
            37,   // left
            39    // right
          ].includes(keyCode);
        }
      }
    };
  });

}());
