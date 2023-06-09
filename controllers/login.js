const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest'); // 400
const ConflictError = require('../errors/ConflictError'); // 409
const AuthError = require('../errors/AuthError');

// создаем пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User
      .create({
        name, about, avatar, email, password: hash,
      })
      .then(() => res.status(201).send(
        {
          data: {
            name, about, avatar, email,
          },
        },
      ))
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (err.name === 'MongoServerError') {
          return next(new ConflictError('Пользователь с таким email уже существует'));
        }
        if (err.name === 'ValidationError') {
          return next(new BadRequest('Некорректные данные'));
        }
        next(err);
      });
  })
    .catch(next);
};
// проверяем почту и пароль
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Неправильные почта или пароль'));
          }
          return res.send({
            token: jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }),
          });
        });
    })
    .catch(next);
};
