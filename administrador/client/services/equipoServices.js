var app = angular.module("myApp");

app.service("equipoServices", function($http){

    var extraerData = function(res){
      return res.data;
    };
    

    this.getOne = function(equipoId){
      return $http.get("http://localhost:3001/equipo/get/one" + equipoId)
      	.then(extraerData);
    };

    var create = function(equipo){
      console.log(equipo);
      return $http.post("http://localhost:3001/equipo/post", equipo)
        .then(extraerData);
    };

	var update = function(equipo){
		
      return $http.put("http://localhost:3001/equipo/update" + equipo._id, equipo)
        .then(extraerData);
        console.log('extraerData');
    console.log(extraerData);
    };

    this.save = function(equipo){
      return equipo._id ? update(equipo) : create(equipo);
    };

});