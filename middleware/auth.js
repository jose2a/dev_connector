const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function(req, resp, next) {
     const token = req.header('x-auth-token');

     if(!token) {
          return resp.status(401).json({ msg: 'No token, authorization denied' });
     }

     try {
          const decode = jwt.verify(token, config.get('jwtSecret'));

          req.user = decode.user;
          next();
     } catch (error) {
          req.status(401).json({ msg: 'Token is invalid' });
     }
}