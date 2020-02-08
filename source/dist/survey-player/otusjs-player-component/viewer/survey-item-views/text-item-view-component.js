(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('textItemView', {
      template:'<div layout="row"><span ng-bind-html="$ctrl.item.value.ptBR.formattedText"></span></div>',
      controller: Controller,
      bindings: {
        filters: '=',
        item: '='
      }
    });


  function Controller() {
    var self = this;
    self.$onInit = onInit;

    function onInit() {

    }
  }

}());
