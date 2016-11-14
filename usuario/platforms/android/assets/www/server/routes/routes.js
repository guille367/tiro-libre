angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

/*storage.set('name', 'Max');
storage.get('name').then(function (name){
  console.log(name);
});
*/
  $stateProvider

  // .state('tirolibre', {
  //   url: '/tirolibre',
  //   templateUrl: 'client/templates/default.html'
  // })


  .state('noticias', {
    url: '/noticias',
    templateUrl:'client/templates/noticias.html'
  })

  .state('resetpass', {
    url: '/resetcontrasena',
    cache:false,
    controller:'loginCtroller',
    templateUrl:'client/templates/resetcontrasena.html'
  })
  
  .state('canchas', {
    url: '/canchas',
    controller: 'canchasCtroller',
    templateUrl:'client/templates/canchas.html'
  })
  
  .state('torneos', {
    url: '/torneos',
    cache: false,
    controller:'torneoCtroller',
    templateUrl:'client/templates/torneos.html'
  })
  
  .state('misreservas', {
    url: '/misreservas',
    cache: false,
    controller:'reservasCtroller',
    templateUrl:'client/templates/misreservas.html'
  })

  .state('calendario',{
    url:'/calendario',
    cache: false,
    controller: 'calendarioCtroller',
    templateUrl:'client/templates/calendario.html'
  })
  
  .state('perfil', {
    url: '/perfil',
    controller:'misDatosController',
    templateUrl:'client/templates/perfil.html'
  })

  .state('login', {
    url: '/login',
    controller: 'loginCtroller',
    templateUrl:'client/templates/login.html'
  })

  .state('registro', {
    url: '/registro',
    controller: 'loginCtroller',
    templateUrl:'client/templates/registro.html'
  })

  .state('perfil.misdatos', {
    url:'/misdatos',
        views:{
          'misdatos-tab':{
            templateUrl:'client/templates/misdatos.html',
            controller:'misDatosController'
          }
        }
    })

  .state('perfil.misgrupos', {
    url: '/misgrupos',
    views:{
        'misgrupos-tab':{
            templateUrl:'client/templates/misgrupos.html'
        }
    }
  })
  
  .state('perfil.misequipos', {
    url: '/misequipos',
    views:{
        'misequipos-tab':{
            templateUrl:'client/templates/misequipos.html',
            controller:'misEquiposCtroller'
        }
    }
  })

  .state('contacto', {
    url: '/contacto',
    controller:'contactoCtroller',
    templateUrl:'client/templates/contacto.html'
  })

  if(localStorage.getItem('usuario') !== null)
    $urlRouterProvider.otherwise('/canchas');
  else
    $urlRouterProvider.otherwise('/login');

});