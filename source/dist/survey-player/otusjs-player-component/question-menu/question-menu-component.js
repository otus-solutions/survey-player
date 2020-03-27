(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusQuestionMenu', {
      template:'<md-fab-speed-dial style="position:absolute; bottom:0; right:0; transform: translate(0%, 0%);" md-direction="up" class="md-scale"><md-fab-trigger><md-button class="md-fab md-mini md-raised" aria-label="Limpar Resposta"><md-icon>delete</md-icon><md-tooltip md-direction="down">Limpar</md-tooltip></md-button></md-fab-trigger><md-fab-actions><md-button ng-click="$ctrl.clear(\'comment\')" class="md-fab md-raised md-mini" aria-label="Comentario"><md-icon>comment</md-icon><md-tooltip md-direction="down">Limpar comentário</md-tooltip></md-button><md-button ng-click="$ctrl.clear(\'metadata\')" class="md-fab md-raised md-mini" aria-label="Metadado"><md-icon>label</md-icon><md-tooltip md-direction="down">Limpar metadata</md-tooltip></md-button><md-button ng-click="$ctrl.clear(\'answer\')" class="md-fab md-raised md-mini" aria-label="Questão"><md-icon>question_answer</md-icon><md-tooltip md-direction="down">Limpar resposta</md-tooltip></md-button></md-fab-actions></md-fab-speed-dial><md-button id="accept-button" ng-class="{ \'md-primary\': $ctrl.forceAnswer, \'md-raised\': !$ctrl.forceAnswer }" style="position: absolute; margin-bottom: 4px; right: 50px; bottom: 0" ng-click="$ctrl.showConfirm($event)" ng-show="$ctrl.showAccept()" class="md-fab md-mini md-raised" aria-label="Aceitar resposta"><md-icon>check</md-icon><md-tooltip md-direction="down">Aceitar resposta</md-tooltip></md-button>',
      controller: OtusSurveyMenuController,
      bindings: {
        onClear: '&',
        onAccept: '&'
      },
      require: {
        otusQuestion: '^otusQuestion'
      }
    });

  OtusSurveyMenuController.$inject = [
    '$mdDialog'
  ];

  function OtusSurveyMenuController($mdDialog) {
    var self = this;
    self.forceAnswer = false;

    /* Public methods */
    self.showAccept = showAccept;

    self.$onInit = function () {
      self.otusQuestion.menuComponent = self;
      _enableDialogSettings();
      _disableDialogSettings();

      self.forceAnswer = self.otusQuestion.menuComponent.otusQuestion.filling.forceAnswer;
    };

    self.clear = function (value) {
      self.onClear({
        value: value
      });
    };

    self.showConfirm = function (ev) {
      if (!self.forceAnswer) {
        $mdDialog
          .show(self.enableDialogSettings)
          .then(
            _enableForwardSuccessfulExecution
          );

        return {
          onConfirm: function (callback) {
            self.callback = callback;
          }
        };
      } else {
        $mdDialog
          .show(self.disableDialogSettings)
          .then(
            _disableForwardSuccessfulExecution,
            _disableForwardUnsuccessfulExecution
          );

        return {
          onConfirm: function (callback) {
            self.callback = callback;
          }
        };
      }
    };

    function _enableForwardSuccessfulExecution(response) {
      if (response.action !== 'cancel') {
        self.onAccept({
          value: true
        });
        self.forceAnswer = true;
      }
    }

    function _disableForwardSuccessfulExecution(response) {
      if (response.action !== 'cancel') {
        self.onAccept({
          value: false
        });
        self.forceAnswer = false;
      }
    }

    function _disableForwardUnsuccessfulExecution(error) {
    }

    function _enableDialogSettings() {
      self.enableDialogSettings = {
        parent: angular.element(document.body),
        template:'<div class="md-padding" ng-cloak><md-dialog-content><h2 class="md-title">Questão fora dos limites estabelecidos</h2><p class="md-body-1">Você deseja <b>ignorar a validação</b> e aceitar a resposta?</p></md-dialog-content><md-dialog-actions><md-button class="md-raised" ng-click="controller.cancel({ action: \'cancel\' })">Cancelar</md-button><md-button class="md-raised md-primary" aria-label="Aceitar resposta" ng-click="controller.event({ action: \'true\' })">Aceitar</md-button></md-dialog-actions></div>',
        controller: DialogController,
        controllerAs: 'controller',
        openFrom: '#system-toolbar',
        closeTo: {
          bottom: 0
        }
      };
    }

    function _disableDialogSettings() {
      self.disableDialogSettings = {
        parent: angular.element(document.body),
        template:'<div class="md-padding" ng-cloak><md-dialog-content><h2 class="md-title">Questão fora dos limites estabelecidos</h2><p class="md-body-1">Você deseja <b>remover a ação</b> de aceitar a resposta?</p></md-dialog-content><md-dialog-actions><md-button class="md-raised" ng-click="controller.cancel({ action: \'cancel\' })">Cancelar</md-button><md-button class="md-raised md-primary" aria-label="Aceitar resposta" ng-click="controller.event({ action: \'false\' })">Remover</md-button></md-dialog-actions></div>',
        controller: DialogController,
        controllerAs: 'controller',
        openFrom: '#system-toolbar',
        closeTo: {
          bottom: 0
        }
      };
    }

    function showAccept() {
      return (self.error && self.forceAnswer) || (self.error && self.otusQuestion.isAccept()) || self.forceAnswer;
    }

  }

  function DialogController($mdDialog) {
    var self = this;

    /* Public interface */
    self.cancel = cancel;
    self.event = event;

    function cancel(response) {
      $mdDialog.hide(response);
    }

    function event(response) {
      $mdDialog.hide(response);
    }
  }

})();
