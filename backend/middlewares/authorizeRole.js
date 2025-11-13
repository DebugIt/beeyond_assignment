const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Handler = require('../utils/handlers');
const statusCodes = require('../utils/statusCodes');
require('dotenv').config();
const authorizeRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const session = req.cookies.session;

      if (!session) {
        return Handler(
          statusCodes.UNAUTHORIZED,
          false,
          'Unauthorized: No session token',
          res,
          null
        );
      }

      const extractDetails = jwt.verify(session, process.env.JWT_SECRET);
      console.log('Extracted Details:', extractDetails);
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      const user = await User.findOne({
        _id: extractDetails.userId,
        role: { $in: roles },
      });

      if (!user) {
        return Handler(
          statusCodes.NOT_FOUND,
          false,
          'User with required role not found',
          res,
          null
        );
      }

      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      console.error('Authorization Middleware Error:', error);

      // Handle token errors more precisely
      if (error.name === 'JsonWebTokenError') {
        return Handler(statusCodes.UNAUTHORIZED, false, 'Invalid Token', res, null);
      }
      if (error.name === 'TokenExpiredError') {
        return Handler(statusCodes.UNAUTHORIZED, false, 'Token Expired', res, null);
      }

      Handler(
        statusCodes.INTERNAL_SERVER_ERROR,
        false,
        'Internal Server Error',
        res,
        null
      );
    }
  };
};

module.exports = authorizeRole;