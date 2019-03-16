// isAuthenticated
module.exports.isAuthenticated = function(req, res, next) {
   if (req.isAuthenticated())
      return next();
   return res.status(401).send({
      message: 'Please login to continue',
      status: 401
   });

};

module.exports.isAdminUser = function(req, res, next) {
   if (req.user && (req.user.role === 'admin' || req.user.role === 'super'))
      return next();
   return res.status(403).send({
      message: 'Unauthorized',
      status: 403
   });
};

module.exports.isManager = function(req, res, next) {
   if (req.user && req.user.role === 'manager')
      return next();
   return res.status(403).send({
      message: 'Unauthorized',
      status: 403
   });
};
