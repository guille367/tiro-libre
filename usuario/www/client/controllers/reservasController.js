angular.module('app.controllers')

.controller('reservasCtroller', ['$scope','$state','$ionicPopup','$ionicModal','$ionicLoading','reservaService','canchaService','gralFactory','generalServices','userServices'
    ,function($scope,$state,$ionicPopup,$ionicModal,$ionicLoading,reservaService,canchaService,gralFactory,generalServices,userServices){

    $scope.reservas = getReservas();
    $scope.reserva = {};
    $scope.time = new Date();
    $scope.datosClub = generalServices.getDatosClub();
    $ionicModal.fromTemplateUrl('client/templates/dialogs/detallereserva.html',{
        scope: $scope,
        animation:'slide-in-up'
    }).then(function(modal){
        $scope.modalReserva = modal;
    });

    $ionicModal.fromTemplateUrl('client/templates/dialogs/pagotarjeta.html',{
        scope: $scope,
        animation:'slide-in-up',
    }).then(function(modal){
        $scope.modalPago = modal;
    });

    $scope.openPago = function(){
        $scope.modalPago.show();
    };

    $scope.openReserva = function (r) {
        $scope.reserva = r;
        $scope.reserva.importeAdeudado = ($scope.reserva.precio - $scope.reserva.pagado)
        $scope.modalReserva.show();
    };

    $scope.closeReserva = function () {
        $scope.modalReserva.hide();
    }

    $scope.closePago = function () {
        $scope.modalPago.hide();
    };

    // Ir al servidor con el pago, volver a traer las reservas una vez que hizo el pago
    $scope.pagarReserva = function(form){
        
            $ionicLoading.show();
            
            reservaService.completarPago($scope.reserva._id)
                .then(function(d){
                    $ionicLoading.hide();
                    $scope.modalReserva.hide();
                    $scope.modalPago.hide();
                    $state.go('canchas');
                    gralFactory.showMessage(d);
                })
                .catch(function(e){
                    $ionicLoading.hide();
                    gralFactory.showError(e);
                })
            
                $scope.modalPago.hide();
                $scope.modalReserva.hide();
        
    };
    
    function getReservas(){
        
        $ionicLoading.show();
        var username = userServices.getUsuario().username;
        reservaService.getReservasUsuario(username)
            .then(function(d){
                $ionicLoading.hide();
                $scope.reservas = d;
                console.log(d);
            })
            .catch(function(e){
                $ionicLoading.hide();
                console.log(e);
            });
    };

}])
