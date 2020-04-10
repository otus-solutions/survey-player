(function () {

  'use strict';

  angular.module('otusjs.player.component')
    .component('activityCollection', {
      templateUrl: 'app/otusjs-player-component/activity-collect/activity-collect-template.html',
      controller: Controller,
      bindings: {
        user: '<',
        commands: '=',
        showCommands: '=',
        group: '=',
        back: '='
      }
    });

  Controller.$inject = [
    'otusjs.model.activity.GroupOfflineActivityCollection',
    'otusjs.model.activity.OfflineActivityCollection',
    '$scope',
    '$mdDialog',
    'CollectIndexedDbService',
    'SurveyApiService',
    '$state',
    'ActivityCollectionRestService',
    'ACTIVITY_STATUS',
    '$mdToast',
    'SurveyClientService',
    'LoadingScreenService'
  ];

  function Controller(
    GroupOfflineActivityCollection,
    OfflineActivityCollection,
    $scope,
    $mdDialog,
    CollectIndexedDbService,
    SurveyApiService,
    $state,
    ActivityCollectionRestService,
    ACTIVITY_STATUS,
    $mdToast,
    SurveyClientService,
    LoadingScreenService) {
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

    const SEND_COLLECTION_ALL = {
      title: 'Envio de Coletas',
      textContent: 'Informe seu email para confirmar o envio de TODAS as coletas:',
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
    self.oldBack = angular.copy(self.back);
    self.canSend = canSend;


    $scope.$watch('$ctrl.showCommands', function (newVal) {
      if (newVal) {
        _canSyncAllCollections();
        _addButtonSaveAll();
        _addButtonADD();
      } else {
        _clear();
      }
    });

    self.$onDestroy = function () {
      _clear();
    };

    function canSend(collect) {
      return !!(collect.hasInitialized && $scope.$root.online);
    }

    function back() {
      SurveyApiService.exitModeOffline();
      SurveyApiService.setSelectedCollection(null);
      self.fillCollection = null;
      _addButtonSaveAll();
      _addButtonADD();
      self.back = angular.copy(self.oldBack);
    }

    function onInit() {
      _canSyncAllCollections();
      self.STATUS = ACTIVITY_STATUS;
      _clear();
      _restore();
    }

    function _restore() {
      self.selectedCollectionId = SurveyApiService.getSelectedCollection();
      if (self.selectedCollectionId){
          self.group.collections.forEach(function (collection) {
            if (collection.code === self.selectedCollectionId) {
              fill(collection);
            }
          });
      }
    }

    function fill(collect) {
      _clear();
      self.back = back;
      SurveyApiService.setModeOffline();
      SurveyApiService.setSelectedCollection(collect);
      self.fillCollection = collect;
    }

    function removeCollection(collect) {
      self.collect = collect.toJSON();
      _showPrompt(REMOVE_COLLECTION).then(function (response) {
        if (response) {
          CollectIndexedDbService.removeCollection(self.collect.code);
          _messages(MESSAGE_REMOVE_SUCCESS);
          self.group.collections = self.group.collections.filter(function (collection) {
            return collection.code !== self.collect.code;
          });
          !self.group.collections.length ? self.back() : null;
        } else {
          _messages(MESSAGE_REMOVE_FAILED);
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
      self.collectToInitialize = collect;
      self.collectToInitialize.initialize(_updateReadyGeoJSON);

    }

    function _updateReadyGeoJSON(geoJson) {
      _canSyncAllCollections();
      _clear();
      _addButtonSaveAll();
      _addButtonADD();
      if (self.collectToInitialize.geoJson.coordinates === geoJson.coordinates){
        CollectIndexedDbService.updateCollection(self.collectToInitialize.toJSON());
        _messages(MESSAGE_INITIALIZE);
      }
    }

    function newCollection() {
      SurveyClientService.getAllActivities().then(function (activities) {
        self.allActivities = angular.copy(activities);
      });
      let json = {
        userEmail: self.user.email,
        groupId: self.group._id,
        groupObservation: self.group.observation
      };
      self.selectedCollection = OfflineActivityCollection.fromJson(json);

      self.commands.splice(0, self.commands.length);
      _addButtonCANCEL();
      _addButtonSAVE();
    }

    function _addButtonSAVE() {
      self.commands.push({icon: 'save', theme: PRINCIPAL_THEME, action: _save});
    }

    function _addButtonADD() {
      if (!self.fillCollection) self.commands.push({icon: 'add', theme: PRINCIPAL_THEME, action: newCollection});
    }

    function _addButtonCANCEL() {
      self.commands.push({icon: 'close', theme: OTHER_THEME, action: _cancel});
    }

    function _addButtonSaveAll() {
      if (self.collectionsReady && !self.fillCollection) {
        self.commands.push({icon: 'cloud_upload', theme: 'md-raised md-icon-button md-primary', action: _btnSaveAll});
      }
    }

    function _cancel() {
      _clear();
      _addButtonADD();
    }

    function _canSyncAllCollections() {
      let collections = self.group.collections.filter(function (collection) {
        return collection.hasInitialized === true;
      });
      self.collectionsReady = (collections.length === self.group.collections.length) && (self.group.collections.length > 0);
    }

    function _clear() {
      self.selected.splice(0, self.selected.length);
      delete self.selectedCollection;
      self.commands.splice(0, self.commands.length);
    }

    function _confirmEmail(email) {
      return self.collect.userEmail === email;
    }

    function _btnSaveAll() {
      self.collect = {userEmail: self.group.collections[0].userEmail};
      _showPrompt(SEND_COLLECTION_ALL).then(function (response) {
        if (response) {
          LoadingScreenService.start();
          _saveAll();
        }
      });
    }

    function _saveAll() {
      if (self.group.collections.length > 0) {
        var collection = angular.copy(self.group.collections.shift());
        ActivityCollectionRestService.saveOffline(collection.toJSON()).then(function () {
          CollectIndexedDbService.removeCollection(collection.code);
          if (self.group.collections.length === 0) {
            LoadingScreenService.finish();
            _messages(MESSAGE_SEND_SUCCESS);
            self.back();
          } else {
            _saveAll();
          }
        }).catch(function () {
          LoadingScreenService.finish();
          _messages(MESSAGE_SEND_FAILED);
        });
      } else {
        LoadingScreenService.finish();
      }
    }

    function saveCollection(collect) {
      self.collect = collect.toJSON();
      _showPrompt(SEND_COLLECTION).then(function (response) {
        if (response) {
          ActivityCollectionRestService.saveOffline(self.collect).then(function () {
            self.removeCollection(collect);
            _messages(MESSAGE_SEND_SUCCESS);
          }).catch(function () {
            _messages(MESSAGE_SEND_FAILED);
          });
        }

      });
    }

    function _save() {
      try {
        if (self.selected.length && self.selectedCollection.observation) {
          self.selectedCollection.addActivities(self.selected);
          self.selectedCollection.userEmail = self.user.email;
          CollectIndexedDbService.insertCollection(self.selectedCollection.toJSON()).then(function (response) {
            self.group.addCollection(self.selectedCollection);
            _clear();
            _addButtonADD();
          });
        } else {
          if (!self.selectedCollection.observation) _messages('Preencha o campo "Observação".');
          else if (!self.selected.length) _messages('Escolha ao menos uma atividade.');
        }
      } catch (e) {
        throw new Error(e);
      }
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