describe('otusSurveyFinishParticipant component', function () {
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

  it('check controller', function () {
    expect(controller).toBeDefined();
  });

  it('methods should defined', function () {
    expect(controller.$onInit).toBeDefined();
  });

  describe('onInit method Suite Test', function () {
    function _callOnInit(reason){
      spyOn(Injections.PlayerService, 'getReasonToFinishActivity').and.returnValue(reason);
      controller.$onInit();
      expect(Injections.PlayerService.getReasonToFinishActivity).toHaveBeenCalledTimes(1);
      expect(controller.message).toBeDefined();
    }

    it('onInit method should set message in case reasonToFinish has secondary text', function () {
      _callOnInit(Mock.REASONS_TO_LIVE_PLAYER.ALREADY_FINALIZED);
    });

    it('onInit method should set longer message in case reasonToFinish has no secondary text', function () {
      _callOnInit(Mock.REASONS_TO_LIVE_PLAYER.IS_NOT_ME);
    });

  });

});
