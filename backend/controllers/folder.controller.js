const Folder = require('../models/Folder');
const Chapter = require('../models/Chapter');

// @desc    Get all folders for logged in user (hierarchical or flat)
// @route   GET /api/folders
// @access  Private
const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      count: folders.length,
      folders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new folder
// @route   POST /api/folders
// @access  Private
const createFolder = async (req, res) => {
  try {
    const { name, parentFolderId, icon, color } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Folder name is required' });
    }

    // Verify parent folder exists if parentFolderId is supplied
    if (parentFolderId) {
      const parentExists = await Folder.findOne({ _id: parentFolderId, userId: req.user._id });
      if (!parentExists) {
        return res.status(404).json({ success: false, message: 'Parent folder not found' });
      }
    }

    const folder = await Folder.create({
      userId: req.user._id,
      name,
      parentFolderId: parentFolderId || null,
      icon: icon || '📁',
      color: color || '#7F6DF2',
    });

    res.status(201).json({
      success: true,
      folder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update folder (rename, icon, color)
// @route   PUT /api/folders/:id
// @access  Private
const updateFolder = async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.user._id });

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    if (name !== undefined) folder.name = name;
    if (icon !== undefined) folder.icon = icon;
    if (color !== undefined) folder.color = color;

    await folder.save();

    res.status(200).json({
      success: true,
      folder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Move folder to another parent
// @route   PUT /api/folders/:id/move
// @access  Private
const moveFolder = async (req, res) => {
  try {
    const { parentFolderId } = req.body;
    const folder = await Folder.findOne({ _id: req.params.id, userId: req.user._id });

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    // Prevent setting self as parent
    if (parentFolderId && parentFolderId.toString() === req.params.id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot move folder into itself' });
    }

    folder.parentFolderId = parentFolderId || null;
    await folder.save();

    res.status(200).json({
      success: true,
      folder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete folder and recursive subfolders
// @route   DELETE /api/folders/:id
// @access  Private
const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await Folder.findOne({ _id: folderId, userId: req.user._id });

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    // Recursive helper to get all subfolder IDs
    const getAllSubfolderIds = async (parentId) => {
      const children = await Folder.find({ parentFolderId: parentId, userId: req.user._id });
      let ids = children.map((c) => c._id);
      for (const child of children) {
        const childSubIds = await getAllSubfolderIds(child._id);
        ids = [...ids, ...childSubIds];
      }
      return ids;
    };

    const subfolderIds = await getAllSubfolderIds(folderId);
    const allFolderIds = [folderId, ...subfolderIds];

    // Delete chapters inside all these folders
    await Chapter.deleteMany({ folderId: { $in: allFolderIds }, userId: req.user._id });

    // Delete folders
    await Folder.deleteMany({ _id: { $in: allFolderIds }, userId: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Folder and contents deleted successfully',
      deletedFolderIds: allFolderIds,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFolders,
  createFolder,
  updateFolder,
  moveFolder,
  deleteFolder,
};
