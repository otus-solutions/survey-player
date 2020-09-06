describe('otusSurveyFinishParticipant component', function () {
  let Injections = [];
  let controller = {};

  const REASON_TO_FINISH_PLAYER_WITH_SECONDARY_TEXT = 'ALREADY_FINALIZED';
  const REASON_TO_FINISH_PLAYER_WITH_NO_SECONDARY_TEXT = 'IS_NOT_ME';

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function ($controller, $injector) {
      Injections.$sce = $injector.get('$sce');
      Injections.PlayerService = $injector.get('otusjs.player.core.player.PlayerService');

      controller = $controller('otusSurveyFinishParticipantCtrl', Injections);
    });
  });

  it('check controller', function () {
    expect(controller).toBeDefined();
  });

  it('methods should defined', function () {
    expect(controller.$onInit).toBeDefined();
  });

  it('onInit method should set message in case reasonToFinish has secondary text', function () {
    _check_onInit_method_call(REASON_TO_FINISH_PLAYER_WITH_SECONDARY_TEXT);
  });

  it('onInit method should set longer message in case reasonToFinish has no secondary text', function () {
    _check_onInit_method_call(REASON_TO_FINISH_PLAYER_WITH_NO_SECONDARY_TEXT);
  });

  function _check_onInit_method_call(reasonKey){
    const reason = Injections.PlayerService.getConstants().REASONS_TO_LIVE_PLAYER[reasonKey];
    spyOn(Injections.PlayerService, 'getReasonToFinishActivity').and.returnValue(reason);
    controller.$onInit();
    expect(controller.message).toBeDefined();
  }

});
