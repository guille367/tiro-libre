
angular.module('myApp').controller('torneoController',
  ['$scope', '$uibModal', '$log', 'torneoServices', 'ngDialog', 'usuarioServices', 
   function ($scope, $uibModal, $log, torneoServices, ngDialog, usuarioServices) {

  $scope.torneos = [];
  $scope.newTorneo = {};
  $scope.usuarios = {};
  $scope.options = {
    locale: 'es',
    format: 'l',
    };

    var cambioEstado = function(torneo){
      if (new Date(torneo.fechaFin) > new Date()) {
        torneo.estado = "Activo"
      }else{
        torneo.estado = "Finalizado"
      }
      return torneo;
    }

    var getTorneos = function () {
      torneoServices.getAll()
        .then(function(res){
           
           var torneosFiltrados = [];
          for (var i = 0; i < res.length; i++) {
            torneosFiltrados.push(cambioEstado(res[i]));
          }
          $scope.torneos = torneosFiltrados;
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
            return null;
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

            var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'detalleTorneo.html',
            controller: 'modalDetalleController',
            backdrop  : 'static',
            keyboard  : false,
            size: 'lg',
            resolve: {
              test: function () {     
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
              $log.info('Modal dismissed at: ' + new Date());
            });


      
    };



}]);

angular.module('myApp').controller('modalTorneoController', function($scope, ngDialog, $uibModalInstance, $timeout,
 torneoServices, test, list, $rootScope, $http, bsLoadingOverlayService, usuarioServices){

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
  $scope.idReserva = "";

  if (test != null) {
    if ($scope.newTorneo.cantFechas > $scope.newTorneo.cantEquipos) {
      $scope.newTorneo.idaVuelta = "true";
    }else{
      $scope.newTorneo.idaVuelta = "false";
    };

    if ($scope.newTorneo.equipos.length > 0) {
      $scope.cambioPrecio = true;
    }else{
      $scope.cambioPrecio = false;
    }
    $scope.nombreDisabled = true;

  }else{
      $scope.nombreDisabled = false;
  };

  

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

          if (newTorneo.fechaCierreInscripcion > newTorneo.fechaInicio || newTorneo.fechaCierreInscripcion > newTorneo.fechaFin) {
            $scope.fechaCierreMal = true;
            return;
          }else{
            $scope.fechaCierreMal = false;
          }


          if (newTorneo.fechaFin < newTorneo.fechaInicio) {
              $scope.fechaMal = true;
              return;
          }else{
          		newTorneo.estado = 'Activo'; 		
          		torneoServices.save(newTorneo)
              	.then(function(res){
                  //se crea el usuario para el torneo
                  var usuarioTorneo = {username: $scope.newTorneo.nombre, nombre: $scope.newTorneo.nombre, dni: "00000000"}

                  usuarioServices.save(usuarioTorneo).then(function(res){

                  });

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

        if (!form.$valid) {
          return;
        }



        $scope.newInvitacion = newInvitacion;
        bsLoadingOverlayService.start();

        if (newInvitacion.foto == null) {
          newInvitacion.foto = "";
        }
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
            bsLoadingOverlayService.stop();
        })
    };

  
});

angular.module('myApp').controller('modalDetalleController', function($scope, ngDialog, $uibModalInstance, $timeout,
 test, list, $http, bsLoadingOverlayService, $uibModal, $log){

  $scope.usuarios = list;
  $scope.equipos = test.equipos;
  $scope.listaJugadores = [];
  $scope.equipoSeleccionado = {};

  
  $scope.cambioEquipo = function(equipo){
    
    for (var i = 0; i < $scope.equipos.length; i++) {
      
      if ($scope.equipos[i]._id == equipo) {

        $scope.equipoSeleccionado = $scope.equipos[i];
        $scope.listaJugadores = $scope.equipos[i].jugadores;
        return;
      };

    };

  }

     $scope.cambioCapitan = function (equipo, size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'cambioCapitan.html',
        controller: 'cambioCapitanController',
        backdrop  : 'static',
        keyboard  : false,
        size: 'sm',
        resolve: {
          test: function () {
            return $scope.equipoSeleccionado;
          },
          usuarios: function(){
            return $scope.usuarios;
          },
          torneo: function(){
            return test;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
          
        });
    };
    




  $scope.cancel = function () {
    $timeout(function() {
            $uibModalInstance.dismiss('cancel');

        }, 300);

  };

});



angular.module('myApp').controller('cambioCapitanController', function($scope, $uibModalInstance, $timeout,
 test, usuarios, $log, equipoServices, torneo){

  $scope.equipo = test;
  $scope.usuarios = usuarios;
  $scope.selected = {};
  $scope.torneo = torneo;
  $scope.seleccionNombre = false;
  $scope.capitanEnUso = false

  console.log(usuarios);


  $scope.guardar = function(nuevoCapitan, form){
      
      if (form.$valid) {
        $scope.seleccionNombre = false;

        //verificar si el usuario seleccionado ya está en otro equipo
        for (var i = 0; i < $scope.torneo.equipos.length -1; i++) {
          if ($scope.torneo.equipos[i].usuarioResp == nuevoCapitan) {
            $scope.capitanEnUso = true;
            return;
          }else{
            $scope.capitanEnUso = false;
          }
        }

      }else{
        $scope.seleccionNombre = true;
        return;
      }


       if(nuevoCapitan == null){
          return;
       }else{

          $scope.equipo.usuarioResp = nuevoCapitan;
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

        }, 300);

  };


});