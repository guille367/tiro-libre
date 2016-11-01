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
 torneoServices, test, list, $rootScope, $http){

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
        //$scope.sendMail(newInvitacion.mail,"nlmancuso@hotmail.com","aaaaa");
        //Request
        $http.post('/enviarmail', $scope.newInvitacion) 
        .success(function(data, status) {
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

