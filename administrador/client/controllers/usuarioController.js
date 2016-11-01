angular.module('myApp').controller('usuarioController',
  ['$scope', '$uibModal', '$log', 'usuarioServices', 'ngDialog',
   function ($scope, $uibModal, $log, usuarioServices, ngDialog) {

    usuarios = {};
    $scope.newUsuario = {};

       $scope.options = {
    locale: 'es',
    format: 'l',
    };
   


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
            usuario.fechaNac = moment(usuario.fechaNac);
            usuario.fechaAlta = moment(usuario.fechaAlta);
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
  
   $scope.options = {
    locale: 'es',
    format: 'l',
    };


  $scope.usuarios = list;
  $scope.newUsuario = test;
  $scope.dniMal = false;
  $scope.usrMal = false;  
  $scope.usrDniMal = false;

  $scope.cancel = function (value) {
    
    $timeout(function() {
            $uibModalInstance.dismiss(value);
        }, 300);
              $scope.usuarios = {};
        $scope.newUsuario = {};
    };

    $scope.guardar = function (newUsuario,form) {

      if (form.$valid){
        var existeDni = 0;  
        var existeUsername = 0;  
        angular.forEach($scope.usuarios, function(value, key){
          if(value.dni == $scope.newUsuario.dni)
             existeDni = 1;
        });
        angular.forEach($scope.usuarios, function(value, key){
          if(value.username == $scope.newUsuario.username)
             existeUsername = 1;
        });

        if (form.$name == "formEdit") {
            existeDni = 0;  
            existeUsername = 0;  
        }else{
          newUsuario.fechaAlta = new Date();
        };

        if(existeDni == 0 && existeUsername == 0){
          if (form.$name == "formEdit") {            
            newUsuario.cantIncumplim = 0;
            usuarioServices.save(newUsuario).then(function(res){
            });        
          }else{
            newUsuario.estado = 'Activo';
            newUsuario.cantIncumplim = 0;
            usuarioServices.save(newUsuario).then(function(res){
            });        
          }  

        }if(existeDni == 1 && existeUsername == 1){
          $scope.usrDniMal = true;
          return;
        }if(existeDni == 1){
          $scope.dniMal = true;
          return;
        }if(existeUsername == 1){
          $scope.usrMal = true;
          return;
        }
       }else{
        return;
       } 

      
      

    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);

    };

   

});

