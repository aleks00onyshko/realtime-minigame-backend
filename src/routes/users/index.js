const router = require('express').Router();
const { asyncHandler } = require('../../middlewares');

router.post('/register', asyncHandler(require('./register')));
router.post('/login', asyncHandler(require('./login')));

module.exports = router;
