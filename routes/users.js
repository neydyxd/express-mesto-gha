const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getAllUsers);

router.get('/users/:userId', getUserById);

router.post('/users', createUser);

router.patch('/users/me/avatar', updateAvatar);

router.patch('/users/me', updateUser);

module.exports = router;
