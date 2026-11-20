const Comment = require('../models/Comment');
const Photo = require('../models/Photo');

exports.addComment = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    const newComment = await Comment.create({
      photoId: photo._id,
      userId: req.user.id,
      comment: req.body.comment.trim()
    });
    const populated = await newComment.populate('userId', 'firstName lastName');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};
