describe('otusSurveyErrorComponent_UnitTest_Suite', function () {
  let Injections = [];
  let controller = {};

  beforeEach(function () {
    angular.mock.module('otusjs.player.standalone');

    angular.mock.inject(function ($controller, $injector) {
      Injections.$sce = $injector.get('$sce');
      Injections.PlayerService = $injector.get('otusjs.player.core.player.PlayerService');

      controller = $controller('otusSurveyErrorCtrl', Injections);
    });

  });

  it('check_controller', function () {
    expect(controller).toBeDefined();
  });

  it('methods_should_defined', function () {
    expect(controller.$onInit).toBeDefined();
  });

  describe('onInit_method', () => {
    it('should_set_message', function () {
      spyOn(Injections.PlayerService, "hasCallbackAddress").and.returnValue(false);
      controller.$onInit();
      expect(Injections.PlayerService.hasCallbackAddress).toHaveBeenCalledTimes(1);
      expect(controller.message).toBeDefined();
    });

    it('should_set_showTryAgainButton_as_true_in_case_reasonToFinish_is_UNEXPECTED_ERROR_and_has_not_callback', function () {
      const UNEXPECTED_ERROR = Injections.PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.UNEXPECTED_ERROR;
      spyOn(Injections.PlayerService, "hasCallbackAddress").and.returnValue(false);
      spyOn(Injections.PlayerService, "getReasonToFinishActivity").and.returnValue(UNEXPECTED_ERROR);
      controller.$onInit();
      expect(controller.showTryAgainButton).toBe(true);
    });

    it('should_set_showTryAgainButton_as_false_in_case_reasonToFinish_is_not_UNEXPECTED_ERROR', function () {
      const REASON_TO_LIVE = Injections.PlayerService.getConstants().REASONS_TO_LIVE_PLAYER.UNAUTHORIZED;
      spyOn(Injections.PlayerService, "hasCallbackAddress").and.returnValue(false);
      spyOn(Injections.PlayerService, "getReasonToFinishActivityAndClear").and.returnValue(REASON_TO_LIVE);
      controller.$onInit();
      expect(controller.showTryAgainButton).toBe(false);
    });
  });

  it('goToCallback_method_should_call_PlayerService_goToCallback_method', function () {
    spyOn(Injections.PlayerService, "goToCallback");
    controller.goToCallback();
    expect(Injections.PlayerService.goToCallback).toHaveBeenCalledTimes(1);
  });

  it('reloadSharedURL_method_should_call_PlayerService_reloadSharedURL_method', function () {
    spyOn(Injections.PlayerService, "reloadSharedUrl");
    controller.reloadSharedUrl();
    expect(Injections.PlayerService.reloadSharedUrl).toHaveBeenCalledTimes(1);
  });

});
