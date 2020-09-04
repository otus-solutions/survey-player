describe('otusSurveyError component', function () {
  let Mock = {};
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

  it('check controller', function () {
    expect(controller).toBeDefined();
  });

  it('methods should defined', function () {
    expect(controller.$onInit).toBeDefined();
  });

  describe('$onInit method Suite Test', function () {

    it('onInit method should not set message in case callback address exists', function () {
      spyOn(Injections.PlayerService, "hasCallbackAddress").and.returnValue(true);
      controller.$onInit();
      expect(Injections.PlayerService.hasCallbackAddress).toHaveBeenCalledTimes(1);
      expect(controller.message).not.toBeDefined();
    });

    it('onInit method should set message in case callback address does not exists', function () {
      spyOn(Injections.PlayerService, "hasCallbackAddress").and.returnValue(false);
      controller.$onInit();
      expect(Injections.PlayerService.hasCallbackAddress).toHaveBeenCalledTimes(1);
      expect(controller.message).toBeDefined();
    });

  });

});
