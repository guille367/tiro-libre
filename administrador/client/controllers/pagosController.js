angular.module('myApp').controller("pagosController", function($scope, usuarioServices){

    

    var getUsuarios = function () {
      usuarioServices.getAll()
        .then(function(res){
          $scope.usuarios = res;
        });
    }

    getUsuarios();

    //funcion que se ejecuta al seleccionar otro usuario
    $scope.cambioUser = function(x){
        
    };

    $scope.torneos = [{nombre: "Torneo relampago"}];


});
  