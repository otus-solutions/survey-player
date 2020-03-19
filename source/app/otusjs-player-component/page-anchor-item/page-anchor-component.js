(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusPageAnchor', {
      templateUrl: 'app/otusjs-player-component/page-anchor-item/page-anchor-template.html',
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

    self.$onInit = function () {
      $element.attr('tabindex', -1);
      PageAnchorService.anchorRegistry($element);
    };
  }

}());
