describe('otusSurveyConfirmationParticipant component', function () {
  let Mock = {};
  let Injections = [];
  let controller = {};

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function ($controller, $injector) {
      Injections.$sce = $injector.get('$sce');
      Injections.$state = $injector.get('$state');
      Injections.STATE = $injector.get('STATE');
      Injections.PlayerService = $injector.get('otusjs.player.core.player.PlayerService');

      controller = $controller('otusSurveyConfirmationParticipantCtrl', Injections);
    });

    _mockInitialize();
  });

  it('check controller', function () {
    expect(controller).toBeDefined();
  });

  it('methods should defined', function () {
    expect(controller.$onInit).toBeDefined();
    expect(controller.play).toBeDefined();
    expect(controller.stop).toBeDefined();
  });

  it('onInit method should set page text in case not FINALIZED activity', function () {
    _mockActivity('SAVED');
    spyOn(Injections.PlayerService, 'getCurrentSurvey').and.returnValue(Mock.activity);
    controller.$onInit();
    expect(controller.participantName).toBeDefined();
  });

  it('onInit method should call PlayService stop method in case FINALIZED activity', function () {
    _mockActivity('FINALIZED');
    spyOn(Injections.PlayerService, 'getCurrentSurvey').and.returnValue(Mock.activity);
    _check_stop_method_call(controller.$onInit, 'ALREADY_FINALIZED');
    expect(controller.participantName).not.toBeDefined();
  });

  it('play method should call $state go method', function () {
    spyOn(Injections.$state, 'go');
    controller.play();
    expect(Injections.$state.go).toHaveBeenCalledWith(Injections.STATE.BEGIN);
  });

  it('stop method should call PlayService stop and setReasonToFinishActivity methods', function () {
    _check_stop_method_call(controller.stop, 'IS_NOT_ME');
  });

  function _check_stop_method_call(controllerMethod, reasonKey){
    spyOn(Injections.PlayerService, 'getConstants').and.returnValue(Mock.PLAYER_SERVICE_CONSTANTS);
    spyOn(Injections.PlayerService, 'stop');
    spyOn(Injections.PlayerService, 'setReasonToFinishActivity').and.callThrough();
    spyOn(Injections.$state, 'go');
    controllerMethod();
    expect(Injections.PlayerService.stop).toHaveBeenCalledTimes(1);
    expect(Injections.PlayerService.setReasonToFinishActivity).toHaveBeenCalledTimes(1);
    expect(Injections.PlayerService.setReasonToFinishActivity).toHaveBeenCalledWith(Mock.PLAYER_SERVICE_CONSTANTS.REASONS_TO_LIVE_PLAYER[reasonKey]);
    expect(Injections.$state.go).toHaveBeenCalledWith(Injections.STATE.PARTICIPANT_FINISH);
  }

  function _mockInitialize(){
    Mock.PLAYER_SERVICE_CONSTANTS = {
      REASONS_TO_LIVE_PLAYER: {
        IS_NOT_ME: {}
      }
    };
  }

  function _mockActivity(lastStatus){
    Mock.activity = {
      surveyForm: {acronym: 'ABC'},
      participantData: {name: 'Joao'},
      statusHistory: {
        getLastStatus: function() { return { name: lastStatus}; }
      },
      getName: function () { return ''; }
    }
  }

});
