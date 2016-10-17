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


}]);

