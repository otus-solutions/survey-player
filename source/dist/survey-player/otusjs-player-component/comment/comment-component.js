(function() {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusComment', {
      template:'<md-content layout-padding><div layout="row"><md-input-container md-no-float class="md-block" flex><textarea ng-model="$ctrl.comment" ng-change="$ctrl.update()" placeholder="Digite o texto aqui"></textarea></md-input-container></div></md-content>',
      controller: OtusCommentController,
      bindings: {
        itemData: '<',
        onUpdate: '&'
      },
      require: {
        otusQuestion: '^otusQuestion'
      }
    });

  OtusCommentController.$inject = [
    'otusjs.player.data.activity.CurrentItemService'
  ];

  function OtusCommentController(CurrentItemService) {
    var self = this;

    self.$onInit = function() {
        self.comment = CurrentItemService.getFilling(self.itemData.templateID).comment;
        self.otusQuestion.comment = self;
    };

    self.update = function() {
      self.onUpdate({
        valueType: 'comment',
        value: self.comment
      });
    };

    self.clear = function() {
      CurrentItemService.getFilling(self.itemData.templateID).comment = "";
      delete self.comment;
    };
  }

})();
