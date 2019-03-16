var express = require('express');
var router = express.Router();
var Department = require('../../controllers').department;
var Middleware = require('./middleware');

router.get('/', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Department.findAll(req, res, function(err, department) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: department,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   var save = req.body._id ? Department.update : Department.create;
   save(req, res, function(err, dat) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Department has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Department.delete(req, res, function(err, dat) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Department has been deleted',
         status: 200
      });
   });
});



module.exports = router;
