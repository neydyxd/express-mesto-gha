const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');
const app = express();

app.use(express.json());

app.use(usersRouter);

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
