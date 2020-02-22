/**
 * backend/index.js
 * 
 * What it Does:
 *   This file reads through the routes directory and finds every route that needs to be set up on the server.
 *   Routes need to have a koji.json file telling this script where to find the code for the route and what
 *   endpoint to put the route on on the server. In production these routes are setup on AWS lambdas.
 * 
 * Things to Change:
 *   Any specific routes should go in the route directory and not here. If you would like to change anything
 *   about how the routes that you have made should be handled and put on to the server then this is the place
 *   to do it.
 */

const babel = require('babel-polyfill');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const Database = require('@withkoji/database').default;

const app = express();

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  limit: '2mb',
  extended: true,
}));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Jiro-Request-Tag');
  next();
});

app.get('/', async (req, res) => {
    res.status(200).json({
    test: true,
    more: 'more',
    });
})

app.get('/leaderboard', async (req, res) => {
  const database = new Database();
  const rawScores = await database.get('leaderboard', 'score');
  const scores = (rawScores == null ? {_id: 'score', scores: []} : rawScores );

  res.status(200).json(scores);
});

app.post('/leaderboard', async (req, res) => {
  const { name, score } = req.body;

  if (!name || !score) {
      res.status(400).json({ error: 'Request is missing information' });
      return;
  }

  const scoreData = {
      name,
      score,
      datePosted: Math.floor(Date.now() / 1000),
  };
  const database = new Database();
  let scores = await database.get('leaderboard', 'score');
  if(!scores) scores = [];
  else scores = scores.scores;
  scores.push(scoreData);
  await database.set('leaderboard', 'score', {
      scores,
  });
  res.status(200).json({ success: true });
});

app.listen(process.env.PORT || 3333, null, async err => {
    if (err) {
        console.log(err.message);
    }
    console.log('[koji] backend started');
});
