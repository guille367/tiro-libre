var app = angular.module("myApp");

app.service("usuarioServices", function($http){

    var extraerData = function(res){
      return res.data;
    };
    
    var create = function(usuario){
      return $http.post("http://localhost:3001/usuario/post", usuario)
        .then(extraerData);
    };

    var update = function(usuario){
      return $http.put("http://localhost:3001/usuario/update" + usuario._id, usuario)
        .then(extraerData);
    };

    this.getAll = function(){
      return $http.get("http://localhost:3001/usuario/get")
      	.then(extraerData);
    };

    this.delete = function(usuario){
      return $http.delete("http://localhost:3001/usuario/delete" + usuario._id)
      	.then(extraerData);
    };

    this.save = function(usuario){
      return usuario._id ? update(usuario) : create(usuario);
    };


    this.incumplimiento = function(usuario){
      return $http.put("http://localhost:3001/usuario/update/incumplimiento", usuario)
        .then(extraerData);
    };
    
});