const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', photoController.getAll);
router.get('/:id', photoController.getOne);
router.post('/', auth, upload.single('image'), photoController.create);
router.delete('/:id', auth, photoController.remove);

module.exports = router;
