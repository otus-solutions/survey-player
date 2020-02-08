(function () {
  'use strict';

  angular
    .module('otusjs.player.component')
    .component('otusPlayerCommander', {
      template:'<md-toolbar hide-gt-xs layout="row" flex layout-align="center center"><span flex="5"></span><md-button id="previousQuestion" class="md-fab md-warn md-mini" aria-label="Voltar" ng-click="$ctrl.goBack()" ng-disabled="$ctrl.isGoBackDisabled"><md-icon>arrow_drop_up</md-icon><md-tooltip md-direction="bottom">Voltar</md-tooltip></md-button><span flex="5"></span><md-button id="cancelActivity" class="md-fab md-raised md-mini" aria-label="Cancelar" ng-click="$ctrl.stop()"><md-icon md-font-set="material-icons">close</md-icon><md-tooltip md-direction="bottom">Cancelar</md-tooltip></md-button><span flex="5"></span><md-button id="saveActivity" class="md-fab md-accent md-mini" aria-label="Salvar" ng-click="$ctrl.pause()"><md-icon md-font-set="material-icons">save</md-icon><md-tooltip md-direction="bottom">Salvar</md-tooltip></md-button><span flex="5"></span><md-button id="nextQuestion" class="md-fab md-warn md-mini" aria-label="Avançar" ng-click="$ctrl.goAhead()" ng-disabled="$ctrl.isGoAheadDisabled"><md-icon>arrow_drop_down</md-icon><md-tooltip md-direction="bottom">Avançar</md-tooltip></md-button><span flex="5"></span></md-toolbar><div hide-xs layout-padding layout="column" flex layout-align="space-around center" style="position: fixed;"><md-button id="previousQuestion" class="md-fab md-warn md-mini" aria-label="Voltar" ng-click="$ctrl.goBack()" ng-disabled="$ctrl.isGoBackDisabled"><md-icon md-font-set="material-icons">arrow_drop_up</md-icon><md-tooltip md-direction="bottom">Voltar</md-tooltip></md-button><span flex="5"></span><md-button id="cancelActivity" class="md-fab md-raised md-mini" aria-label="Cancelar" ng-click="$ctrl.stop()"><md-icon md-font-set="material-icons">close</md-icon><md-tooltip md-direction="bottom">Cancelar</md-tooltip></md-button><span flex="5"></span><md-button id="saveActivity" class="md-fab md-accent md-mini" aria-label="Salvar" ng-click="$ctrl.pause()"><md-icon md-font-set="material-icons">save</md-icon><md-tooltip md-direction="bottom">Salvar</md-tooltip></md-button><span flex="5"></span><md-button id="nextQuestion" class="md-fab md-warn md-mini" aria-label="Avançar" ng-click="$ctrl.goAhead()" ng-disabled="$ctrl.isGoAheadDisabled"><md-icon md-font-set="material-icons">arrow_drop_down</md-icon><md-tooltip md-direction="bottom">Avançar</md-tooltip></md-button><span flex="5"></span></div>',
      controller: Controller,
      bindings: {
        onGoAhead: '&',
        onGoBack: '&',
        onPause: '&',
        onStop: '&'
      }
    });

  Controller.$inject = [
    '$q',
    '$mdDialog',
    '$scope',
    '$document',
    '$element'
  ];

  function Controller($q, $mdDialog, $scope, $document, $element) {
    var SAVE_TITLE = 'Salvar Atividade';
    var SAVE_CONTENT = 'Você tem certeza que deseja salvar a atividade?';
    var CANCEL_TITLE = 'Cancelar Atividade';
    var CANCEL_CONTENT = 'Todos os dados, não salvos, serão perdidos. Você tem certeza que deseja cancelar?';

    var self = this;
    var pressedControl = false;

    /* Public methods */
    self.goBack = goBack;
    self.goAhead = goAhead;
    self.pause = pause;
    self.stop = stop;
    self.remove = remove;
    self.$onInit = onInit;
    self.$postLink = postLink;

    function onInit() {
      $scope.$parent.$ctrl.playerCommander = self;
    }

    function postLink() {
      shortcutAction();
    }

    function goAhead() {
      self.onGoAhead();
    }

    function goBack() {
      self.onGoBack();
    }

    function pause() {
      confirmDialog(SAVE_TITLE, SAVE_CONTENT).then(
        function () {
          self.onPause();
        });
    }

    function stop() {
      confirmDialog(CANCEL_TITLE, CANCEL_CONTENT).then(
        function () {
          self.onStop();
        });
    }

    function remove() {
      $element.remove();
    }

    function shortcutAction() {
      $(document).unbind('keydown').bind('keydown', function (event) {
        switch (event.key) {
          case 'Control':
            {
              pressedControl = true;
              break;
            }
          case 'ArrowLeft':
            {
              if (pressedControl) {
                event.preventDefault();
                $element.find('#previousQuestion').focus();
                self.goBack();
                $scope.$apply();
              }
              break;
            }
          case 'ArrowRight':
            {
              if (pressedControl) {
                event.preventDefault();
                $element.find('#nextQuestion').focus();
                self.goAhead();
                $scope.$apply();
              }
              break;
            }
          case 'End':
            {
              if (pressedControl) {
                $element.find('#cancelActivity').focus();
                self.stop();
              }
              break;
            }
          case 'Home':
            {
              if (pressedControl) {
                $element.find('#saveActivity').focus();
                self.pause();
              }
              break;
            }
          default:
            return;
        }
      });

      $(document).bind("keyup", function (event) {
        if (event.which === 17) {
          pressedControl = false;
          return false;
        }
      });
    }

    function confirmDialog(title, content) {
      var deferred = $q.defer();
      $mdDialog.show($mdDialog.confirm()
        .title(title)
        .textContent(content)
        .ariaLabel('Confirmar ação de atalho:' + title)
        .ok('Ok')
        .cancel('Cancelar')
      ).then(function () {
        deferred.resolve();
      }, function () {
        deferred.reject();
      });
      return deferred.promise;
    }

  }
}());
