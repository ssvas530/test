var User = require('../models').User;

module.exports.findAll = function(req, res, next) {
   User.find({
      role: {
         $ne: 'super'
      }
   }, next);
};

module.exports.searchEmp = function(req, res, next) {
   User
      .find({
         $and: [{
            $or: [{
               name: {
                  '$regex': req.params.name.toString(),
                  '$options': 'i'
               }
            }, {
               code: {
                  '$regex': req.params.name.toString(),
                  '$options': 'i'
               }
            }],
            role: 'employee'
               // {
               //    $ne: 'super'
               // }
         }]
      })
      .exec(next);
};

// module.exports.userList = function(req, res, next) {
//    User.find({
//       role: {
//          $ne: 'super'
//       },
//    }, next);
// };

module.exports.create = function(req, res, next) {
   var user = new User({
      name: req.body.name,
      username: req.body.username,
      code: req.body.code,
      code1: req.body.code,
      username1: req.body.username,
      mobile: req.body.mobile,
      address: req.body.address,
      email: req.body.email,
      gender: req.body.gender,
      role: req.body.role,
      dob: req.body.dob
   });

   User
      .findOne({
         code1: req.body.code.toLowerCase()
      })
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         if (!result) return User.register(user, req.body.password, next);
         next({
            message: req.body.code + " - user already exists!"
         });
      });
};

module.exports.update = function(req, res, next) {
   User.findById(req.body._id, function(err, user) {
      if (err) return next(err);
      // user.username = req.body.username;
      user.name = req.body.name;
      user.mobile = req.body.mobile;
      user.role = req.body.role;
      user.address = req.body.address;
      user.email = req.body.email;
      user.gender = req.body.gender;
      user.dob = req.body.dob;
      user.save(function(err) {
         if (req.body.password) {
            user.setPassword(req.body.password, function(err, user1, passErr) {
               console.log('set password', err, user1, passErr);
               if (err) return next(err);
               user1.save(function(err, usr) {
                  console.log('save', err, usr);
                  next(err, usr);
               });
            });
         } else {
            next(err);
         }
      });
   });
};

module.exports.delete = function(req, res, next) {
   User.findByIdAndRemove(req.body._id, next);
};
