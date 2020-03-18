(function () {

  angular
    .module('otusjs.player.config')
    .config(themeConfiguration);

  themeConfiguration.$inject = ['$mdThemingProvider', '$mdIconProvider'];

  function themeConfiguration($mdThemingProvider, $mdIconProvider) {

    var newLightBlueMap = $mdThemingProvider.extendPalette('light-blue', {
      '500': '#ffffff',
      'contrastDarkColors': ['500', 'A100', 'A400']
    });
    $mdThemingProvider.definePalette('new-light-blue', newLightBlueMap);

    $mdThemingProvider.theme('default')
      .primaryPalette('teal', {
        'default': '700',
        'hue-1': '500',
        'hue-2': '600',
        'hue-3': '800'
      })
      .accentPalette('new-light-blue', {
        'default': 'A700',
        'hue-1': '500',
        'hue-2': 'A100',
        'hue-3': 'A400'
      })
      .warnPalette('red', {
        'default': 'A200',
        'hue-2': 'A100',
        'hue-3': 'A400'
      })
      .backgroundPalette('grey');
    /* 24 is the size default of icons */
    $mdIconProvider.defaultIconSet('app/assets/icons/mdi.svg', 24);
  }

}());
