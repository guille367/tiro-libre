angular.module('myApp').controller('canchaController',
  ['$scope',
   function ($scope) {

    $scope.canchas = [
    	{'nombre':'Libertadores', 'cantJug': '14', 'piso': 'Pista', 'techo':'si', 'imagen': 'imagen', 'pdiurno': '280', 'pnocturno': '350',
    	 'estado': 'Activo',},
        {'nombre':'Monumentar', 'cantJug': '16', 'piso': 'Sintetico', 'techo':'no', 'imagen': 'imagen', 'pdiurno': '380', 'pnocturno': '550',
    	 'estado': 'Activo',}
    ];

}]);