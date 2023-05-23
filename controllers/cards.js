const { isValidObjectId } = require('mongoose');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card
    .find({})
    .then((cards) => res.send(cards.map(({
      _id,
      name,
      link,
      owner,
      likes,
    }) => ({
      _id,
      name,
      link,
      owner,
      likes,
    }))))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then(({
      _id,
      name,
      link,
      owner,
      likes,
    }) => res.status(201).send({
      _id,
      name,
      link,
      owner,
      likes,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const removeCard = (req, res) => {
  const { cardId } = req.params;

  if (!isValidObjectId(cardId)) {
    return res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки' });
  }
  Card.deleteOne({ _id: cardId })
    .then(({ deletedCount }) => {
      if (!deletedCount) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const addCardLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(userId) || !isValidObjectId(cardId)) {
    return res.status(400).send({message: 'Переданы некорректные данные для постановки лайка' });
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.status(201).send(card.likes);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const removeCardLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(userId) || !isValidObjectId(cardId)) {
    return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
  }

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.status(200).send(card.likes);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports = {
  removeCard,
  removeCardLike,
  addCardLike,
  createCard,
  getCards,
};
