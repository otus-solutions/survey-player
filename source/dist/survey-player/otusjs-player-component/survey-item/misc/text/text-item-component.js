(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusTextItem', {
      template:'<div><label class=md-headline ng-bind-html=$ctrl.trustedHtml($ctrl.itemData.value.ptBR.formattedText)></label></div>',
      controller: TextItemController,
      bindings: {
        itemData: '<'
      }
    });

  TextItemController.$inject = [
    '$sce'
  ];

  function TextItemController($sce) {
    var self = this;

    self.$onInit = function() {};
    self.trustedHtml = trustedHtml;

    function trustedHtml(html) {
      return $sce.trustAsHtml(html);
    }
  }

})();
