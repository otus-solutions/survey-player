(function() {
    'use strict';

    angular
        .module('otusjs.player.component')
        .component('otusImageItem', {
            template:'<img ng-src={{$ctrl.itemData.url}} layout=row><otus-label class=md-headline item-label=$ctrl.itemData.footer.ptBR.formattedText></otus-label>',
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
