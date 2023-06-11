const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUserValid, loginValid } = require('./middlewares/validation');
const NotFound = require('./errors/NotFound');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
const { createUser, login } = require('./controllers/login');

app.post('/signin', loginValid, login);
app.post('/signup', createUserValid, createUser);

app.use(usersRouter);
app.use(cardsRouter);
app.use((req, res, next) => {
  next(new NotFound('Страница по этому адресу не найдена'));
});
mongoose.connect('mongodb://127.0.0.1/mestodb');
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
