angular.module('app.services')

.service('torneosService',['$http','generalServices',function($http,generalServices){

    var extraerData = function(res){
      return res.data;
    };

  this.getAll = function(){
    return $http.get("http://localhost:3001/torneo/get").then(function(d){
      return d;
    });
  }

    var create = function(torneo){
      return $http.post("http://localhost:3001/torneo/post", torneo)
        .then(extraerData);
    };

  var update = function(torneo, equipo){
      return $http.put("http://localhost:3001/torneo/anotarequipo" + torneo._id, equipo)
        .then(extraerData);
        console.log('extraerData');
    console.log(extraerData);
    };

   this.getTorneo = function(idtorneo){
      return $http.get("http://localhost:3001/torneo/get" + idtorneo)
        .then(extraerData);
    }

    this.save = function(torneo,equipo){
      return torneo._id ? update(torneo,equipo) : create(torneo);
    };
}]);