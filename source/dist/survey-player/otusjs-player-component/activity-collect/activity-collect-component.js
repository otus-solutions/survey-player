(function () {

  'use strict';

  angular.module('otusjs.player.component')
    .component('activityCollection', {
      template:'<md-content layout="column" layout-wrap layout-fill flex layout-padding ng-show="!$ctrl.selectedCollection && !$ctrl.fillCollection" ng-init="search"><div layout="row" layout-xs="column" flex layout-align="start center" layout-align-xs="center start" layout-padding ng-show="$ctrl.collections.length"><div layout="row" layout-align="start center"><md-button class="md-icon-button md-mini md-raised md-primary" aria-label="Iniciadas" ng-click="search = true"></md-button><span flex>Coletas iniciadas</span></div><div layout="row" layout-align="start center"><md-button class="md-icon-button md-mini md-raised md-accent" aria-label="Não iniciadas" ng-click="search = false"></md-button><span flex>Coletas não iniciadas</span></div><div layout="row" layout-align="start center" ng-show="search != undefined"><md-button class="md-icon-button md-mini md-warn" ng-click="search = undefined"><md-icon>close</md-icon></md-button><span flex>Limpar filtro</span></div></div><div layout-align="center center" layout="column" flex="100" layout-fill ng-if="!$ctrl.collections.length"><span class="md-display-1">Não há coletas criadas.</span></div><md-grid-list flex="100" ng-if="$ctrl.collections.length" md-cols-xs="1" md-cols-sm="2" md-cols-md="3" md-cols-gt-md="4" md-cols-gt-lg="6" md-row-height-gt-md="3:2" md-row-height-xs="3:1" md-row-height="3:2" md-row-height-gt-xs="2:1" md-row-height-gt-sm="3:2" md-gutter="20px" md-gutter-gt-sm="18px" layout-padding><md-grid-tile class="md-whiteframe-2dp" ng-repeat="collect in $ctrl.collections | filter: {hasInitialized: search} track by $index" md-rowspan="1" md-colspan="1" md-colspan-sm="1" md-colspan-xs="1"><div layout-fill flex><md-toolbar md-scroll-shrink class="md-toolbar-tools" ng-class="collect.hasInitialized ? \'md-primary\' : \'md-accent\'"><md-button class="md-icon-button md-mini" ng-click="$ctrl.removeCollection(collect)"><md-icon>delete_forever</md-icon><md-tooltip md-direction="top">Apagar</md-tooltip></md-button><span class="md-caption" flex ng-if="collect.date">{{ collect.date | date : \'dd/MM/yyyy\'}}</span> <span flex ng-if="!collect.date"></span><md-button class="md-icon-button md-mini" ng-click="$ctrl.saveCollection(collect, $index)" ng-if="collect.hasInitialized"><md-icon>send</md-icon><md-tooltip md-direction="top">Enviar</md-tooltip></md-button><md-button ng-click="$ctrl.initializeCollection(collect)" ng-show="!collect.hasInitialized"><span>INICIAR</span><md-tooltip md-direction="top">Iniciar</md-tooltip></md-button></md-toolbar><div layout-margin layout="column"><span class="md-body-1">{{ collect.observation }}</span> <span class="md-subheader">{{ collect.activities.length }} atividade(s)</span></div><md-grid-tile-footer layout-padding layout-align="end center" flex style="background-color: transparent; color: #000"><md-button class="md-accent" ng-click="$ctrl.fill(collect)" ng-show="collect.hasInitialized" flex="100" layout-fill><span>Preencher</span><md-tooltip md-direction="top">Preencher</md-tooltip></md-button></md-grid-tile-footer></div></md-grid-tile></md-grid-list><span flex="20"></span></md-content><md-content ng-show="$ctrl.selectedCollection" layout="column" flex layout-fill><div layout="row" layout-padding layout-margin flex="100"><md-input-container flex><label>Observação</label> <textarea ng-model="$ctrl.selectedCollection.observation" md-select-on-focus md-maxlength="150" required></textarea></md-input-container></div><div layout="column" layout-fill><md-list flex><div flex layout-align="start center" layout="row" layout-padding><span class="md-subheader" flex>Atividades</span><md-input-container class="md-subheader" style="margin: 20px 22px 0 0"><span ng-if="$ctrl.isChecked()">DESMARCAR</span> <span ng-if="!$ctrl.isChecked()">SELECIONAR</span> TODOS<md-checkbox aria-label="Select All" class="md-primary md-raised" ng-checked="$ctrl.isChecked()" md-indeterminate="$ctrl.isIndeterminate()" ng-click="$ctrl.toggleAll()"></md-checkbox></md-input-container></div><md-list-item class="md-2-line" ng-repeat="activity in $ctrl.allActivities track by $index" ng-click="null"><md-chips layout-padding><md-chip><strong>{{ activity.surveyForm.acronym}}</strong></md-chip></md-chips><div class="md-list-item-text" layout="column"><span class="md-body-1">{{ activity.surveyForm.name }}</span><p class="md-caption">Versão: {{ activity.surveyForm.version }}</p></div><md-checkbox ng-checked="$ctrl.exists(activity, $ctrl.selected)" aria-label="Selecionar" class="md-primary md-hue" ng-click="$ctrl.toggle(activity, $ctrl.selected)"></md-checkbox><md-divider></md-divider></md-list-item></md-list></div></md-content><md-content ng-if="$ctrl.fillCollection" layout="column" flex><div layout="row" layout-padding layout-margin flex layout-align="start center"><md-button class="md-icon-button md-primary" ng-click="$ctrl.fillCollection = null"><md-icon>arrow_back</md-icon></md-button><span class="md-title">{{ $ctrl.fillCollection.observation }}</span></div><div layout="column" layout-padding><md-list flex><md-list-item class="md-2-line" ng-repeat="activity in $ctrl.fillCollection.activities" ng-click="$ctrl.play(activity)"><md-chips layout-padding><md-chip><strong>{{ activity.surveyForm.acronym }}</strong></md-chip></md-chips><div class="md-list-item-text" layout="column"><span class="md-body-1">{{ activity.surveyForm.name }}</span><p class="md-caption">Versão: {{ activity.surveyForm.version }}</p></div><span class="md-caption" flex="20" flex-gt-sm="10">{{ $ctrl.STATUS[activity.statusHistory[activity.statusHistory.length - 1].name] }}</span><md-button class="md-icon-button md-accent" flex-offset="5" ng-click="$ctrl.play(activity)"><md-icon>play_arrow</md-icon></md-button><md-divider></md-divider></md-list-item></md-list></div></md-content>',
      controller: Controller,
      bindings: {
        user: '<',
        activities: '=',
        commands: '=',
        showCommands: '='
      }
    });

  Controller.$inject = [
    'otusjs.model.activity.OfflineActivityCollection',
    '$scope',
    '$mdDialog',
    'CollectIndexedDbService',
    'SurveyApiService',
    '$state',
    'ActivityCollectionRestService',
    'ACTIVITY_STATUS',
    '$mdToast'
  ];

  function Controller(OfflineActivityCollection, $scope, $mdDialog, CollectIndexedDbService, SurveyApiService, $state, ActivityCollectionRestService, ACTIVITY_STATUS, $mdToast) {
    var self = this;

    const PRINCIPAL_THEME = 'md-accent md-raised md-icon-button';
    const OTHER_THEME = 'md-icon-button';
    const POSITION = 'bottom right';
    const DELAY = 3000;
    const MESSAGE_SEND_SUCCESS = 'Coleta foi enviada com sucesso.';
    const MESSAGE_SEND_FAILED = 'Não foi possível enviar a coleta! Tente novamente.';
    const MESSAGE_REMOVE_SUCCESS = 'Coleta foi removida com sucesso.';
    const MESSAGE_REMOVE_FAILED = 'Não foi possível remover a coleta! Tente novamente.';
    const MESSAGE_INITIALIZE = 'Coleta iniciada.';

    const NEW_COLLECTION = {
      title: 'Nova Coleta',
      textContent: 'Informe uma observação sobre a coleta:',
      placeholder: 'Observação',
      required: true,
      ariaLabel: 'Observation',
      ok: 'Criar',
      cancel: 'Cancelar',
      action: newCollection
    };

    const SEND_COLLECTION = {
      title: 'Envio de Coleta',
      textContent: 'Informe seu email para confirmar o envio:',
      placeholder: 'Email',
      required: true,
      ariaLabel: 'Email',
      ok: 'Enviar',
      cancel: 'Cancelar',
      action: _confirmEmail
    };

    const REMOVE_COLLECTION = {
      title: 'Excluir Coleta',
      textContent: 'ATENÇÃO! A exclusão da coleta é permanente. Informe seu email para confirmar a remoção:',
      placeholder: 'Email',
      required: true,
      ariaLabel: 'Email',
      ok: 'Excluir',
      cancel: 'Cancelar',
      action: _confirmEmail
    };

    self.collections = [];


    self.$onInit = onInit;
    self.$onDestroy = onDestroy;
    self.selectCollection = selectCollection;
    self.selected = [];
    self.toggle = toggle;
    self.exists = exists;
    self.isIndeterminate = isIndeterminate;
    self.isChecked = isChecked;
    self.toggleAll = toggleAll;
    self.initializeCollection = initializeCollection;
    self.newCollection = newCollection;
    self.removeCollection = removeCollection;
    self.saveCollection = saveCollection;
    self.fill = fill;
    self.play = play;

    $scope.$watch('$ctrl.showCommands', function (newVal) {
      if (newVal){
        _addButtonADD();
      } else {
        _clear();
      }
    });


    function onInit() {
      self.allActivities = self.activities;
      SurveyApiService.setSelectedCollection();
      self.STATUS = ACTIVITY_STATUS;
      _listCollections();
      _clear();
    }

    function _listCollections() {
      CollectIndexedDbService.getAllCollections(self.user.email).then(function (response) {
        self.collections = OfflineActivityCollection.fromArray(Array.prototype.concat.apply(response), self.user.email);
      });
    }

    function fill(collect) {
      SurveyApiService.setModeOffline();
      SurveyApiService.setSelectedCollection(collect.code);
      self.fillCollection = collect;
    }

    function removeCollection(collect) {
      self.collect = collect.toJSON();
      _showPrompt(REMOVE_COLLECTION).then(function (response) {
        if (response) {
          CollectIndexedDbService.removeCollection(collect.code);
          _listCollections();
          _messages(MESSAGE_REMOVE_SUCCESS)
        } else {
          _messages(MESSAGE_REMOVE_FAILED)
        }
        delete self.collect;
      });
    }

    function play(activity) {
      SurveyApiService.setCallbackAddress(location.origin);
      SurveyApiService.setCurrentActivity(activity.surveyForm.acronym);
      $state.go('/');
    }

    function onDestroy() {
      _clear();
    }

    function selectCollection(collect) {
      self.selectedCollection = collect;
    }

    function initializeCollection(collect) {
      collect.initialize();
      CollectIndexedDbService.updateCollection(collect.toJSON());
      _messages(MESSAGE_INITIALIZE)
    }

    function newCollection() {
      self.selectedCollection = OfflineActivityCollection.fromJson({}, self.user.email);
      self.selectedCollection.code = new ObjectId().toString();
      self.commands.splice(0, self.commands.length);
      _addButtonCANCEL();
      _addButtonSAVE();
    }

    function _addButtonSAVE() {
      self.commands.push({icon: 'save', theme: PRINCIPAL_THEME, action: _save});
    }

    function _addButtonADD() {
      self.commands.push({icon: 'add', theme: PRINCIPAL_THEME, action: newCollection});
    }

    function _addButtonCANCEL() {
      self.commands.push({icon: 'close', theme: OTHER_THEME, action: _cancel});
    }

    function _cancel() {
      _clear();
      _addButtonADD();
    }

    function _clear() {
      self.selected.splice(0, self.allActivities.length);
      delete self.selectedCollection;
      self.commands.splice(0, self.commands.length);
    }

    function _confirmEmail(email) {
      return self.collect.userEmail === email;
    }

    function saveCollection(collect, index) {
      self.collect = collect.toJSON();
      _showPrompt(SEND_COLLECTION).then(function (response) {
        if (response) {
          ActivityCollectionRestService.saveOffline(collect.toJSON()).then(function () {
            self.removeCollection(index);
            _messages(MESSAGE_SEND_SUCCESS);
            _updateIndexedDB();
            onInit();
          }).catch(function () {
            _messages(MESSAGE_SEND_FAILED);
          });
        } else {
          _messages(MESSAGE_SEND_FAILED);
        }
        delete self.collect;
      });
    }

    function _save() {
      try {
        self.selectedCollection.addActivities(self.selected);
        if (self.selectedCollection.activities.length) {
          self.selectedCollection.userEmail = self.user.email;
          self.collections.push(self.selectedCollection);
          CollectIndexedDbService.insertCollection(self.selectedCollection.toJSON());
          _clear();
          _addButtonADD();
          _listCollections();
        }
      } catch (e) {
        throw new Error(e);
      }
    }

    function _updateIndexedDB() {
      CollectIndexedDbService.updateAllCollections(self.collections.map(collect => {
        return collect.toJSON();
      }));
    }

    function _showPrompt(data) {
      if (!data) data = NEW_COLLECTION;
      var confirm = $mdDialog.prompt()
        .title(data.title)
        .textContent(data.textContent)
        .placeholder(data.placeholder)
        .required(data.required)
        .ariaLabel(data.ariaLabel)
        .ok(data.ok)
        .cancel(data.cancel);

      return $mdDialog.show(confirm).then(function (result) {
        return data.action(result);
      }, function () {
        return false;
      });
    }

    function toggle(item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    }

    function exists(item, list) {
      return list.indexOf(item) > -1;
    }

    function isIndeterminate() {
      return (self.selected.length !== 0 &&
        self.selected.length !== self.allActivities.length);
    }

    function isChecked() {
      return self.selected.length === self.allActivities.length;
    }

    function toggleAll() {
      if (self.selected.length === self.allActivities.length) {
        self.selected = [];
      } else if (self.selected.length === 0 || self.selected.length > 0) {
        self.selected = self.allActivities.slice(0);
      }
    }

    function _messages(text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position(POSITION)
          .hideDelay(DELAY)
      );
    }

  }
})();