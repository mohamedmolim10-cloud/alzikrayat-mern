const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createMemory,
  getMemories,
  updateMemory,
  deleteMemory
} = require('../controllers/memoryController');

router.post('/', auth, upload.single('image'), createMemory);
router.get('/', auth, getMemories);
router.put('/:id', auth, upload.single('image'), updateMemory);
router.delete('/:id', auth, deleteMemory);

module.exports = router;
