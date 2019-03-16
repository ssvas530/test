'use strict';


myApp
   .controller('UsersCtrl', ['$scope', 'server', 'pageData', 'ginfo', function($scope, server, pageData, ginfo) {

      $scope.roles = ['admin', 'manager', 'employee'];
      $scope.readOnly = false;
      $scope.pageData = pageData;

      $scope.modelData = {
         id: '',
         name: '',
         code: '',
         password: '',
         dob: '',
         mobile: '',
         address: '',
         role: 'employee'
      };



      $scope.delete = function(data) {
         server.crud('POST', 'user/delete', data, function(err, data) {
            if (!!err) {
               console.log('error deleting');
            }
         });
      };

      $scope.save = function(data) {
         server.crud('POST', 'user/save', data, function(err, data) {
            if (!!err) {
               console.log('error saving');
            }
         });
      };

      $scope.new = {
         id: '',
         name: '',
         code: '',
         password: '',
         dob: '',
         mobile: '',
         address: '',
         role: 'employee'
      };

      $scope.edit = function(data) {
         $scope.readOnly = true;
         $scope.modelData = data;
      };

      // $scope.editUserLoc = function(data) {
      //    $scope.modelData = data;
      //    var i, j, allLen, usrLen;
      //    server.crud('GET', 'location', null, function(err, rslt) {
      //       if (!!err) {
      //          console.log('error fetching');
      //       } else {
      //          if (angular.isArray(rslt)) {
      //             $scope.allLocations = rslt;
      //          } else {
      //             $scope.allLocations.push(rslt);
      //          }
      //       }
      //
      //       server.crud('POST', 'user/location', {
      //          'userId': $scope.modelData._id
      //       }, function(err, data) {
      //          if (!!err) {
      //             console.log('error fetching');
      //          } else {
      //             if (angular.isArray(data)) {
      //                $scope.userLocations = data;
      //             } else {
      //                $scope.userLocations.push(data);
      //             }
      //             console.log($scope.userLocations);
      //             $scope.feedUsrSingleLoc = $scope.userLocations[0];
      //             console.log('checked radio', $scope.feedUsrSingleLoc);
      //          }
      //          allLen = $scope.allLocations.length;
      //          usrLen = $scope.userLocations.length;
      //          for (i = 0; i < allLen; i++) {
      //             for (j = 0; j < usrLen; j++) {
      //                if ($scope.allLocations[i]._id === $scope.userLocations[j]._id) {
      //                   $scope.allLocations[i].chk = true;
      //                }
      //             }
      //          }
      //          console.log('a', $scope.allLocations);
      //
      //       });
      //
      //    });
      //
      //
      // };
      //
      //
      // $scope.saveUserLoc = function(arr1) {
      //
      //    var i, a1, arrPost = [];
      //    a1 = arr1.length;
      //    for (i = 0; i < a1; i++) {
      //       if (arr1[i].chk === true) {
      //          arrPost.push(arr1[i]);
      //       }
      //    }
      //
      //    var postData = {
      //       'userId': $scope.modelData._id,
      //       'locations': JSON.stringify(arrPost)
      //    };
      //    console.log('locations', arrPost);
      //    server.crud('POST', 'user/location/save', postData, function(err, data) {
      //       if (!!err) {
      //          console.log('error fetching');
      //       }
      //       $window.location.reload();
      //    });
      // };



   }]);
