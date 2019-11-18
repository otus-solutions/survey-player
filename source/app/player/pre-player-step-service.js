(function () {
  'use strict';

  angular
    .module('otusjs.player.standalone')
    .service('PrePlayerStepService', Service);

  Service.$inject = [
    '$q',
    'otusjs.player.core.player.PlayerService',
    'SurveyItemDatasourceService',
    'otusjs.player.data.activity.ActivityFacadeService',
    'FileUploadDatasourceService',
    'StaticVariableDataSourceService'
  ];

  function Service($q, PlayerService, SurveyItemDatasourceService, ActivityFacadeService, FileUploadDatasourceService, StaticVariableDataSourceService) {
    var self = this;
    var defer = $q.defer();

    /* Public methods */
    self.beforeEffect = beforeEffect;
    self.effect = effect;
    self.afterEffect = afterEffect;
    self.getEffectResult = getEffectResult;

    function beforeEffect(pipe, flowData) { }

    function effect(pipe, flowData) {
      var hardBlockingPromises = [
        SurveyItemDatasourceService.setupDatasources(ActivityFacadeService.getCurrentSurvey().getSurveyDatasources()),
        FileUploadDatasourceService.setupUploader(),
        //another promise to solve before unblock phase
      ];

      var softBlockingPromises = [
        StaticVariableDataSourceService.setup(ActivityFacadeService)
      ];

      PlayerService.registerHardBlocker($q.all(hardBlockingPromises));
      PlayerService.registerSoftBlocker($q.all(softBlockingPromises));
    }

    function afterEffect(pipe, flowData) { }

    function getEffectResult(pipe, flowData) {
      return flowData;
    }
  }
})();
