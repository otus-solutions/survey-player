(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusIntegerQuestionView', {
      template:'<md-content layout-padding><div layout=row><md-input-container md-no-float class=md-block flex-gt-sm=45><input type=number step=1 ng-model=$ctrl.answer ng-change=$ctrl.update() ui-integer placeholder="Insira um valor inteiro" ng-disabled=$ctrl.view></md-input-container><md-input-container class=md-block flex-gt-sm=45><otus-label item-label=$ctrl.itemData.unit></otus-label></md-input-container></div></md-content>',
      controller: "otusIntegerQuestionViewCtrl as $ctrl",
      bindings: {
        itemData: '<'
      }
    }).controller("otusIntegerQuestionViewCtrl", Controller);

  function Controller() {
    var self = this;

    self.view = true;

    self.$onInit = function() {
      self.answer = self.itemData.data.answer.value;
    };

  }
}());
