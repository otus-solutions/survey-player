describe('otusSurveyFinishParticipant_component_UnitTest_Suite', function () {
  let Mock = {};
  let Injections = [];
  let controller = {};

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function ($controller, $injector) {
      Injections.$sce = $injector.get('$sce');
      Injections.PlayerService = $injector.get('otusjs.player.core.player.PlayerService');

      controller = $controller('otusSurveyFinishParticipantCtrl', Injections);
    });

    Mock.REASONS_TO_LIVE_PLAYER = Injections.PlayerService.getConstants().REASONS_TO_LIVE_PLAYER;
  });

  it('check_controller', function () {
    expect(controller).toBeDefined();
  });

  it('methods_should_defined', function () {
    expect(controller.$onInit).toBeDefined();
  });

  describe('onInit_method', function () {
    function _callOnInit(reason){
      spyOn(Injections.PlayerService, 'getReasonToFinishActivity').and.returnValue(reason);
      controller.$onInit();
      expect(Injections.PlayerService.getReasonToFinishActivity).toHaveBeenCalledTimes(1);
      expect(controller.message).toBeDefined();
    }

    it('should_set_message_in_case_reasonToFinish_has_secondary_text', function () {
      _callOnInit(Mock.REASONS_TO_LIVE_PLAYER.ALREADY_FINALIZED);
    });

    it('should_set_longer_message_in_case_reasonToFinish_has_no_secondary_text', function () {
      _callOnInit(Mock.REASONS_TO_LIVE_PLAYER.IS_NOT_ME);
    });

  });

  it('reloadSharedUrl_method_should_call_PlayerService_reloadSharedUrl_method', function () {
    spyOn(Injections.PlayerService, 'reloadSharedUrl');
    controller.reloadSharedUrl();
    expect(Injections.PlayerService.reloadSharedUrl).toHaveBeenCalledTimes(1);
  });

});
