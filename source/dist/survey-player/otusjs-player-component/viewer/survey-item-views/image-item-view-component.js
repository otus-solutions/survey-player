(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('imageItemView', {
      template:'<div layout="row"><md-card><img ng-src="{{$ctrl.item.value}}"><md-card-content><div style="min-height:21px; padding: 3px; margin: 0" flex><span ng-bind-html="$ctrl.item.footer.ptBR.formattedText"></span></div></md-card-content></md-card></div>',
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