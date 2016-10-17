angular.module('app.controllers')

.controller('miTorneoCtroller', ['$scope','$ionicPopup','$ionicModal',function($scope,$ionicPopup,$ionicModal){

    $ionicModal.fromTemplateUrl('client/templates/dialogs/detalletorneo.html',{
        scope: $scope,
        animation:'slide-in-up',
    }).then(function(modal){
        $scope.modalTorneo = modal;
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

    $scope.openTorneo = function () {

        $scope.torneo = {
            fechaInicio: '01/10/2016',
            fechaFin: '01/12/2016',
            jugadores: 10,
            titulares: 6,
            suplentes: 4,
            inscripcion: 2000,
            partido: 500,
            formato: 'Liga',
            equipos: 10
        };

        $scope.modalTorneo.show();

      
    }

    $scope.closeTorneo = function () {
        $scope.modalTorneo.hide();
    }

    $scope.closePago = function () {
        $scope.modalPago.hide();
    }

}])
