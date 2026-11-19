const Memory = require('../models/Memory');

exports.createMemory = async (req, res) => {
  try {
    const { title, description, location, date } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const memory = new Memory({
      user: req.user.id,
      title,
      description,
      image,
      location,
      date: date || Date.now()
    });

    await memory.save();
    res.status(201).json(memory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMemories = async (req, res) => {
  try {
    const memories = await Memory.find({ user: req.user.id }).sort({ date: -1 });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateMemory = async (req, res) => {
  try {
    let memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    if (memory.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, description, location, date } = req.body;
    const updatedFields = { title, description, location, date };
    if (req.file) {
      updatedFields.image = `/uploads/${req.file.filename}`;
    }

    memory = await Memory.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );
    res.json(memory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: 'Memory not found' });
    }
    if (memory.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await memory.deleteOne();
    res.json({ message: 'Memory removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
