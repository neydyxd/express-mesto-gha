const User = require('../models/user');
const BadRequest = require('../errors/BadRequest'); // 400
const NotFound = require('../errors/NotFound'); // 404

const getAllUsers = (req, res) => {
  User.find({})
    .then((data) => res.send({ data }))
    .catch(() => res.status(500).send({ message: 'переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля' }));
};

const getUserById = (req, res) => {
  User
    .findById(req.params.userId)
    .orFail()
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Пользователь с указанным _id не найден',
        });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(500).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((data) => res.status(201).send({ data }))
    .catch((err) => {
      res.status(400).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(500).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(500).send({
        message: 'Внутренняя ошибка сервера',
      });
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(BadRequest('Переданы некорректные данные'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('Пользователь не найден'));
      } else next(err);
    });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
};
