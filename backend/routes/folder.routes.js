const express = require('express');
const router = express.Router();
const {
  getFolders,
  createFolder,
  updateFolder,
  moveFolder,
  deleteFolder,
} = require('../controllers/folder.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getFolders)
  .post(createFolder);

router.route('/:id')
  .put(updateFolder)
  .delete(deleteFolder);

router.put('/:id/move', moveFolder);

module.exports = router;
