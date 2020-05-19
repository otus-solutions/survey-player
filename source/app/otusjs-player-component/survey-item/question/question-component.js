(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusQuestion', {
      templateUrl: 'app/otusjs-player-component/survey-item/question/question-component-template.html',
      controller: OtusQuestionController,
      bindings: {
        itemData: '<',
        onUpdate: '&',
        onClear: '&'
      },
      require: {
        otusSurveyItem: '^otusSurveyItem'
      }
    });

  OtusQuestionController.$inject = [
    'otusjs.player.core.renderer.TagComponentBuilderService',
    'otusjs.player.data.activity.CurrentItemService'
  ];

  function OtusQuestionController(TagComponentBuilderService, CurrentItemService) {
    var self = this;

    var commentButtonData = {
      'true': {
        icon: 'visibility',
        tooltip: 'Ocultar Comentário'
      },
      'false': {
        icon: 'visibility_off',
        tooltip: 'Mostrar Comentário'
      }
    };

    self.$onInit = onInit;
    self.setError = setError;
    self.update = update;
    self.forceAnswer = forceAnswer;
    self.clear = clear;
    self.clearAnswer = clearAnswer;
    self.clearMetadataAnswer = clearMetadataAnswer;
    self.clearCommentAnswer = clearCommentAnswer;
    self.isAccept = isAccept;
    self.showingComment = false;
    self.commentButtonData = commentButtonData.false;
    self.hasMetadata = hasMetadata;
    self.swapCommentVisibility = swapCommentVisibility;

    function onInit() {
      self.template = TagComponentBuilderService.createTagElement(self.itemData.objectType);
      self.otusSurveyItem.questionComponent = self;
      self.filling = CurrentItemService.getFilling(self.itemData.templateID) || {};
      self.answer = CurrentItemService.getFilling(self.itemData.templateID).answer || {};
      self.metadata = CurrentItemService.getFilling(self.itemData.templateID).metadata || {};
      self.comment = CurrentItemService.getFilling(self.itemData.templateID).comment || {};
      self.menuComponent = {};
      self.menuComponent.error = false;
      self.showingComment = false;
      self.commentButtonData = commentButtonData.false;

      setError();
    }

    function update(prop, value) {
      self.onUpdate({
        valueType: prop,
        value: value
      });
    }

    function forceAnswer(value) {
      self.onUpdate({
        valueType: 'forceAnswer',
        value: value
      });
    }

    function clear(value) {
      if (value) {
        if (value === 'answer') {
          self.clearAnswer();
          self.clearMetadataAnswer();
        } else if (value === 'comment') {
          self.clearCommentAnswer();
        }
      }
    }

    function clearAnswer() {
      self.answer.clear();
    }

    function clearMetadataAnswer() {
      self.metadata.clear();
    }

    function clearCommentAnswer() {
      self.comment.clear();
    }

    function setError(error) {
      self.menuComponent.error = !!self.filling.forceAnswer;

      if (!self.filling.forceAnswer && error && self.itemData.isQuestion()) {
        self.menuComponent.error = Object.keys(self.itemData.fillingRules.options).every(_canBeIgnored(error));
      }
    }

    function isAccept() {
      return self.itemData.fillingRules.options.accept !== undefined;
    }

    function _canBeIgnored(error) {
      return function (validator) {
        return self.itemData.fillingRules.options[validator].data.canBeIgnored || !error[validator];
      }
    }

    function hasMetadata(){
      return (self.itemData.metadata.options.length > 0);
    }

    function swapCommentVisibility() {
      self.showingComment = !self.showingComment;
      self.commentButtonData = commentButtonData[self.showingComment];
    }
  }
})();
