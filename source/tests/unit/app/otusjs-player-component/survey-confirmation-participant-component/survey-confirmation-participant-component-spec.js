describe('otusSurveyConfirmationParticipant component', function () {
  let Mock = {};
  let Injections = [];
  let controller = {};

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function ($controller, $injector) {
      _mockInitialize();

      Injections.$sce = $injector.get('$sce');
      Injections.$state = $injector.get('$state');
      Injections.STATE = $injector.get('STATE');
      Injections.PlayerService = $injector.get('otusjs.player.core.player.PlayerService');

      controller = $controller('otusSurveyConfirmationParticipantCtrl', Injections);
    });

  });

  it('check controller', function () {
    expect(controller).toBeDefined();
  });

  it('methods should defined', function () {
    expect(controller.$onInit).toBeDefined();
    expect(controller.play).toBeDefined();
    expect(controller.stop).toBeDefined();
  });

  it('onInit method should set messaged in case callback address exists', function () {
    _mockActivity(0);
    spyOn(Injections.PlayerService, 'getCurrentSurvey').and.returnValue(Mock.activity);
    controller.$onInit();
    expect(controller.message).toBeDefined();
  });

  it('onInit method should call PlayService stop method in case callback address does not exists', function () {
    _mockActivity(1);
    spyOn(Injections.PlayerService, 'getCurrentSurvey').and.returnValue(Mock.activity);
    _check_stop_method_call(controller.$onInit, 'ALREADY_FINALIZED');
    expect(controller.message).not.toBeDefined();
  });

  it('play method should call $state.go', function () {
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

  function _mockActivity(numFinalizedStatus){
    let arr = [];
    for(let i=0; i < numFinalizedStatus; i++){
      arr.push({});
    }
    Mock.activity = {
      surveyForm: {acronym: ''},
      participantData: {name: ''},
      statusHistory: {
        getFinalizedRegistries: function() { return arr; }
      },
      getName: function () { return ''; }
    }
  }

});
