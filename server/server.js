/**
 * Project 3 Starter
 * UNC Charlotte Full-Stack Coding Bootcamp
 */

//-- .env --------------------------------------------------------------------
const path = require('path');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: path.resolve(__dirname, '.env')
  });
}

//-- Dependencies ------------------------------------------------------------
const axios = require('axios')
const express = require('express');
const logger = require('morgan');

const db = require('./models');
const { passport } = require('./lib/passport');

//-- Constants ---------------------------------------------------------------
const PORT = process.env.PORT || 3001;
const LOG_MODE = process.env.NODE_ENV === 'production' ? 'common' : 'dev';

//-- Express -----------------------------------------------------------------
const app = express();

//-- Middleware --------------------------------------------------------------
app.use(logger(LOG_MODE));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

//-- Static Server (Production) ----------------------------------------------
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
  console.log(`Client build path: ${clientBuildPath}\n`);
  app.use(express.static(clientBuildPath));
}

// //-- Controller Routes -------------------------------------------------------
// app.use(require('./controllers'));

// //-- React catch-all ---------------------------------------------------------
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

app.get('/netflix', (req, res) => {
  // axios.get('https://api.themoviedb.org/3/movie/78?api_key=38050460e68774c8a8cf7af02fac33cc')
  axios.get('https://api.themoviedb.org/3/search/tv?query=South%20Park&api_key=38050460e68774c8a8cf7af02fac33cc')
    .then(response => res.json(response.data))
    .catch(err => {
      console.log(err)
      res.send('Error')
    })
})

app.get('*', (req, res) => {
  res.send("Home Page")
});

//-- Main --------------------------------------------------------------------
db.sequelize.sync({ force: process.env.NODE_ENV === 'test' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}...`);
    });
  });

//-- Export to Tests ---------------------------------------------------------
module.exports = app;
