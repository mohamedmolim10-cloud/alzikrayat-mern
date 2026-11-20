const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');
const { validateComment } = require('../middleware/validation');

router.post('/', auth, validateComment, commentController.addComment);

module.exports = router;
