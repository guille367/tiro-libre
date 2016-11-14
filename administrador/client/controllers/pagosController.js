angular.module('myApp').controller("pagosController", function($scope, ngDialog, $uibModal, usuarioServices, $log,  torneoServices, bsLoadingOverlayService){

    $scope.todosTorneos = [];
    $scope.torneosUsuario = [];
 

    var getUsuarios = function () {
        bsLoadingOverlayService.start();
      usuarioServices.getAll()
        .then(function(res){
          $scope.usuarios = res;
          bsLoadingOverlayService.stop();
        }).catch(function() {
            console.log('error');
            bsLoadingOverlayService.stop();
            });
    }

    var getTorneos = function () {
      torneoServices.getAll()
        .then(function(res){
          $scope.todosTorneos = res;
        });
    }

    getTorneos();
    getUsuarios();

    //funcion que se ejecuta al seleccionar otro usuario
    $scope.cambioUser = function(usuario){
        $scope.torneosUsuario = [];

        for (var i = 0; i <= $scope.todosTorneos.length -1 ; i++) {
            
            for (var x = 0; x <= $scope.todosTorneos[i].equipos.length -1; x++) {
                    
                if ($scope.todosTorneos[i].equipos[x].usuarioResp == usuario.username && $scope.todosTorneos[i].tipo == "Liga" ) {
                    $scope.torneosUsuario.push($scope.todosTorneos[i]);
                }

            }

        }
        
    };

     $scope.pagarFecha = function (torneo, userSelected, size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'pagarFecha.html',
        controller: 'pagoTorneoController',
        backdrop  : 'static',
        keyboard  : false,
        size: size,
        resolve: {
          torneo: function () {
               return torneo;
          },
          usuario: function(){
            return userSelected;
          },
          equipo: function(){
            for (var i = 0; i <= torneo.equipos.length -1; i++) {
                if (torneo.equipos[i].usuarioResp == userSelected.username) {
                    return torneo.equipos[i];
                }
            }
          } 
        }
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;

        }, function () {
          getTorneos();
          $log.info('Modal dismissed at: ' + new Date());
        });
    };

    

//Fin del controller Pagos
});
  


angular.module('myApp').controller('pagoTorneoController', function($scope, ngDialog, $uibModalInstance, $timeout,
 torneo, usuario, equipo, bsLoadingOverlayService, equipoServices){


    $scope.torneo = torneo;
    $scope.equipo = equipo;
    $scope.usuario = usuario;
    $scope.cantFechasPagar = 0;

    $scope.opcionesConcepto= [];

    for (var i = 1; i <= $scope.equipo.fechasImpagas; i++) {
        $scope.opcionesConcepto.push(i);
    }

    $scope.cambioConcepto = function(value){

        $scope.aPagar = $scope.torneo.valorPorPartido * value;
        $scope.cantFechasPagar = value;
    };

    $scope.pagar = function(form){

        if (form.$valid){

            $scope.equipo.fechasImpagas = $scope.equipo.fechasImpagas - $scope.cantFechasPagar;
            $scope.equipo.saldo = $scope.equipo.saldo - $scope.aPagar;
            equipoServices.save($scope.equipo).then(function(res){

            });


        };

        $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
        



    }


    $scope.cancel = function () {
        $timeout(function() {
            $uibModalInstance.dismiss('cancel');

        }, 200);

  };

});