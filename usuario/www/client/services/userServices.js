angular.module('app.services')

.service('userServices',['$http',function($http){

	var url = "http://localhost:3003"
	
	this.estaLoggeado = function(){
		if(localStorage.getItem('usuario') != null)
			return true;
		else
			return false;
	}

	this.loggearUsuario = function(user){
		return $http.post(url + '/user/login',user)
			.then(function(d){
				console.log("loggeo correcto");
				localStorage.setItem('usuario',user);
			})
			.catch(function(e){
				throw e;
			});
	}

	this.cerrarSesion = function(){
		localStorage.removeItem('usuario');
	}

	this.saludar = function(){
		
	}

}])