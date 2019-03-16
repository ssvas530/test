var Role = require('../models').Role;

module.exports.findAll = function(req, res, next) {
   Role.find({}, next);
};

module.exports.create = function(req, res, next) {
   var role = new Role();
   role.name = req.body.name;
   role.name1 = req.body.name;
   role.detail = req.body.detail;
   Role
      .findOne({
         name1: req.body.name.toLowerCase()
      })
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         if (!result) return role.save(next);
         next({
            message: req.body.name + " - role already exists!"
         });
      });
};

module.exports.update = function(req, res, next) {
   Role.findById(req.body._id, function(err, role) {
      if (err) return next(err);
      role.name = req.body.name;
      role.detail = req.body.detail;
      role.save(next);
   });
};

module.exports.delete = function(req, res, next) {
   Role.findByIdAndRemove(req.body._id, next);
};
