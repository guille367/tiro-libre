angular.module('app.services')

.service('userServices',['$http','generalServices',function($http,generalServices){

	
	this.estaLoggeado = function(){getUsuario
		if(localStorage.getItem('usuario') != null)
			return true;
		else
			return false;
	}

	this.loggearUsuario = function(user){
		return $http.post(generalServices.urlUsuarios + '/login', user)
			.then(function(d){
				localStorage.setItem('usuario',JSON.stringify(d.data.user));
			})
			.catch(function(e){
				throw e;
			});
	}

	this.modifPerfil = function(user){
		return $http.put(generalServices.urlUsuarios + '/modifperfil',user)
			.then(function(d){
				return d;
			})
			.catch(function(e){
				throw e;
			})
	}

	this.registrarUsuario = function(user){
		return $http.post(generalServices.urlUsuarios + '/register', user)
			.then(function(d){
				return d.data.usuario;
			})
			.catch(function(e){
				throw e;
			});
	}

	this.recuperarPw = function(username){
		return $http.post(generalServices.urlUsuarios + '/recover' + username)
			.then(function(d){
				return d.data;
			})
			.catch(function(e){
				throw e;
			});
	}

	this.cerrarSesion = function(){
        return $http.get(generalServices.urlUsuarios + '/logout')
            .then(function(){
                localStorage.removeItem('usuario');
            });
	}

	this.getUsuario = function(){
		return JSON.parse(localStorage.getItem('usuario'));
	}

}])