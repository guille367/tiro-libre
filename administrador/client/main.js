var myApp = angular.module('myApp', ['ui.router', 'bsLoadingOverlaySpinJs', 'bsLoadingOverlay' , 'ui.checkbox', 'credit-cards', 'colorpicker.module', 'kendo.directives', 'ae-datetimepicker', 'ui.bootstrap', 'ngDialog', 'validation.match']);

myApp.filter('yesNo', function () {
  return function (boolean) {
    return boolean ? 'Ok' : 'No';
  }
});


myApp.run(function(bsLoadingOverlayService) {
  bsLoadingOverlayService.setGlobalConfig({
    templateUrl: 'bsLoadingOverlaySpinJs'
  });
});


myApp.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state("home", {
      redirectTo: 'home.index',
      url: "/home",
      templateUrl: 'templates/home.html',
      controller:'profileCtrl',
      access: {restricted: true}
    })

    .state("home.index",{
      url: "/inicio",
      templateUrl: 'templates/index.html',
      controller:'schedulerController',
      access: {restricted: true}

    })

    .state("home.administradores",{
      url: "/administradores",
      templateUrl: 'templates/admin.html',
      controller:'adminController',
      access: {restricted: true}

    })

    .state("home.canchas",{
      url: "/canchas",
      templateUrl: 'templates/canchas.html',
      controller:'canchaController',
      access: {restricted: true}

    })

    .state("home.pagos",{
      url: "/pagos",
      templateUrl: 'templates/pagos.html',
      controller:'pagosController',
      access: {restricted: true}

    })

    .state("home.usuarios",{
      url: "/usuarios",
      templateUrl: 'templates/usuarios.html',
      controller:'usuarioController',
      access: {restricted: true}
    })

    .state("home.torneos",{
      url: "/torneos",
      templateUrl: 'templates/torneos.html',
      controller:'torneoController',
      access: {restricted: true}
    })

    .state("home.configuracion",{
      url: "/configuracion",
      templateUrl: 'templates/configuracion.html',
      controller:'configuracionController',
      access: {restricted: true}
    })
    
    .state("admin", {
      url: "/admin",
      templateUrl: 'templates/admin.html',
      controller: 'loginController',
      access: {restricted: false}
    })  

    .state("login", {
      url: "/login",
      templateUrl: 'templates/login.html',
      controller: 'loginController',
      access: {restricted: false}
    })
    .state("logout", {
      url: "/logout",
      controller: 'logoutController',
      access: {restricted: true}
    })
    .state("register", {
      url: "/register",  
      templateUrl: 'templates/register.html',
      controller: 'registerController',
      access: {restricted: false}
    })

    .state('recover', {
      url: '/recover/:token',
      templateUrl:'templates/recover.html',
      controller: 'loginController',
      access: {restricted: false}
    });

    $urlRouterProvider.otherwise("/home/inicio");
});

myApp.run(function ($rootScope, $location, $state, AuthService) {
  $rootScope.$on('$stateChangeStart',
    function (event, toState, current) {

      if (toState.redirectTo) {
        event.preventDefault();
        $state.go(toState.redirectTo, current)
      }

      AuthService.getUserStatus()
      .then(function(){
        if (toState.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
        }
      });
  });
});

myApp.directive('file', function(){
    return {
        scope: {
            file: '='
        },
        link: function(scope, el, attrs){
            el.bind('change', function(event){
                var files = event.target.files;
                var file = files[0];
                scope.file = file ? file.name : undefined;
                scope.$apply();
            });
            el.bind('fileclear', function(event){
                var files = event.target.files;
                var file = files[0];
                scope.file = file ? file.name : undefined;
                scope.$apply();
            });
        }
    };
});
function canchaController($scope){
    $scope.newCancha = {};
}

