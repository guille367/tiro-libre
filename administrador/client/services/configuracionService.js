var app = angular.module("myApp");

app.service("configuracionService", function($http){

    var extraerData = function(res){
      return res.data;
    };
    
    var create = function(configuracion){
      return $http.post("http://localhost:3001/configuracion/post", configuracion)
        .then(extraerData);
    };

    var update = function(configuracion){
      return $http.put("http://localhost:3001/configuracion/update" + configuracion._id, configuracion)
        .then(extraerData);
    };

    this.getAll = function(){
      return $http.get("http://localhost:3001/configuracion/get")
      	.then(extraerData);
    };

    
    this.save = function(configuracion){
      return configuracion._id ? update(configuracion) : create(configuracion);
    };
});