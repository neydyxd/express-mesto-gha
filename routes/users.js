const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getAllUsers);

router.get('/me', getCurrentUser);

router.get('/users/:userId', getUserById);

router.patch('/users/me/avatar', updateAvatar);

router.patch('/users/me', updateUser);

module.exports = router;
