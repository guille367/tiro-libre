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
    url: '/resetcontraseña',
    templateUrl:'client/templates/resetcontraseña.html'
  })
  
  .state('canchas', {
    url: '/canchas',
    templateUrl:'client/templates/canchas.html'
  })
  
  .state('torneos', {
    url: '/torneos',
    controller:'miTorneoCtroller',
    templateUrl:'client/templates/torneos.html'
  })
  
  .state('misreservas', {
    url: '/misreservas',
    controller:'misReservasCtroller',
    templateUrl:'client/templates/misreservas.html'
  })

  .state('calendario',{
    url:'/calendario',
    controller: 'calendarioCtroller',
    templateUrl:'client/templates/calendario.html'
  })
  
  .state('perfil', {
    url: '/perfil',
    templateUrl:'client/templates/perfil.html'
  })

  .state('perfilNo', {
    url: '/perfilNo',
    templateUrl:'client/templates/perfilNo.html'
  })
  

  .state('login', {
    url: '/login',
    controller: 'loginCtroller',
    templateUrl:'client/templates/login.html'
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
    templateUrl:'client/templates/contacto.html'
  })

  if(localStorage.getItem('usuario') !== null)
    $urlRouterProvider.otherwise('/canchas');
  else
    $urlRouterProvider.otherwise('/login');

});