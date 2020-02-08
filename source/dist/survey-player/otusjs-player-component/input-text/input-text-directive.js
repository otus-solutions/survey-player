(function() {
    'use strict';

    angular
        .module('otusjs.player.component')
        .directive('otusInputText', otusInputText);

    otusInputText.$inject = ['OtusInputTextWidgetFactory'];

    function otusInputText(OtusInputTextWidgetFactory) {
        var ddo = {
            scope: {
                model: '<',
                disabled: '@'
            },
            template:'<md-input-container layout="row"><label>{{widget.template.label}}</label><md-icon class="material-icons" aria-label="{{widget.template.ariaLabel}}" ng-show="widget.template.hasLeftIcon">{{widget.template.leftIcon}}</md-icon><input ng-model="widget.model" type="text" aria-label="{{widget.template.ariaLabel}}"><md-icon class="material-icons" aria-label="{{widget.template.ariaLabel}}" ng-show="widget.template.hasRightIcon">{{widget.template.rightIcon}}</md-icon></md-input-container>',
            retrict: 'E',
            link: function linkFunc(scope, element, attrs) {
                scope.widget = OtusInputTextWidgetFactory.create(scope, attrs, element, scope.$parent.widget || scope.$parent.$parent.childWidget);
            }
        };

        return ddo;
    }

}());
