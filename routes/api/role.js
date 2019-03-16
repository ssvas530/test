var express = require('express');
var router = express.Router();
var Role = require('../../controllers').role;
var Middleware = require('./middleware');

router.get('/', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Role.findAll(req, res, function(err, role) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         result: role,
         status: 200
      });
   });
});

router.post('/save', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   var save = req.body._id ? Role.update : Role.create;
   save(req, res, function(err, dat) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Role has been saved',
         status: 200
      });
   });
});

router.post('/delete', Middleware.isAuthenticated, Middleware.isAdminUser, function(req, res, next) {
   Role.delete(req, res, function(err, dat) {
      if (err) {
         return res.status(500).send(err);
      }
      return res.status(200).send({
         message: 'Role has been deleted',
         status: 200
      });
   });
});



module.exports = router;
