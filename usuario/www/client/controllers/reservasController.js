angular.module('app.controllers')

.controller('misReservasCtroller', ['$scope','$ionicPopup','$ionicModal','$ionicLoading','reservaService','canchaService','gralFactory',function($scope,$ionicPopup,$ionicModal,$ionicLoading,reservaService,canchaService,gralFactory){

    $scope.reservas = getReservas();
    $scope.time = new Date();
    
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
        if(!form.$valid)
            gralFactory.showError('Por favor corrobore sus datos.');
        else{
            $ionicLoading.show();
            setTimeout(function(){
                $ionicLoading.hide();
                // Volver a buscar las reservas.
                $scope.modalPago.hide();
                $scope.modalReserva.hide();
                gralFactory.showMessage('Pago procesado. Muchas gracias!');
                
            },2000);
        }
    };
    
    function getReservas(){
        
        $ionicLoading.show();
        
        reservaService.getReservas()
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
