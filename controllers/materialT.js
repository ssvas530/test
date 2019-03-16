var MaterialT = require('../models').MaterialT;

module.exports.findAll = function(req, res, next) {
   MaterialT.find({}, next);
};

module.exports.create = function(req, res, next) {
   var materialT = new MaterialT();
   materialT.name = req.body.name;
   materialT.name1 = req.body.name;
   materialT.detail = req.body.detail;
   MaterialT
      .findOne({
         name1: req.body.name.toLowerCase()
      })
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         if (!result) return materialT.save(next);
         next({
            message: req.body.name + " - material already exists!"
         });
      });
};

module.exports.update = function(req, res, next) {
   MaterialT.findById(req.body._id, function(err, materialT) {
      if (err) return next(err);
      materialT.name = req.body.name;
      materialT.name1 = req.body.name;
      materialT.detail = req.body.detail;
      materialT.save(next);
   });
};

module.exports.delete = function(req, res, next) {
   MaterialT.remove({
      _id: req.body._id
   }, next);
};


module.exports.list = function(req, res, next) {
   MaterialT.find({})
      .select('name')
      .exec(next);
};
