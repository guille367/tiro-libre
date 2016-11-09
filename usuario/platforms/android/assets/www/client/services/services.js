angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('perfilService', [function(){

	this.estaLoggeado = function(){
		if(localStorage.getItem('usuario') != null)
			return true;
		else
			return false;
	}

	this.loggearUsuario = function(u){
		localStorage.setItem('usuario',u);
	}

	this.cerrarSesion = function(){
		localStorage.removeItem('usuario');
	}

}]);