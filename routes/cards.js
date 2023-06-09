const router = require('express').Router();
const {
  removeCard,
  removeLike,
  createCards,
  getCards,
  getLike,
} = require('../controllers/cards');
const {
  createCardsValid,
  cardIdValid,
} = require('../middlewares/validation');

router.get('/cards', getCards);
router.post('/cards', createCardsValid, createCards);
router.delete('/cards/:cardId', cardIdValid, removeCard);
router.put('/cards/:cardId/likes', cardIdValid, getLike);
router.delete('/cards/:cardId/likes', cardIdValid, removeLike);

module.exports = router;
