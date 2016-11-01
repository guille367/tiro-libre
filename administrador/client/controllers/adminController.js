angular.module('myApp').controller('adminController',
  ['$scope', '$uibModal', '$log', 'AuthService' ,
   function ($scope, $uibModal, $log, AuthService) {


    var getUsers = function () {
      AuthService.getAllUsers()
        .then(function(res){
          $scope.users = res.data;
          console.log($scope.users);
        });
    }

    getUsers();

    $scope.open = function (size) {
    var modalInstance = $uibModal.open({
      templateUrl: 'templates/register.html',
      controller: 'registerController',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
        }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };



    $scope.edit = function (admin, size) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'adminEdit.html',
        controller: 'modalAdminController',
        backdrop  : 'static',
        keyboard  : false,
        size: size,
        resolve: {
          data: function () {
            return admin;
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

angular.module('myApp').controller('modalAdminController', function($scope, $uibModalInstance, $timeout, AuthService, data){

  $scope.userAdmin = data;



  $scope.cancel = function () {
    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

    $scope.guardar = function (admin, form) {

      if (form.$valid){
        AuthService.update(admin);
        console.log("Guardar OK")

      }else{
        return;
      };

    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 300);
    };

});