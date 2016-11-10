angular.module('app.controllers')

.controller('torneoCtroller',['$scope','$state','torneosService','$ionicLoading','gralFactory','$ionicModal', '$rootScope', 'equiposService','userServices',function($scope,$state,torneosService,$ionicLoading,gralFactory,$ionicModal,$rootScope, equiposService,userServices){

    $scope.torneos = {};
    $scope.torneo = {};
    $scope.equipo = {};
    $scope.checked = false;
    $scope.jugadores = [];
    $scope.options = {
    locale: 'es',
    format: 'l',
    };
$scope.jugadores = [
    { id: 1,
        name: 1}
];
    
  var AgregarInput =function(a){
    console.log('AgregarInput');
    console.log(a);
    $scope.jugadores=[];
    for (i=0; i< a; i++){
         $scope.jugadores.push({ 
            id: $scope.jugadores.length +1
        });
    }

    
  }

    var getTorneos = function(){
        
        torneosService.getAll()
            .then(function(d){
                $ionicLoading.hide();
                $scope.torneos = d.data;
            })  
            .catch(function(e){
                $ionicLoading.hide();
                var err = e.data ? e.data : 'Vuelva a intentar más tarde';
                gralFactory.showError(err);
            });
    }
    getTorneos();


    $scope.openPago = function(){
        $scope.modalPago.show();
    }

    $scope.openTorneo = function (r) {
        $scope.torneo = r;
        $scope.jugadores = [];

        var totalJugadores = $scope.torneo.jugTitulares + $scope.torneo.jugSuplentes;

        for(var i = 0 ; i < totalJugadores ; i ++){
            $scope.jugadores.push({});
        }

        console.log($scope.jugadores.length);

        $scope.modalTorneo.show();
    }

    $scope.anotarEquipo = function(equipo,jugadores){
        
        var usuario = userServices.getUsuario();
        $scope.equipo.usuarioResp = usuario.username;
        $scope.equipo.idTorneo = $scope.torneo._id;
        $scope.equipo.jugadores = $scope.jugadores;

        equiposService.save($scope.equipo)
            .then(function(equipo){

                 torneosService.save($scope.torneo,equipo)
                    .then(function(res){
                        $scope.torneos = {};
                        $scope.torneo = {};
                        gralFactory.showMessage('Gracias por anotarse!');
                        $scope.modalTorneo.hide();
                        $state.go('torneos');
                        getTorneos();
                    });             
                $scope.equipo = {};
        }); 
    }

    $scope.closeTorneo = function () {
        
        $scope.modalTorneo.hide();
        
        if(!$rootScope.loggeado){
            $state.go('login');
        }

        getTorneos();
        
    }

    $scope.pagarInscripcion = function(form){
        if(!form.$valid){
            gralFactory.showError('Por favor corrobore sus datos.');
            }
        else{
            console.log('form valid');
            $ionicLoading.show();
            setTimeout(function(){
                $ionicLoading.hide();
                // Volver a buscar las reservas.
                $scope.modalPago.hide();
                gralFactory.showMessage('Pago procesado. Muchas gracias!');
                
            },2000);
        }
    };

    $scope.closePago = function () {
        $scope.modalPago.hide();
    }

    $ionicModal.fromTemplateUrl('client/templates/dialogs/detalletorneo.html',{
        scope: $scope,
        animation:'slide-in-up',

    }).then(function(modal){

        $scope.modalTorneo = modal;
    });    
    $ionicModal.fromTemplateUrl('client/templates/dialogs/pagotarjetaTorneo.html',{
        scope: $scope,
        animation:'slide-in-up',
    }).then(function(modal){
        console.log($scope.torneos);
        $scope.modalPago = modal;
    });

}])