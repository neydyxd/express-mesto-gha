const router = require('express').Router();
const express = require('express');
const auth = require('../middlewares/auth');
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  updateAvatarValid,
  getUsersByIdValid,
  updateUserValid,
} = require('../middlewares/validation');

router.use(auth);

router.get('/users', getAllUsers);

router.get('/users/me', getCurrentUser);

router.patch('/users/me/avatar', updateAvatarValid, updateAvatar);

router.patch('/users/me', updateUserValid, updateUser);

router.get('/users/:userId', getUsersByIdValid, getUserById);

router.use(express.json());

module.exports = router;
