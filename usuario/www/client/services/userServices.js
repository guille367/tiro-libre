angular.module('app.services')

.service('userServices',['$http','generalServices',function($http,generalServices){

	
	this.estaLoggeado = function(){
		if(localStorage.getItem('usuario') != null)
			return true;
		else
			return false;
	}

	this.loggearUsuario = function(user){
		return $http.post(generalServices.urlUsuarios + '/login', user)
			.then(function(d){
				console.log("loggeo correcto");
				localStorage.setItem('usuario',user);
			})
			.catch(function(e){
				throw e;
			});
	}

	this.registrarUsuario = function(user){
		return $http.post(generalServices.urlUsuarios + '/register', user)
			.then(function(d){
				localStorage.setItem('usuario',user);
				return { msg:"Bienvenido!!", u:user.usuario, pw:user.password };
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