angular.module('myApp').controller('usuarioController',
  ['$scope',
   function ($scope) {

    $scope.usuarios = [
    	{'dni':'22345678', 'nombre': 'Juan', 'apellido': 'Perez', 'mail':'juan.perez@mail.com', 'telefono': '1552298765',
    	 'estado': 'Activo',},
    	 {'dni':'33675342', 'nombre': 'Martin', 'apellido': 'Paz', 'mail':'martincho@live.com', 'telefono': '1534536788',
    	 'estado': 'Activo',},
    	 {'dni':'31333747', 'nombre': 'Esteban', 'apellido': 'Gallo', 'mail':'egallo@gmail.com', 'telefono': '1552208765',
    	 'estado': 'Lista Negra',}
    ];

}]);
