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
      getCurrentUser: getCurrentUser,
      getAllUsers: getAllUsers,
      update: update,
      requestRecover: requestRecover,
      recover: recover
    });

    function update (userAdmin){
      return $http.put("http://localhost:3001/user/update" + userAdmin._id, userAdmin);
    }


    function getAllUsers() {
      return $http.get("http://localhost:3001/user/get");
    };


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

    function register(username, password, name, mail, superAdmin) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/register',
        {username: username, password: password, name: name, mail: mail, superAdmin: superAdmin})
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

    function requestRecover(username){

      var deferred = $q.defer();

      $http.post('/user/recover' + username)
        .success(function(data, status){
          if(status === 200){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        .error(function(data){
          deferred.reject();
        });

        return deferred.promise;
    }

    function recover(pw,tipousuario,token){

      var deferred = $q.defer();
      var url = tipousuario == 'admin' ? 'user' : 'usuario';

      $http.put('/'+ url + '/recover' + token,{password:pw})
        .success(function(data, status){
          if(status === 200){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        .error(function(data){
          deferred.reject(data);
        });

        return deferred.promise;
    }

}]);