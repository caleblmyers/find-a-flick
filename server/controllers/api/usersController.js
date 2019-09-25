const usersController = require('express').Router();

const db = require('../../models');
const { JWTVerifier } = require('../../lib/passport');
const jwt = require('jsonwebtoken');

usersController.post('/', (req, res) => {
  const { email, password } = req.body;

  db.User.create({ 
    email,
    password,
    createdAt: new Date(),
    updatedAt: new Date()
  })
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

usersController.get('/:id/favorites', JWTVerifier, (req, res) => {
  db.Favorite.findAll({
    where: {
      userId: req.params.id
    },
    order: [['title', 'DESC']]
  })
    .then(favorites => res.json(favorites))
    .catch(err => res.json(err));
});

usersController.get('/me', JWTVerifier, (req, res) => {
  res.json(req.user);
});

usersController.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.User.findOne({ where: { email } })
    .then(user => {
      if (!user || !user.comparePassword(password)) {
        return res.status(401).send("Unauthorized");
      }

      res.json({
        token: jwt.sign({ sub: user.id }, process.env.JWT_SECRET),
        user
      });
    });
});

module.exports = usersController;
