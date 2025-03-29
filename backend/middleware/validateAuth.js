// middleware/validateAuth.js
const { check, validationResult } = require('express-validator');

const validateRegistration = [
  check('company_name')
    .not().isEmpty().withMessage('Company Name is required')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Company Name must be 2-100 characters long'),
    
  check('company_address')
    .not().isEmpty().withMessage('Company Address is required')
    .trim()
    .isLength({ min: 5 }).withMessage('Address must be at least 5 characters long'),

  // Optional but validated if provided
  check('company_email')
    .optional({ checkFalsy: true })
    .trim()
    .normalizeEmail()
    .isEmail().withMessage('Must be a valid email address'),
    
  check('company_phonenumber')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
    .withMessage('Invalid phone number format'),
    
  check('company_industry')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Industry cannot exceed 50 characters'),

  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    next();
  }
];

const validateLogin = [
  check('email').isEmail().withMessage('Invalid email address'),
  check('password').not().isEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateClientCreate = [
  check('email').isEmail().withMessage('Invalid email address'),
  check('user_id').not().isEmpty().isInt().withMessage('User ID is required'),
  check('address').not().isEmpty().withMessage('Company Address is required'),
  check('phone_number').not().isEmpty().withMessage('Company Phone Number is required'),
  check('city').not().isEmpty().withMessage('Company City is required'),
  check('state').not().isEmpty().withMessage('Company State is required'),
  check('country').not().isEmpty().withMessage('Company Country is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateAddUser = [
  check('firstname').not().isEmpty().withMessage('Firstname is required'),
  check('lastname').not().isEmpty().withMessage('Lastname is required'),
  check('role').not().isEmpty().isInt().withMessage('Role is required'),
  check('user_id').not().isEmpty().isInt().withMessage('User ID is required'),
  check('company_id').not().isEmpty().isInt().withMessage('Company ID is required'),
  check('email').isEmail().withMessage('Invalid email address'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('phone_number').not().isEmpty().withMessage('Phone number is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateId = [
  check('user_id').not().isEmpty().isInt().withMessage('User ID is required'),
  check('company_id').not().isEmpty().isInt().withMessage('Company ID is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateClientCreate,
  validateAddUser,
  validateId
};
