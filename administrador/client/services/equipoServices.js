var app = angular.module("myApp");

app.service("equipoServices", function($http){

    var extraerData = function(res){
      return res.data;
    };
    

    this.getOne = function(equipoId){
      return $http.get("http://localhost:3001/equipo/get/one" + equipoId)
      	.then(extraerData);
    };

});