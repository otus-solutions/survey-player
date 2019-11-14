(function() {
    'use strict';

    angular
        .module('otusjs.player.component')
        .directive('otusButton', directive);

    directive.$inject = ['OtusButtonWidgetFactory'];

    function directive(OtusButtonWidgetFactory) {
        var ddo = {
            scope: {
                click: '<'
            },
            template:'<md-button ng-click=widget.event.click() aria-label={{widget.template.ariaLabel}} class="{{widget.css.class}} {{widget.css.iconButton}}"><md-icon class=material-icons ng-show=widget.template.hasLeftIcon>{{widget.template.leftIcon}}</md-icon>{{widget.template.label}}<md-icon class=material-icons ng-show=widget.template.hasRightIcon>{{widget.template.rightIcon}}</md-icon><md-tooltip md-direction={{widget.template.tooltipDirection}}>{{widget.template.tooltip}}</md-tooltip></md-button>',
            retrict: 'E',
            link: function linkFunc(scope, element, attrs) {
                scope.widget = OtusButtonWidgetFactory.create(scope, attrs, scope.$parent.widget);
            }
        };

        return ddo;
    }

}());
