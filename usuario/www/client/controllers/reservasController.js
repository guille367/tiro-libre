angular.module('app.controllers')

.controller('misReservasCtroller', ['$scope','$ionicPopup','$ionicModal','$ionicLoading','reservaService','canchaService','gralFactory',function($scope,$ionicPopup,$ionicModal,$ionicLoading,reservaService,canchaService,gralFactory){

    $scope.reservas = {};
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
    }

    $scope.openReserva = function () {

        $scope.reserva = {};

        $scope.reserva.importeAdeudado = ($scope.reserva.precio - $scope.reserva.pagado)

        $scope.modalReserva.show();
    }

    $scope.getReservas = function(){
        reservaService.getReservas()
            .then(function(d){
                $scope.reservas = d;
                console.log(d);
            })
            .catch(function(e){
                console.log(e);
            });
    }

    $scope.closeReserva = function () {
        $scope.modalReserva.hide();
    }

    $scope.closePago = function () {
        $scope.modalPago.hide();
    }

    $scope.pagarReserva = function(form){
        if(!form.$valid)
            gralFactory.showError('Por favor corrobore sus datos.');
        else{
            $ionicLoading.show();
            setTimeout(function(){
                $ionicLoading.hide();
                gralFactory.showMessage('Pago procesado. Muchas gracias!');
            },3000);
        }
    }

}])
