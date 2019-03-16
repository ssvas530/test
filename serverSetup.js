var config = require('./config');
var User = require('./controllers').user;
var fs = require('fs');
var path = require('path');
module.exports.setup = function() {
   console.log('************************** Setting up server **************************');
   var req = {
      body: config.super_user
   };
   User.create(req, {}, function(err) {
      if (err)
         console.log('Error while setup', err);
      else
         console.log('Super user is created');
      console.log('************************** End setup **************************');
   });
   var dir = path.join(__dirname, '/uploads');
   if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
   }
   // var dir1 = path.join(dir, '/pdfs');
   // if (!fs.existsSync(dir1)) {
   //    fs.mkdirSync(dir1);
   // }
   var dir2 = path.join(dir, '/xls');
   if (!fs.existsSync(dir2)) {
      fs.mkdirSync(dir2);
   }
   // var dir3 = path.join(dir, '/logos');
   // if (!fs.existsSync(dir3)) {
   //    fs.mkdirSync(dir3);
   // }
   console.log('Excel folder is created');
   console.log('************************** End Creaing directories **************************');
};
