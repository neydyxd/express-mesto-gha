const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { validationCreateUser } = require('./middlewares/validation');


const app = express();

app.use(express.json());

const { createUser, login } = require('./controllers/login');

app.post('/signin', login);
app.post('/signup', validationCreateUser, createUser);
app.use(errors());

app.use(usersRouter);
app.use(cardsRouter);
app.use((req, res) => {
  res
    .status(404)
    .send({ message: 'Страница  по этому адресу не найдена' });
});
mongoose.connect('mongodb://127.0.0.1/mestodb');

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
