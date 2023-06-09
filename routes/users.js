const router = require('express').Router();
const express = require('express');
const auth = require('../middlewares/auth');
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser
} = require('../controllers/users');

router.use(auth);

router.get('/users', getAllUsers);

router.get('/users/me', getCurrentUser);

router.patch('/users/me/avatar', updateAvatar);

router.patch('/users/me', updateUser);

router.get('/users/:userId', getUserById);

router.use(express.json());

module.exports = router;
