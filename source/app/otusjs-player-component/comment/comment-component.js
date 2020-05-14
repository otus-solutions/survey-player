(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusComment', {
      templateUrl: 'app/otusjs-player-component/comment/comment-template.html',
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
    self.update = update;
    self.clear = clear;
    self.$onInit = onInit;

    function onInit() {
      self.comment = CurrentItemService.getFilling(self.itemData.templateID).comment;
      self.otusQuestion.comment = self;
    };

    function update() {
      self.onUpdate({
        valueType: 'comment',
        value: self.comment
      });
    };

    function clear() {
      CurrentItemService.getFilling(self.itemData.templateID).comment = "";
      delete self.comment;
    };
  }

})();
