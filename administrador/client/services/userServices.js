angular.module('myApp').factory('AuthService',
  ['$q', '$timeout', '$http', '$window',
  function ($q, $timeout, $http, $window) {

    // create user variable
    var user = null;
    var dataUser= "";

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register,
      whatUser: whatUser,
      getCurrentUser: getCurrentUser

    });

  
    function getCurrentUser() {
        if ($window.sessionStorage.getItem('currentUser')) {
            return $q.when(JSON.parse($window.sessionStorage.getItem('currentUser')));
        } else {
            var deferred = $q.defer();
            deferred.reject('No Login User');
            return deferred.promise;
        }
    };


    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function whatUser(){
      return dataUser;

    }

    function getUserStatus() {
      return $http.get('/user/status')
      // handle success
      .success(function (data) {
        if(data.status){
          user = true;
        } else {
          user = false;
        }
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    }

    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            user = true;
            $window.sessionStorage.setItem('currentUser', JSON.stringify(data.user));
            deferred.resolve();
          } else {
            user = false;
            dataUser =  "";
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          dataUser =  "";
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
        // handle success
        .success(function (data) {
          user = false;
          dataUser =  "";
          $window.sessionStorage.removeItem('currentUser');
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          dataUser =  "";
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(username, password, name, mail, number) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/register',
        {username: username, password: password, name: name, mail: mail, number: number})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

}]);