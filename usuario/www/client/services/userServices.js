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
				console.log("loggeo correcto");
				localStorage.setItem('usuario',JSON.stringify(d.data.user));
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
        return $http.get(generalServices.urlUsuarios + '/logout')
            .then(function(){
                localStorage.removeItem('usuario');
            });
	}

	this.getUsuario = function(){
<<<<<<< HEAD
		//return JSON.parse(localStorage.getItem('usuario'));
=======
		return JSON.parse(localStorage.getItem('usuario'));
>>>>>>> 2733fcf195e57d5fa1cdcd5f617ad2be206c14dd
	}

}])