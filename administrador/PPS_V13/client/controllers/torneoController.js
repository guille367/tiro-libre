angular.module('myApp').controller('torneoController', ['$scope',
   function ($scope) {

    $scope.torneos = [
    	{'nombre':'Liga Menores', 'fechaInicio': '12/06/2016', 'fechaFin': '28/09/2016', 'estado':'En Curso', 'anotados': '8 de 8'},
        {'nombre':'Torneo Relampago', 'fechaInicio': '15/09/2016', 'fechaFin': '12/10/2016', 'estado':'Inscripcion', 'anotados': '6 de 8'}
    ];

}]);


