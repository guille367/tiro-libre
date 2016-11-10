angular.module('myApp').controller('torneoController',
  ['$scope', '$uibModal', '$log', 'torneoServices', 'ngDialog', 'usuarioServices',
   function ($scope, $uibModal, $log, torneoServices, ngDialog, usuarioServices) {

  $scope.newTorneo = {};
  $scope.usuarios = {};
  $scope.options = {
    locale: 'es',
    format: 'l',
    };


    var getTorneos = function () {
      torneoServices.getAll()
        .then(function(res){
          $scope.torneos = res;

        });
    }
    getTorneos();
    
    var getUsuarios = function () {
      usuarioServices.getAll()
        .then(function(res){
          $scope.usuarios = res;
        });
    }
    getUsuarios();



    $scope.open = function (size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'torneoNuevo.html',
        controller: 'modalTorneoController',
        backdrop  : 'static',
   	    keyboard  : false,
        size: size,
        resolve: {
          test: function () {
            return $scope.items;
          },
          list: function () {
            return $scope.usuarios;
          } 

        }
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
          getTorneos();
        });
    };

    $scope.invitar = function (size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'nuevaInvitacion.html',
        controller: 'modalTorneoController',
        backdrop  : 'static',
        keyboard  : false,
        size: size,
        resolve: {
          test: function () {
            return $scope.items;
          },
          list: function () {
            return $scope.usuarios;
          } 
        }
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
          getTorneos();
        });
    };



    $scope.deleteConfirm = function (torneo) {
      $scope.torneoDelete = torneo;

      ngDialog.openConfirm({
                    template: 'modalDialogId',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    }).then(function (value) {
                        console.log('Modal promise resolved. Value: ', value);
                        torneoServices.delete(value).then(function(res){
                          getTorneos();
                          $scope.torneoDelete ={};
                        });
                }, function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });
    };

    //se edita el TORNEO
    $scope.editTorneo = function (torneo, size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'editarTorneo.html',
        controller: 'modalTorneoController',
        backdrop  : 'static',
        keyboard  : false,
        size: size,
        resolve: {
          test: function () {
            torneo.fechaInicio = moment(torneo.fechaInicio);
            torneo.fechaFin = moment(torneo.fechaFin);
            torneo.fechaCierreInscripcion = moment(torneo.fechaCierreInscripcion);
            console.log(torneo.fechaFin);   
            return torneo;
          },
          list: function () {
            return $scope.usuarios;
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

    //detalles del torneo
    $scope.detalles = function (torneo) {

      torneoServices.getTorneo(torneo._id)
        .then(function(t){
            torneo = t;

            var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'detalleTorneo.html',
            controller: 'modalDetalleController',
            backdrop  : 'static',
            keyboard  : false,
            size: 'lg',
            resolve: {
              test: function () {     
                  return t;
              },
              list: function () {
                return $scope.usuarios;
              } 
            }
          });

          modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });

          })
        .catch(function(e){
        alert(e);
        });
      
    };



}]);

angular.module('myApp').controller('modalTorneoController', function($scope, ngDialog, $uibModalInstance, $timeout,
 torneoServices, test, list, $rootScope, $http, bsLoadingOverlayService){

    $scope.options = {
    locale: 'es',
    format: 'l',
    };
  
  $scope.newTorneo = test;
  $scope.newInvitacion = {};
  $scope.usuarios = list;
  $scope.fechaMal = false;
  $scope.horaMayorCierre = false;
  $scope.horaMayorNocturna = false;
  $scope.horaMenorApertura = false;

  //Funcion que habilita/deshabilita opciones si es formato liga
  $scope.cambioFormato = function(formato){
      if (formato == "Liga") {
        $scope.newTorneo.partidosPorFecha = $scope.newTorneo.cantEquipos / 2;
        $scope.newTorneo.cantFechas = ($scope.newTorneo.cantEquipos - 1);

      }else{
        $scope.newTorneo.partidosPorFecha = $scope.newTorneo.cantEquipos;
        $scope.newTorneo.cantFechas = 1;
      };

  };

  $scope.idaVuelta = function(value){

      if (value === "true") {
        $scope.newTorneo.cantFechas = ($scope.newTorneo.cantEquipos - 1) *2;   
      }else{
        $scope.newTorneo.cantFechas = ($scope.newTorneo.cantEquipos - 1);
      }

    }

	$scope.cancel = function () {
    $timeout(function() {
            $uibModalInstance.dismiss('cancel');

        }, 300);

    };

    $scope.guardar = function (newTorneo, form) {
      if (form.$valid){
      	if(form.$name == "alta"){          
          if (newTorneo.fechaFin < newTorneo.fechaInicio) {
              $scope.fechaMal = true;
              return;
          }else{
          		newTorneo.estado = 'Activo'; 		
          		torneoServices.save(newTorneo)
              	.then(function(res){
                	$scope.newTorneo = {};
              	});	
          }  
      	}

        if(form.$name == "editar"){          
          if (newTorneo.fechaFin < newTorneo.fechaInicio) {
              $scope.fechaMal = true;
              return;
          }else{
         
              torneoServices.save(newTorneo)
                .then(function(res){
                  $scope.newTorneo = {};
                }); 
          }  
        }        	

      }else{
        return;
      } 

    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

  $scope.enviar = function (newInvitacion, form) {
        console.log("invitar");
        $scope.newInvitacion = newInvitacion;
        console.log($scope.newInvitacion);
        console.log($scope.newInvitacion.foto);
        console.log("invitar");
        bsLoadingOverlayService.start();
        //$scope.sendMail(newInvitacion.mail,"nlmancuso@hotmail.com","aaaaa");
        //Request
        $http.post('/enviarmail', $scope.newInvitacion) 
        .success(function(data, status) {
          bsLoadingOverlayService.stop();
            ngDialog.openConfirm({
                                template: 'modalDialogIdMail',
                                className: 'ngdialog-theme-default',
                                scope: $scope,
                                }).then(function (value) {
                                    console.log('Modal promise resolved. Value: ', value);
                                    $uibModalInstance.dismiss('cancel');
                                    
                            }, function (reason) {
                                console.log('Modal promise rejected. Reason: ', reason);
                                $uibModalInstance.dismiss('cancel');
                            });
        })
        .error(function(data, status) {
            console.log("Error");
        })
    };

  
});

angular.module('myApp').controller('modalDetalleController', function($scope, ngDialog, $uibModalInstance, $timeout,
 test, list, $http, bsLoadingOverlayService){


  $scope.equipos = test.equipos;
  $scope.listaJugadores = [];

  
  $scope.cambioEquipo = function(equipo){
    
    for (var i = 0; i < $scope.equipos.length; i++) {
      
      if ($scope.equipos[i]._id == equipo) {

        $scope.listaJugadores = $scope.equipos[i].jugadores;
        return;
      };

    };


  }

  $scope.cancel = function () {
    $timeout(function() {
            $uibModalInstance.dismiss('cancel');

        }, 300);

  };

});