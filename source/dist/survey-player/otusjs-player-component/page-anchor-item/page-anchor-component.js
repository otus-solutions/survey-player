(function() {
    'use strict';

    angular
        .module('otusjs.player.component')
        .component('otusPageAnchor', {
            template:'<span id=page-anchor class=anchor>anchor</span>',
            controller: AnchorController,
            bindings: {
                id: '<'
            }
        });

    AnchorController.$inject = [
        '$element',
        'PageAnchorService'
    ];

    function AnchorController($element, PageAnchorService) {
        var self = this;

        self.$onInit = function() {
            $element.attr('tabindex', -1);
            PageAnchorService.anchorRegistry($element);
        };
    }

}());
