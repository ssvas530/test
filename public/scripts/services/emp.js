'use strict';


myApp
   .service('empService', ['server', '$q', '$state', 'ginfo', function(server, $q, $state, ginfo) {
      var user = {};

      this.modelData = {};
      this.modelDataIndex = -1;
      this.list = function() {
         var deferred = $q.defer();
         var pageData = [];
         if (ginfo.isUsr()) return [];
         server.crud('GET', 'user', null, function(err, data) {
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
         server.crud('POST', 'user/save', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            that.modelDataIndex = -1;
            that.modelData = {};
            $state.go('record.employee.list');
            return cb(null, true);
         });
      };

      this.cancel = function() {
         $state.go('record.employee.list');
      };

      this.delete = function(data, cb) {
         server.crud('POST', 'user/delete', data, function(err, data) {
            if (!!err) {
               return cb(true, null);
            }
            $state.reload();
            return cb(null, true);
         });
         // $state.go($state.current, {}, {
         //    reload: true
         // });
      };

   }]);
