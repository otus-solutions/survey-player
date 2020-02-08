(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusPhoneQuestionView', {
      template:'<md-content layout-padding><div><md-input-container md-no-float class="md-block" flex-gt-sm="45"><md-icon class="material-icons">phone</md-icon><input type="text" ng-model="$ctrl.answer" ng-change="$ctrl.update()" placeholder="(XX) XXXXX-XXXX" ui-br-phone-number ng-disabled="$ctrl.view"></md-input-container></div></md-content>',
      controller: "otusPhoneQuestionViewCtrl as $ctrl",
      bindings: {
        itemData: '<'
      }
    }).controller("otusPhoneQuestionViewCtrl", Controller);

  Controller.$inject = [];

  function Controller() {
    var self = this;

    self.view = true;

    self.$onInit = function() {
      self.answer = self.itemData.data.answer.value;
    };

  }
}());
