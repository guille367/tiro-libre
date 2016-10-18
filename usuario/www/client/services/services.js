angular.module('app.services', [])

.factory('gralFactory', ['$ionicPopup',function($ionicPopup){

    var gralFactory = {};
    
    gralFactory.showError = function(msg){
        $ionicPopup.alert({
            title: 'Error',
            template: msg,
            buttons:[{ text: 'Cerrar', type: 'button-assertive' }]
        });
    };
    
    return gralFactory;
    
}])

.service('generalServices', ['$http',function($http){

	var url = "http://localhost:3001";

	this.urlUsuarios = url + '/usuario';
	this.urlReservas = url + '/reserva';
	this.urlCanchas = url + '/cancha';

	this.getDatosClub = function (){
		return $http.get(url + '/configuracion/get')
					then(function(d){
						return d;
					})
					.catch(function(e){
						console.log(e);
					})
	}
    
}]);
