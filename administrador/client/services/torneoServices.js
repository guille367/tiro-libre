var app = angular.module("myApp");

app.service("torneoServices", function($http){

    var extraerData = function(res){
      return res.data;
    };
    
    var create = function(torneo){
      return $http.post("http://localhost:3001/torneo/post", torneo)
        .then(extraerData);
    };

    var update = function(torneo){
      return $http.put("http://localhost:3001/torneo/update" + torneo._id, torneo)
        .then(extraerData);
    };

    this.getAll = function(){
      return $http.get("http://localhost:3001/torneo/get")
      	.then(extraerData);
    };

    this.delete = function(torneo){
      return $http.delete("http://localhost:3001/torneo/delete" + torneo._id)
      	.then(extraerData);
    };

    this.save = function(torneo){
      return torneo._id ? update(torneo) : create(torneo);
    };
});