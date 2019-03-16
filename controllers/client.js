var Client = require('../models').Client;

module.exports.findAll = function(req, res, next) {
   Client.find({}, next);
};

module.exports.create = function(req, res, next) {
   var client = new Client();
   client.name = req.body.name;
   client.name1 = req.body.name;
   client.detail = req.body.detail;
   Client
      .findOne({
         name1: req.body.name.toLowerCase()
      })
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         if (!result) return client.save(next);
         next({
            message: req.body.name + " - customer already exists!"
         });
      });
};

module.exports.update = function(req, res, next) {
   Client.findById(req.body._id, function(err, client) {
      if (err) {
         console.log('error:', err);
         return next(err);
      }
      client.name = req.body.name;
      client.name1 = req.body.name;
      client.detail = req.body.detail;
      client.save(next);
   });
};

module.exports.delete = function(req, res, next) {
   Client.findByIdAndRemove(req.body._id, next);
};

module.exports.clientList = function(req, res, next) {
   Client.find({})
      .select('name')
      .exec(next);
};
