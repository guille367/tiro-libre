angular.module('myApp').controller('canchaController',
  ['$scope', '$uibModal', '$log', 'canchaService', 'ngDialog',
   function ($scope, $uibModal, $log, canchaService, ngDialog) {

    $scope.newCancha = {};


    var getCanchas = function () {
      canchaService.getAll()
        .then(function(res){
          $scope.canchas = res;
        });
    }

    getCanchas();

    $scope.open = function (size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'canchaNuevo.html',
        controller: 'modalCanchaController',
        backdrop  : 'static',
   	    keyboard  : false,
        size: size,
        resolve: {
          test: function () {
            return $scope.items;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
          getCanchas();
        });
    };

    

    $scope.deleteConfirm = function (cancha) {
      $scope.canchaDelete = cancha;

      ngDialog.openConfirm({
                    template: 'modalDialogId',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    }).then(function (value) {
                        console.log('Modal promise resolved. Value: ', value);
                        canchaService.delete(value).then(function(res){
                          getCanchas();
                          $scope.canchaDelete ={};
                        });
                }, function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });
    };


    $scope.editCancha = function (cancha, size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'canchaNuevo.html',
        controller: 'modalCanchaController',
        backdrop  : 'static',
        keyboard  : false,
        size: size,
        resolve: {
          test: function () {
            return cancha;
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




angular.module('myApp').controller('modalCanchaController', function($scope, $uibModalInstance, $timeout, canchaService, test){

  $scope.nameForm = "";
  $scope.newCancha = test;

  if (test == null){
    $scope.nameForm = "Nueva Cancha";  
  }else{
    $scope.nameForm = "Editar Cancha";
  };


	$scope.cancel = function () {
    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

    $scope.guardar = function (newCancha, form) {
    	console.log(newCancha);

      if (form.$valid){
        canchaService.save(newCancha)
        .then(function(res){
          $scope.newCancha = {};
        });
      }else{
        return;
      };

    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

});

