angular.module('app.services')

.service('equiposService',['$http','generalServices',function($http,generalServices){

    var extraerData = function(res){
      return res.data;
    };

	this.getAll = function(){
		return $http.get(generalServices.urlEquipos + "/get").then(function(d){
			return d;
		});
	}

    var create = function(equipo){
      console.log(equipo);
      return $http.post(generalServices.urlEquipos + "/post", equipo)
        .then(extraerData);
    };

	var update = function(equipo){
		
      return $http.put(generalServices.urlEquipos + "/update" + equipo._id, equipo)
        .then(extraerData);
        console.log('extraerData');
    console.log(extraerData);
    };

    this.save = function(equipo){
      return equipo._id ? update(equipo) : create(equipo);
    };
}]);