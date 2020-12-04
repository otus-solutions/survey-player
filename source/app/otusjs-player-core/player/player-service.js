(function () {
  'use strict';

  angular
    .module('otusjs.player.core.player')
    .service('otusjs.player.core.player.PlayerService', PlayerService);

  PlayerService.$inject = [
    'otusjs.player.data.activity.ActivityFacadeService',
    'otusjs.player.core.phase.PlayerStartActionService',
    'otusjs.player.core.phase.PlayActionService',
    'otusjs.player.core.phase.AheadActionService',
    'otusjs.player.core.phase.BackActionService',
    'otusjs.player.core.phase.EjectActionService',
    'otusjs.player.core.phase.StopActionService',
    'otusjs.player.core.phase.SaveActionService',
    'SurveyApiService',
    'PLAYER_SERVICE_CORE_CONSTANTS'
  ];

  function PlayerService(
    ActivityFacadeService,
    PlayerStartActionService,
    PlayActionService,
    AheadActionService,
    BackActionService,
    EjectActionService,
    StopActionService,
    SaveActionService,
    SurveyApiService,
    PLAYER_SERVICE_CONSTANTS) {

    const self = this;
    const UNAUTHORIZED_ERROR_STATUS = "UNAUTHORIZED";

    let _component = null;
    let _goBackTo = null;
    let _goingBack = null;
    let _hardBlocker = null;
    let _softBlocker = null;
    let _reasonToFinishActivity = null;

    self.bindComponent = bindComponent;
    self.getItemData = getItemData;
    self.goAhead = goAhead;
    self.goBack = goBack;
    self.setGoBackTo = setGoBackTo;
    self.getGoBackTo = getGoBackTo;
    self.isGoingBack = isGoingBack;
    self.play = play;
    self.setup = setup;
    self.end = end;
    self.eject = eject;
    self.stop = stop;
    self.save = save;
    self.getCurrentSurvey = getCurrentSurvey;
    self.hasCallbackAddress = hasCallbackAddress;
    self.getConstants = getConstants;
    self.getReasonToFinishActivity = getReasonToFinishActivity;
    self.setReasonToFinishActivity = setReasonToFinishActivity;
    self.setReasonToFinishActivityFromErrorStatus = setReasonToFinishActivityFromErrorStatus;
    self.goToCallback = goToCallback;
    self.reloadSharedUrl = reloadSharedUrl;

    /**/
    self.registerHardBlocker = registerHardBlocker;
    self.registerSoftBlocker = registerSoftBlocker;
    self.getHardBlocker = getHardBlocker;
    self.getSoftBlocker = getSoftBlocker;
    self.clearHardBlocker = clearHardBlocker;

    function registerHardBlocker(blocker) {
      _hardBlocker = blocker;
    }

    function registerSoftBlocker(blocker) {
      _softBlocker = blocker;
    }

    function getHardBlocker() {
      return _hardBlocker;
    }

    function getSoftBlocker() {
      return _softBlocker;
    }

    function clearHardBlocker() {
      _hardBlocker = null;
    }

    /**/

    function bindComponent(component) {
      _component = component;
    }

    function getItemData() {
      return ActivityFacadeService.getCurrentItem().getItems();
    }

    function goAhead() {
      AheadActionService.execute();
    }

    function goBack() {
      BackActionService.execute();
    }

    function setGoBackTo(templateID) {
      _goingBack = templateID !== null;
      _goBackTo = templateID;
    }

    function getGoBackTo() {
      return _goBackTo;
    }

    function isGoingBack() {
      return _goingBack;
    }

    function play() {
      PlayActionService.execute();
      if(!hasCallbackAddress()){
        SurveyApiService.setSharedUrl(angular.copy(location.href));
      }
    }

    function setup() {
      PlayerStartActionService.execute();
    }

    function end() {
      _component.goToFinish();
    }

    function eject() {
      EjectActionService.execute();
    }

    function stop() {
      StopActionService.execute();
    }

    function save() {
      SaveActionService.execute();
    }

    function getCurrentSurvey() {
      return ActivityFacadeService.getCurrentSurvey().getSurvey();
    }

    function hasCallbackAddress() {
      return SurveyApiService.hasCallbackAddress();
    }

    function getConstants() {
      return PLAYER_SERVICE_CONSTANTS;
    }

    function getReasonToFinishActivity() {
      return _reasonToFinishActivity;
    }

    function setReasonToFinishActivity(reason) {
      _reasonToFinishActivity = reason;
    }

    function setReasonToFinishActivityFromErrorStatus(errorStatus) {
      _reasonToFinishActivity = (errorStatus === UNAUTHORIZED_ERROR_STATUS ?
        getConstants().REASONS_TO_LIVE_PLAYER.UNAUTHORIZED :
        getConstants().REASONS_TO_LIVE_PLAYER.OFFLINE_ERROR);
    }

    function goToCallback(){
      if(SurveyApiService.getCallbackAddress()){
        location.href = SurveyApiService.getCallbackAddress();
      }
    }

    function reloadSharedUrl(){
      if(SurveyApiService.getSharedUrl()){
        location.href = SurveyApiService.getSharedUrl();
      }
    }
  }
})();
