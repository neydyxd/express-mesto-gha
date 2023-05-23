const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards')

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '646cb206ea9073e0d78398fd',
  };

  next();
});

app.use(usersRouter);
app.use(cardsRouter);
mongoose.connect('mongodb://127.0.0.1/mestodb');

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
