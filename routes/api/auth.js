const express = require("express");

const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User');

const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require('bcryptjs');

const { check, validationResult } = require("express-validator");

/**
 * @route      GET api/auth
 * @desc       Test route
 * @access     Public
 */
router.get('/', auth, async (req, resp) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		resp.json(user);
	} catch (error) {
		resp.status(500).send('Server error');
	}
});

/**
 * @route      POST api/auth
 * @desc       Authenticate user & get token
 * @access     Public
 */
router.post('/', [
     check('email', 'Please include a valid email').isEmail(),
     check('password', 'Password is required').exists()
], 
async (req, resp) => {
     const errors = validationResult(req);

     if (!errors.isEmpty()) {
          return resp.status(400).json({errors: errors.array()});
     }

     const { email, password } = req.body;

     try {
          let user = await User.findOne({ email });

          if (!user) {
               return resp.status(400).json({ errors: [{ msg: 'Invalid credentials'}]});
		}
		
		const isMatch = await bcrypt.compare(password, user.password);

		if(!isMatch) {
			return resp
				.status(400)
				.json({ errors: [{ msg: "Invalid credentials" }] });
		}
		
          const payload = {
               user: {
                    id: user.id
               }
          };

          jwt.sign(payload,
               config.get('jwtSecret'), 
               { expiresIn: 360000}, 
               (err, token) => {
                    if (err) {
                         throw err;
                    }
                    resp.json({ token });
          });

     } catch (error) {
          console.error(error.message);
          req.status(500).send('Server error');
     }

});

module.exports = router;
