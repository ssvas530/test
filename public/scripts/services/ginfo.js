'use strict';


myApp
   .factory('ginfo', [function() {
      return {
         domain: '/api', // http://localhost:3000
         getUser: function() {
            var user = JSON.parse(localStorage.getItem("user"));
            user = user ? user : {
               name: ''
            };
            return user;

         },
         setUser: function(usr) {
            localStorage.setItem("user", JSON.stringify(usr));
         },
         showMessage: function(res) {
            // console.log(res);
            if (res.msg) {
               toastr[res.type](res.msg);
            }
         },
         isUsr: function() {
            var user = JSON.parse(localStorage.getItem("user"));
            if (user ? (user.role == 'employee') : false) {
               return true;
            }
            return false;
         },
         isManager: function() {
            var user = JSON.parse(localStorage.getItem("user"));
            if (user ? (user.role == 'manager') : false) {
               return true;
            }
            return false;
         },
         isAdmin: function() {
            var user = JSON.parse(localStorage.getItem("user"));
            if (user ? (user.role == 'admin' || user.role == 'super') : false) {
               return true;
            }
            return false;
         },
         isLoggedIn: function() {
            var user = JSON.parse(localStorage.getItem("user"));
            if (user) {
               return true;
            }
            return false;
         },
         logOff: function() {
            console.log('logoff called');
            localStorage.clear();
         }
      };
   }]);
