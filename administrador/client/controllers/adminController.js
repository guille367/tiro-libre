angular.module('myApp').controller('adminController',
  ['$scope', '$uibModal', '$log',
   function ($scope, $uibModal, $log) {

    $scope.users = [
    	{'nombre':'Marcos', 'mail': 'marekche@gmail.com', 'user': 'marek', 'admin':true},
    	{'nombre':'Pedro', 'mail': 'pedro1255@gmail.com', 'user': 'pedro', 'admin':false},

    ];

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

