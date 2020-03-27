(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .directive('otusTextEditor', directive);

  directive.$inject = ['OtusTextEditorWidgetFactory'];

  function directive(OtusTextEditorWidgetFactory) {
    var ddo = {
      scope: {
        placeholder: '@',
        label: '<',
        ariaLabel: '@',
        leftIcon: '@',
        ngModel: '<'
      },
      template:'<div contenteditable="true" edit-placeholder="{{widget.placeholder}}" style="min-height:21px; padding: 3px; margin: 0" flex></div>',
      retrict: 'E',
      link: function linkFunc(scope, element) {
        scope.widget = OtusTextEditorWidgetFactory.create(scope, element);
      }
    };

    return ddo;
  }

}());
