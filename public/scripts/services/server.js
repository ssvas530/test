'use strict';

myApp
   .factory('server', ['$http', 'ginfo', '$window', function($http, ginfo, $window) {

      return {

         crud: function(method, path, data, cb) {
            var req = {
               method: method, //'GET'
               url: ginfo.domain + '/' + path,
               headers: {
                  'Content-Type': 'application/json'
               },
               withCredentials: true
            };
            req.data = data;
            // console.log('req.data', angular.toJson(data));
            // if (method === 'POST') {
            //     req.data = $.param(data); // pass in data as strings
            // }
            // console.log('req.data', req.data);
            $http(req)
               .success(function(response) {
                  ginfo.showMessage({
                     type: 'success',
                     msg: response.message
                  });
                  cb(null, response.result);
               })
               .error(function(response, status) {
                  if (status === 401) {
                     $window.location.href = "/login";
                  }
                  if (response.code == 11000) {
                     return ginfo.showMessage({
                        type: 'error',
                        msg: 'No duplicates allowed'
                     });
                  }
                  ginfo.showMessage({
                     type: 'error',
                     msg: response.message
                  });
               });
         },
         upload: function(path, data, cb) {
            var req = {
               method: 'POST',
               url: ginfo.domain + '/' + path,
               headers: {
                  'Content-Type': undefined
               },
               data: data,
               withCredentials: true,
               transformRequest: function(data1) {
                  return data1;
               }
            };
            $http(req)
               .success(function(response) {
                  cb(null, response.result);
               }).error(function(response, status) {
                  if (status === 401) {
                     $window.location.href = "/login";
                  }
                  ginfo.showMessage(response.error);
               });
         },
         download: function(method, path, data, cb) {
            var req = {
               url: ginfo.domain + '/' + path,
               method: 'POST',
               data: data,
               headers: {
                  'Content-Type': 'application/json'
               },
               responseType: 'arraybuffer',
               withCredentials: true
            };

            $http(req)
               .success(function(data, status, headers, config) {
                  // return console.log(config);
                  var fname = config.url.slice(-1) == 'f' ? '.pdf' : '.xlsx';
                  var file = new Blob([data]);
                  //trick to download store a file having its URL
                  var fileURL = URL.createObjectURL(file);
                  var a = document.createElement('a');
                  a.href = fileURL;
                  a.target = '_blank';
                  a.download = config.data.job ? config.data.job.title : '';
                  a.download = config.data.emp ? (a.download + (a.download ? '__' : '') + config.data.emp.name) : a.download;
                  a.download = a.download.length > 0 ? a.download : 'yourfilename';
                  if (config.data && config.data.fileName)
                     a.download = config.data.fileName;
                  a.download = a.download + fname;
                  // a.download = (config.data.emp ? config.data.emp.code : config.data.job ? config.data.job.code : 'yourfilename') + fname;
                  document.body.appendChild(a);
                  a.click();
                  cb(null, {});
               }).error(function(response, status) {
                  if (status === 401) {
                     $window.location.href = "/login";
                  }
                  ginfo.showMessage({
                     type: 'error',
                     msg: response.message
                  });
               });
         },
         downloadPdf: function(method, path, data, cb) {
            var req = {
               url: 'http://162.244.82.119:8090/' + path,
               method: 'POST',
               data: data,
               headers: {
                  'Content-Type': 'application/pdf'
               },
               responseType: 'arraybuffer',
               withCredentials: true
            };

            $http(req)
               .success(function(data, status, headers, config) {
                  console.log('data', data);
                  console.log('config', config);
                  var fname = '.pdf';
                  var file = new Blob([data]);
                  //trick to download store a file having its URL
                  var fileURL = URL.createObjectURL(file);
                  var a = document.createElement('a');
                  a.href = fileURL;
                  a.target = '_blank';
                  a.download = a.download.length > 0 ? a.download : 'yourfilename';
                  if (config.data && config.data.fileName)
                     a.download = config.data.fileName;
                  a.download = a.download + fname;
                  document.body.appendChild(a);
                  a.click();
                  cb(null, {});
               }).error(function(response, status) {
                  if (status === 401) {
                     $window.location.href = "/login";
                  }
                  console.log('response', response);
               });
         },
         downloadExcel: function(method, path, data, cb) {
            var req = {
               url: 'http://162.244.82.119:8090/' + path,
               method: 'POST',
               data: data,
               headers: {
                  'Content-Type': 'application/pdf'
               },
               responseType: 'arraybuffer',
               withCredentials: true
            };

            $http(req)
               .success(function(data, status, headers, config) {
                  var fname = '.xlsx';
                  var file = new Blob([data]);
                  //trick to download store a file having its URL
                  var fileURL = URL.createObjectURL(file);
                  var a = document.createElement('a');
                  a.href = fileURL;
                  a.target = '_blank';
                  a.download = a.download.length > 0 ? a.download : 'yourfilename';
                  if (config.data && config.data.fileName)
                     a.download = config.data.fileName;
                  a.download = a.download + fname;
                  document.body.appendChild(a);
                  a.click();
                  cb(null, {});
               }).error(function(response, status) {
                  if (status === 401) {
                     $window.location.href = "/login";
                  }
                  console.log('response', response);
               });
         }

      };

   }]);