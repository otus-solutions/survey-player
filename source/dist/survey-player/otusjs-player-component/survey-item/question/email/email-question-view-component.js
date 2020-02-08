(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusEmailQuestionView', {
      template:'<md-content layout-padding><div layout="row"><md-input-container md-no-float class="md-block" flex-gt-sm="45"><md-icon class="material-icons">email</md-icon><input name="email" type="email" ng-model="$ctrl.answer" ng-change="$ctrl.update()" placeholder="email@email.com" aria-label="{{$ctrl.ariaLabel()}}" ng-disabled="$ctrl.view"></md-input-container></div></md-content>',
      controller: "otusEmailQuestionViewCtrl as $ctrl",
      bindings: {
        itemData: '<'
      }
    }).controller("otusEmailQuestionViewCtrl", Controller);

  Controller.$inject = [];

  function Controller() {
    var self = this;

    self.view = true;

    self.$onInit = function() {
      self.answer = self.itemData.data.answer.value;
    };

    self.ariaLabel = function() {
      return self.itemData.label.ptBR.plainText;
    };


  }
}());
