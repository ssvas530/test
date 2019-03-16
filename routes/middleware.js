// isAuthenticated
module.exports.isAuthenticated = function(req, res, next) {
   console.log('Inside authenticate');
   if (req.isAuthenticated())
      return next();
   return res.status(401).render('login', {
      message: 'Please login to continue',
      status: 401
   });
};

module.exports.isAdminUser = function(req, res, next) {
   if (req.user && (req.user.role === 'admin' || req.user.role === 'super'))
      return next();
   // req.logout();
   return next(new Error('Unauthorized'));
};

module.exports.isUser = function(req, res, next) {
   if (req.user && req.user.role === 'user')
      return next();
   // req.logout();
   return next(new Error('Unauthorized'));
};

module.exports.isManager = function(req, res, next) {
   console.log('isManager', req.user);
   if (req.user && req.user.role === 'manager')
      return next();
   // req.logout();
   return next(new Error('Unauthorized'));
};
