const usersController = require('express').Router();

const db = require('../../models');
const { JWTVerifier } = require('../../lib/passport');
const jwt = require('jsonwebtoken');

usersController.post('/', (req, res) => {
  const { username, email, password } = req.body;

  db.User.create({
    username,
    email,
    password,
    createdAt: new Date(),
    updatedAt: new Date()
  })
    .then(user => res.json(user))
    .catch(err => res.json(err));
})

usersController.put('/', JWTVerifier, (req, res) => {
  const { field, value, id } = req.body

  db.User.update(
    {
      [field]: value,
      updatedAt: new Date()
    },
    { where: { id } }
  )
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

usersController.delete('/:id', JWTVerifier, (req, res) => {
  const { id } = req.params

  db.User.destroy({
    where: { id }
  })
    .then(response => res.json(response))
    .catch(err => res.json(err))
})

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
  const { username, password } = req.body;

  db.User.findOne({ where: { username } })
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
