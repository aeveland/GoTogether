/**
 * Validation Middleware
 * Handles request validation using express-validator
 */
const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Next middleware function
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    
    next();
};

/**
 * User registration validation rules
 */
const validateUserRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .isLength({ min: 6, max: 128 })
        .withMessage('Password must be between 6 and 128 characters'),
    
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters'),
    
    body('camper_type')
        .optional()
        .isIn(['tent', 'trailer', 'rv', 'cabin', 'other'])
        .withMessage('Invalid camper type'),
    
    body('dietary_preferences')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Dietary preferences must not exceed 500 characters'),
    
    body('group_size')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Group size must be between 1 and 20'),
    
    handleValidationErrors
];

/**
 * User login validation rules
 */
const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    
    handleValidationErrors
];

/**
 * User profile update validation rules
 */
const validateUserUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters'),
    
    body('camper_type')
        .optional()
        .isIn(['tent', 'trailer', 'rv', 'cabin', 'other'])
        .withMessage('Invalid camper type'),
    
    body('dietary_preferences')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Dietary preferences must not exceed 500 characters'),
    
    body('group_size')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Group size must be between 1 and 20'),
    
    handleValidationErrors
];

/**
 * Trip creation validation rules
 */
const validateTripCreation = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Trip name must be between 3 and 200 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Description must not exceed 2000 characters'),
    
    body('location')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Location must be between 3 and 200 characters'),
    
    body('start_date')
        .isISO8601()
        .withMessage('Start date must be a valid date')
        .custom((value) => {
            const startDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (startDate < today) {
                throw new Error('Start date cannot be in the past');
            }
            return true;
        }),
    
    body('end_date')
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((value, { req }) => {
            const startDate = new Date(req.body.start_date);
            const endDate = new Date(value);
            
            if (endDate <= startDate) {
                throw new Error('End date must be after start date');
            }
            
            // Check if trip duration is reasonable (max 30 days)
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 30) {
                throw new Error('Trip duration cannot exceed 30 days');
            }
            
            return true;
        }),
    
    handleValidationErrors
];

/**
 * Trip update validation rules
 */
const validateTripUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Trip name must be between 3 and 200 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Description must not exceed 2000 characters'),
    
    body('location')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Location must be between 3 and 200 characters'),
    
    body('start_date')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    
    body('end_date')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((value, { req }) => {
            if (req.body.start_date && value) {
                const startDate = new Date(req.body.start_date);
                const endDate = new Date(value);
                
                if (endDate <= startDate) {
                    throw new Error('End date must be after start date');
                }
            }
            return true;
        }),
    
    handleValidationErrors
];

/**
 * Shopping item validation rules
 */
const validateShoppingItem = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Item name must be between 1 and 200 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    
    body('quantity')
        .optional()
        .isInt({ min: 1, max: 9999 })
        .withMessage('Quantity must be between 1 and 9999'),
    
    body('unit')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Unit must not exceed 50 characters'),
    
    body('category')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Category must not exceed 100 characters'),
    
    body('amazon_url')
        .optional()
        .isURL()
        .withMessage('Amazon URL must be a valid URL'),
    
    body('estimated_cost')
        .optional()
        .isFloat({ min: 0, max: 99999.99 })
        .withMessage('Estimated cost must be between 0 and 99999.99'),
    
    handleValidationErrors
];

/**
 * Todo item validation rules
 */
const validateTodoItem = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Todo title must be between 1 and 200 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    
    body('category')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Category must not exceed 100 characters'),
    
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    
    body('due_date')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date'),
    
    handleValidationErrors
];

/**
 * Note validation rules
 */
const validateNote = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Note title must be between 1 and 200 characters'),
    
    body('content')
        .trim()
        .isLength({ min: 1, max: 10000 })
        .withMessage('Note content must be between 1 and 10000 characters'),
    
    body('category')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Category must not exceed 100 characters'),
    
    body('is_pinned')
        .optional()
        .isBoolean()
        .withMessage('is_pinned must be a boolean'),
    
    handleValidationErrors
];

/**
 * ID parameter validation
 */
const validateId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer'),
    
    handleValidationErrors
];

/**
 * Trip ID parameter validation
 */
const validateTripId = [
    param('tripId')
        .isInt({ min: 1 })
        .withMessage('Trip ID must be a positive integer'),
    
    handleValidationErrors
];

/**
 * Email validation for invitations
 */
const validateEmail = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    handleValidationErrors
];

/**
 * Search query validation
 */
const validateSearchQuery = [
    query('q')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Search query must be between 2 and 100 characters'),
    
    handleValidationErrors
];

/**
 * Pagination validation
 */
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1, max: 1000 })
        .withMessage('Page must be between 1 and 1000'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    handleValidationErrors
];

/**
 * Password reset validation
 */
const validatePasswordReset = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    
    handleValidationErrors
];

/**
 * New password validation
 */
const validateNewPassword = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    
    body('newPassword')
        .isLength({ min: 6, max: 128 })
        .withMessage('Password must be between 6 and 128 characters'),
    
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdate,
    validateTripCreation,
    validateTripUpdate,
    validateShoppingItem,
    validateTodoItem,
    validateNote,
    validateId,
    validateTripId,
    validateEmail,
    validateSearchQuery,
    validatePagination,
    validatePasswordReset,
    validateNewPassword
};
