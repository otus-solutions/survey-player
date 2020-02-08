(function() {
    'use strict';

    angular
        .module('otusjs.player.component')
        .component('otusMiscItem', {
            template:'<div ng-if="$ctrl.isImageItem()" layout="column" layout-align="center center" layout-padding><otus-image-item item-data="$ctrl.itemData"></otus-image-item></div><div ng-if="$ctrl.isTextItem()" layout="column" layout-padding><otus-text-item item-data="$ctrl.itemData"></otus-text-item></div>',
            controller: OtusMiscItemController,
            bindings: {
                itemData : '<'
            }
        });

    function OtusMiscItemController() {
        var self = this;

        self.isImageItem = isImageItem;
        self.isTextItem = isTextItem;

        function isImageItem() {
            return self.itemData.objectType === 'ImageItem' ? true : false;
        }

        function isTextItem() {
            return self.itemData.objectType === 'TextItem' ? true : false;
        }

        self.$onInit = function() {};
    }

})();
