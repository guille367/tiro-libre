angular.module('app.controllers')

.controller('misReservasCtroller', ['$scope','$ionicPopup','$ionicModal',function($scope,$ionicPopup,$ionicModal){

    $ionicModal.fromTemplateUrl('client/templates/dialogs/detallereserva.html',{
        scope: $scope,
        animation:'slide-in-up',
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

        $scope.reserva = {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            cancha: '',
            permanente: false,
            precio: 150,
            pagado: 15
        };

        $scope.reserva.importeAdeudado = ($scope.reserva.precio - $scope.reserva.pagado)

        $scope.modalReserva.show();

      
    }

    $scope.closeReserva = function () {
        $scope.modalReserva.hide();
    }

    $scope.closePago = function () {
        $scope.modalPago.hide();
    }

}])
