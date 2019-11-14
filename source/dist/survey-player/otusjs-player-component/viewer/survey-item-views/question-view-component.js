(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('questionView', {
      template:'<div id=answer ng-if=$ctrl.item.hasAnswer layout-fill><p class=md-caption style="color: gray;">Resposta</p><p ng-show=$ctrl.filters.fillingBox>{{$ctrl.item.answer}}</p><p ng-show=!$ctrl.filters.fillingBox>{{$ctrl.item.answer}}</p></div><div id=metadata ng-if=$ctrl.item.hasMetadata layout-fill><p class=md-caption style="color: gray;">Metadado</p><p ng-show=$ctrl.filters.fillingBox ng-bind-html=$ctrl.item.metadata.label.ptBR.formattedText></p></div><div id=comment ng-if=$ctrl.item.hasComment ng-show=$ctrl.filters.comments layout-fill><p class=md-caption style="color: gray;">Comentário</p><p ng-show=$ctrl.filters.fillingBox ng-bind-html=$ctrl.item.comment></p></div>',
      controller: Controller,
      bindings: {
        item: '=',
        filters: '='
      }
    });



  function Controller() {
    var self = this;
    self.$onInit = onInit;


    function onInit() {
    }
  }

}());