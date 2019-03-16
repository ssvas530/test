'use strict';


myApp
    .controller('LocationsCtrl', ['$scope', 'server', '$window', 'ginfo', function($scope, server, $window, ginfo) {


        $scope.readOnly = false;
        $scope.pageData = [];

        $scope.modelData = {
            id: '',
            name: ''
        };

        $scope.list = function() {
            server.crud('GET', 'location', null, function(err, data) {
                if (!!err) {
                    console.log('error fetching');
                } else {
                    if (angular.isArray(data)) {
                        $scope.pageData = data;
                    } else {
                        $scope.pageData.push(data);
                    }
                }
            });
        };


        $scope.list();

        $scope.delete = function(data) {
            server.crud('POST', 'location/delete', data, function(err, data) {
                if (!!err) {
                    console.log('error deleting');
                }
            });
            $window.location.reload();
        };

        $scope.save = function(data) {
            server.crud('POST', 'location/save', data, function(err, data) {
                if (!!err) {
                    console.log('error saving');
                }
            });
            $window.location.reload();
        };

        $scope.cancel = function() {
            $window.location.reload();
        };

        $scope.new = function() {
            $scope.readOnly = false;
            $scope.modelData = {
                id: '',
                name: ''
            };
        };

        $scope.edit = function(data) {
            $scope.readOnly = false;
            $scope.modelData = data;
        };


    }]);
