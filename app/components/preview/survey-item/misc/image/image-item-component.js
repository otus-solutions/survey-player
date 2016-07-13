(function() {
    'use strict';

    angular
        .module('otus.component.preview')
        .component('otusImageItem', {
            templateUrl: 'app/components/preview/survey-item/misc/image/image-item-template.html',
            controller: ImageItemController,
            bindings: {
                itemData : '<'
            }
        });

    function ImageItemController() {
        var self = this;

        self.$onInit = function() {};
    }

})();
