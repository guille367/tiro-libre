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




angular.module('myApp').controller('modalCanchaController', function($scope, $uibModalInstance, $timeout,
 canchaService, test, $rootScope){

  console.log($rootScope.config);

  $scope.nameForm = "";
  $scope.newCancha = test;
  $scope.horaOk = false;
  $scope.horaMayorCierre = false;
  $scope.horaMayorNocturna = false;
  $scope.horaMenorApertura = false;

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

      if (newCancha.luz === false) {
          newCancha.pNocturno ="";
      };

      if (newCancha.horaIni < $rootScope.config.horaApertura) {
        $scope.horaMenorApertura = true;
        return;
      }else{
        $scope.horaMenorApertura = false;
      }

      if (newCancha.horaFin > $rootScope.config.horaNocturna && newCancha.luz == false) {
          $scope.horaMayorNocturna = true;
          return;
      }else{
          $scope.horaMayorNocturna = false;
      }

      if (newCancha.horaFin > $rootScope.config.horaCierre){
          $scope.horaMayorCierre = true;
          return;
      }else{
          $scope.horaMayorCierre = false;
      };

    	
      if (newCancha.horaFin < newCancha.horaIni) {
        $scope.horaOk = true;
        return;
      }else{
        $scope.horaOk = false;
        if (form.$valid){
          newCancha.locked = false;
        canchaService.save(newCancha)
        .then(function(res){
          $scope.newCancha = {};
        });
      }else{
        return;
      };
      };


    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

});

