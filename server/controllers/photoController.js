const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');

exports.getAll = async (req, res, next) => {
  try {
    const photos = await Photo.find().populate('userId', 'firstName lastName').sort({ dateTime: -1 });
    res.json(photos);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id).populate('userId', 'firstName lastName occupation location');
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    const comments = await Comment.find({ photoId: photo._id }).populate('userId', 'firstName lastName').sort({ dateTime: 1 });
    res.json({ photo, comments });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please select an image file' });
    const { title, description } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: 'Photo title is required' });

    const photo = await Photo.create({
      userId: req.user.id,
      fileName: req.file.filename,
      title: title.trim(),
      description: description || ''
    });
    const populated = await photo.populate('userId', 'firstName lastName');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    if (photo.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this photo' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', photo.fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Comment.deleteMany({ photoId: photo._id });
    await photo.deleteOne();
    res.json({ message: 'Photo deleted successfully' });
  } catch (err) {
    next(err);
  }
};
