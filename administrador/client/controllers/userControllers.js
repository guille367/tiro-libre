angular.module('myApp').controller('loginController',
  ['$scope', '$location', 'AuthService', '$rootScope', '$window',
  function ($scope, $location, AuthService, $rootScope, $window) {

    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function (response) {
          $location.path('/');
          $scope.disabled = false;
          //$rootScope.currentUser = AuthService.whatUser();
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

}]);

angular.module('myApp').controller('logoutController',
  ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

}]);

angular.module('myApp').controller('registerController',
  ['$scope', '$location', 'AuthService', '$uibModalInstance', '$timeout', 'items',
  function ($scope, $location, AuthService, $uibModalInstance, $timeout, items) {

    $scope.register = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call register from service
      AuthService.register($scope.registerForm.username, $scope.registerForm.password, $scope.registerForm.name, $scope.registerForm.mail, $scope.registerForm.superAdmin)
        // handle success
        .then(function () {
          $scope.disabled = false;
          $scope.registerForm = {};
          $uibModalInstance.close();
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });

    };

    $scope.cancel = function () {
    $timeout(function() {
            $uibModalInstance.dismiss('cancel');
        }, 100);
    
  };

}]);

angular.module('myApp').controller('profileCtrl', function($scope, AuthService, configuracionService, $rootScope) {

  configuracionService.getAll().then(function(config){

    $rootScope.config = config[0];

  });


  $scope.user = "";

  AuthService.getCurrentUser().then(function (user) {
            $scope.user = user;
            console.log($scope.user.username);
            console.log($scope.user.superAdmin)
        }, function () {
            $scope.user = 'No user !!!';
        });


});


angular.module('myApp').controller('navbarCtrl', function($scope, $window, $AuthService, $location) {

  $scope.isAuthenticated = function() {
    return $AuthService.isAuthenticated();
  };

  $scope.logout = function() {
    $AuthService.logout();
    delete $window.localStorage.currentUser;
    $location.path('/');
  };

});