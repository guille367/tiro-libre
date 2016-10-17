angular.module('myApp').controller('usuarioController',
  ['$scope', '$uibModal', '$log', 'usuarioServices', 'ngDialog',
   function ($scope, $uibModal, $log, usuarioServices, ngDialog) {

    usuarios = {};
    $scope.newUsuario = {};
    $scope.newUsuario = {fechaNac:new Date };


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
        templateUrl: 'usuarioNuevo.html',
        controller: 'modalusuarioController',
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
          getUsuarios();
        });
    };

    

    $scope.deleteConfirm = function (usuario) {
      $scope.usuarioDelete = usuario;

      ngDialog.openConfirm({
                    template: 'modalDialogId',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    }).then(function (value) {
                        console.log('Modal promise resolved. Value: ', value);
                        usuarioServices.delete(value).then(function(res){
                          getUsuarios();
                          $scope.usuarioDelete ={};
                        });
                }, function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });
    };


    $scope.editUsuario = function (usuario, size) {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'editarUsuario.html',
        controller: 'modalusuarioController',
        backdrop  : 'static',
        keyboard  : false,
        size: size,
        resolve: {
          test: function () {
            return usuario;
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




angular.module('myApp').controller('modalusuarioController', function($scope, $uibModalInstance, $timeout, usuarioServices, test,list, ngDialog){
  
  $scope.usuarios = list;
  $scope.newUsuario = test;

  $scope.cancel = function () {
    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

    $scope.guardar = function (newUsuario,form) {

      if (form.$valid){
        var existe = 0;  
        console.log('ingrese al if');
        angular.forEach($scope.usuarios, function(value, key){
          if(value.dni == $scope.newUsuario.dni)
             existe = 1;
        });

        if(existe == 0){
          newUsuario.estado = 'Activo';
          newUsuario.fechaAlta = new Date();
          newUsuario.cantIncumplim = 0;
          usuarioServices.save(newUsuario).then(function(res){
          });        
        }else{
          ngDialog.openConfirm({
                    template: 'modalDialogId2',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    })
        }
       }else{
        return;
       } 

      
      

    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

});

