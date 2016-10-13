var app = angular.module("myApp");

app.service("canchaService", function($http){

    var extraerData = function(res){
      return res.data;
    };
    
    this.create = function(cancha){
      return $http.post("http://localhost:3001/cancha/post", cancha)
        .then(extraerData);
    };

    var update = function(cancha){
      return $http.put("http://localhost:3000/cancha", cancha)
        .then(extraerData);
    };

    this.getAll = function(){
      return $http.get("http://localhost:3001/cancha/get")
      	.then(extraerData);
    };

    this.delete = function(cancha){
      return $http.delete("http://localhost:3000/cancha/" + cancha._id)
      	.then(extraerData);
    };

    this.save = function(cancha){
      return cancha._id ? update(cancha) : create(cancha);
    };
});