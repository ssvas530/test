var Process = require('../models').Process;

module.exports.findAll = function(req, res, next) {
   Process
      .find({
         master: true
      })
      .exec(next);
};

module.exports.create = function(req, res, next) {
   var process = new Process();
   process.name = req.body.name;
   process.name1 = req.body.name;
   process.rate = req.body.rate;
   process.default = req.body.default || false;
   process.master = true;
   Process
      .findOne({
         name1: req.body.name.toLowerCase(),
         master: true
      })
      .exec(function(err, result) {
         if (err) {
            console.log('error:', err);
            return next(err);
         }
         if (!result) return process.save(next);
         next({
            message: req.body.name + " - process already exists!"
         });
      });
};

module.exports.update = function(req, res, next) {
   Process.findById(req.body._id, function(err, process) {
      if (err) return next(err);
      process.rate = req.body.rate;
      process.default = req.body.default || false;
      process.save(next);
   });
};

module.exports.delete = function(req, res, next) {
   Process.remove({
         _id: req.body._id
      })
      .exec(next);
};


module.exports.jobProcess = function(req, res, next) {
   Process
      .find({
         master: false,
         job: req.body._id
      })
      .exec(next);
};

// module.exports.jobProcessSearch = function(req, res, next) {
//    Process
//       .find({
//          master: false,
//          job: req.params._id
//       })
//       .exec(function(e, re) {
//          var names = [];
//          if (e) return next(e);
//          for (var i = 0; i < re.length; i++) {
//             names.push(re[i].name);
//          }
//          Process
//             .find({
//                master: true,
//                name: {
//                   $nin: names
//                }
//             })
//             .exec(next);
//       });
// };

module.exports.searchJobProcess = function(req, res, next) {
   Process
      .find({
         master: true,
         name: {
            '$regex': req.params.name.toString(),
            '$options': 'i'
         }
      })
      .exec(next);
};

module.exports.addJobProcess = function(req, res, next) {
   var process = new Process();
   process.name = req.body.name;
   process.name1 = req.body.name;
   process.rate = req.body.rate;
   process.job = req.body.job;
   process.master = false;
   Process
      .findOne({
         job: req.body.job,
         name1: req.body.name.toLowerCase(),
         master: false
      })
      .exec(function(err, result) {
         if (err) return next(err);
         if (!result) return process.save(next);
         next({
            message: req.body.name + " - Job process already present!"
         });
      });
};


module.exports.updateJobProcess = function(req, res, next) {
   Process.findById(req.body._id, function(err, process) {
      if (err) return next(err);
      process.rate = req.body.rate;
       process.estamount = req.body.estamount;
      process.save(next);
   });
};


module.exports.deleteJobProcess = function(req, res, next) {
   Process.remove({
      _id: req.body._id
   }, next);
};
