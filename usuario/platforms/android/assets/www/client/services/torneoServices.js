angular.module('app.services')

.service('torneosService',['$http','generalServices',function($http,generalServices){

    var extraerData = function(res){
      return res.data;
    };

  this.getAll = function(){
    return $http.get(generalServices.urlTorneos + "/get").then(function(d){
      return d;
    });
  }

    var create = function(torneo){
      return $http.post(generalServices.urlTorneos + "/post", torneo)
        .then(extraerData);
    };

  var update = function(torneo, equipo){
      return $http.put(generalServices.urlTorneos + "/anotarequipo" + torneo._id, equipo)
        .then(extraerData);
        console.log('extraerData');
    console.log(extraerData);
    };

   this.getTorneo = function(idtorneo){
      return $http.get(generalServices.urlTorneos + "/get" + idtorneo)
        .then(extraerData);
    }

    this.save = function(torneo,equipo){
      return torneo._id ? update(torneo,equipo) : create(torneo);
    };
}]);