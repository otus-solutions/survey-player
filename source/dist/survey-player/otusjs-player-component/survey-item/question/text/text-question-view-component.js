(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusTextQuestionView', {
      template:'<md-content id="text-question" layout-padding><div layout="row"><md-input-container md-no-float class="md-block" flex><textarea id="textQuestion" ng-class="{lowercase: $ctrl.hasLowerCase, uppercase: $ctrl.hasUpperCase}" ng-model="$ctrl.answer" ng-disabled="$ctrl.view" ng-change="$ctrl.update()" placeholder="Digite o texto aqui"></textarea></md-input-container></div></md-content>',
      controller: "otusTextQuestionViewCtrl as $ctrl",
      bindings: {
        itemData: '<'
      }
    }).controller("otusTextQuestionViewCtrl", Controller);

  Controller.$inject = [];

  function Controller() {
    var self = this;

    self.view = true;

    self.$onInit = function () {
      self.answer = self.itemData.data.answer.value;
    };

  }
}());
