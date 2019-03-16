var Department = require('../models').Department;

module.exports.findAll = function(req, res, next) {
   Department.find({}, next);
};

module.exports.create = function(req, res, next) {
   var department = new Department();
   department.name = req.body.name;
   department.name1 = req.body.name;
   department.detail = req.body.detail;
   Department
      .findOne({
         name1: req.body.name.toLowerCase()
      })
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         if (!result) return department.save(next);
         next({
            message: req.body.name + " - department already exists!"
         });
      });
};

module.exports.update = function(req, res, next) {
   Department.findById(req.body._id, function(err, department) {
      if (err) {
         console.log('error:', err);
         return next(err);
      }
      department.name = req.body.name;
      department.name1 = req.body.name;
      department.detail = req.body.detail;
      department.save(next);
   });
};

module.exports.delete = function(req, res, next) {
   Department.findByIdAndRemove(req.body._id, next);
};
