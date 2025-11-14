const authenticate = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  req.user = req.session.user;
  return next();
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  return next();
};

module.exports = {
  authenticate,
  requireRole,
};



