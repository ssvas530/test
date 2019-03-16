'use strict';


myApp
   .service('departmentService', ['server', '$q', '$state', function(server, $q, $state) {
      var user = {};

      this.modelData = {};
      this.modelDataIndex = -1;
      this.list = function() {
         var deferred = $q.defer();
         var pageData = [];
         server.crud('GET', 'department', null, function(err, data) {
            if (!!err) {} else {
               if (angular.isArray(data)) {
                  pageData = data;
               } else {
                  pageData.push(data);
               }
            }
            deferred.resolve(pageData);
         });
         return deferred.promise;
      };

      this.save = function(data, cb) {
         var that = this;
         server.crud('POST', 'department/save', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            that.modelDataIndex = -1;
            that.modelData = {};
            $state.go('master.department.list');
            return cb(null, true);
         });
      };

      this.cancel = function() {
         $state.go('master.department.list');
      };

      this.delete = function(data, cb) {
         server.crud('POST', 'department/delete', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            $state.reload();
            return cb(null, true);
         });
      };

   }]);
