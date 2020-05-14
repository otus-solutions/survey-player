describe('Static Variable Component Test unit', function () {
  var controller;
  var Injections = [];

  beforeEach(function () {
    angular.mock.module('otusjs.player');
    angular.mock.module('otusjs.player.standalone');
    spyOn(window, 'alasql');

    angular.mock.inject(function (_$controller_, _$injector_) {
      Injections.ActivityFacadeService = _$injector_.get('otusjs.player.data.activity.ActivityFacadeService');

      controller = _$controller_('otusStaticVariableCtrl', Injections);
    });

    spyOn(Injections.ActivityFacadeService, "getWholeTemplateStaticVariableList").and.returnValue([{}]);
    controller.$onInit();
  });

  it('controller method should have a defined controller', function () {
    expect(controller).toBeDefined();
  });

  it('Methods should defined controller', function () {
    expect(controller.$onInit).toBeDefined();
    expect(controller.isLockOpenClose).toBeDefined();
  });

  it('Methods should isLockedOpen execute', function () {
    controller.isLockOpenClose();
    expect(controller.shouldLockOpenClose).toBeFalsy();
  });

  it('Methods should isLockedOpen execute when shouldLockOpenClose is false', function () {
    controller.shouldLockOpenClose = false;
    controller.isLockOpenClose();
    expect(controller.shouldLockOpenClose).toBeTruthy();
  });
});