var myApp = angular.module('myApp', ['ui.router', 'credit-cards']);

myApp.filter('yesNo', function () {
  return function (boolean) {
    return boolean ? 'Ok' : 'No';
  }
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
      access: {restricted: true}

    })

    .state("home.canchas",{
      url: "/canchas",
      templateUrl: 'templates/canchas.html',
      controller:'canchaController',
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
      access: {restricted: true}
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