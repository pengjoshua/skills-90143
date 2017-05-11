const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Set up Express Server Middleware
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(__dirname));

// Set up POST route so that I can pass the text file (in the request body) as a string
app.post('/soccer', (req, res) => {

  // Make sure the input is a string
  if (typeof req.body.input !== 'string') res.status(400).send('input must be a string');

  // Convert text string to an array, splitting on new lines
  const lines = req.body.input.split('\r\n');

  // Remove empty lines and further split each line on commas to get each game
  const games = lines.filter(line => line.length > 0).map(line => line.split(', '));

  // Create an array of objects containing team1, team2, goals1 (goals scored by team1), and goals2 (goals scored by team2)
  const scores = games.map(game => {
    if (game.length > 0) {
      return {
        team1: game[0].substring(0, game[0].length - 2).trim(),
        goals1: Number(game[0].split(' ')[game[0].split(' ').length - 1]),
        team2: game[1].substring(0, game[1].length - 2).trim(),
        goals2: Number(game[1].split(' ')[game[1].split(' ').length - 1]),
      };
    }
  });

  // Create a points object and calculate points from each game for each team
  let points = {};
  scores.forEach(game => {
    if (!points[game.team1]) points[game.team1] = 0;
    if (!points[game.team2]) points[game.team2] = 0;
    if (game.goals1 === game.goals2) {
      points[game.team1]++;
      points[game.team2]++;
    }
    else if (game.goals1 > game.goals2) points[game.team1] += 3;
    else points[game.team2] += 3;
  });

  // Cannot sort the points object, so move the contents of points into a sortable array of objects
  let ranking = [];
  for (let team in points) {
    ranking.push([team, points[team]]);
  }
  let sortedRanking = ranking.sort((a, b) => a[1] - b[1]).reverse();

  // Create a tableRanking array that formats the contents of the sortedRanking array to match data-output.txt
  let tableRanking = sortedRanking.map((team, i) => {
    return (i > 0 && sortedRanking[i][1] === sortedRanking[i - 1][1]) ?
      { rank: i + '.', team: team[0], points: (team[1] === 1) ? team[1] + ' pt' : team[1] + ' pts' } :
      { rank: (i + 1) + '.', team: team[0], points: (team[1] === 1) ? team[1] + ' pt' : team[1] + ' pts' };
  });

  // Return a JSON object
  const result = { scores: scores, ranking: tableRanking };
  res.json(result);
});

// GET endpoint that directly reads the data-input.txt file
app.get('/soccer', (req, res) => {

  // Directly read in data-input.txt file contents and store it in text.
  const text = fs.readFile('./data-input.txt', 'utf8', (err, text) => {
    if (err) console.log(err);
    console.log('text', text);

    // Make sure the input is a string
    if (typeof text !== 'string') res.status(400).send('input must be a string');

    // Convert text string to an array, splitting on new lines
    const lines = text.split('\r\n');

    // Remove empty lines and further split each line on ', ' to get each game
    const games = lines.filter(line => line.length > 0).map(line => line.split(', '));

    // Create an array of objects containing team1, team2, goals1 (goals scored by team1), and goals2 (goals scored by team2)
    const scores = games.map(game => {
      if (game.length > 0) {
        return {
          team1: game[0].substring(0, game[0].length - 2).trim(),
          goals1: Number(game[0].split(' ')[game[0].split(' ').length - 1]),
          team2: game[1].substring(0, game[1].length - 2).trim(),
          goals2: Number(game[1].split(' ')[game[1].split(' ').length - 1]),
        };
      }
    });

    // Create a points object and calculate points from each game for each team
    let points = {};
    scores.forEach(game => {
      if (!points[game.team1]) points[game.team1] = 0;
      if (!points[game.team2]) points[game.team2] = 0;
      if (game.goals1 === game.goals2) {
        points[game.team1]++;
        points[game.team2]++;
      }
      else if (game.goals1 > game.goals2) points[game.team1] += 3;
      else points[game.team2] += 3;
    });

    // Cannot sort the points object, so move the contents of points into a sortable array of objects
    let ranking = [];
    for (let team in points) {
      ranking.push([team, points[team]]);
    }
    let sortedRanking = ranking.sort((a, b) => a[1] - b[1]).reverse();

    // Create a tableRanking array that formats the contents of the sortedRanking array to match data-output.txt
    let tableRanking = sortedRanking.map((team, i) => {
      return (i > 0 && sortedRanking[i][1] === sortedRanking[i - 1][1]) ?
        { rank: i + '.', team: team[0], points: (team[1] === 1) ? team[1] + ' pt' : team[1] + ' pts' } :
        { rank: (i + 1) + '.', team: team[0], points: (team[1] === 1) ? team[1] + ' pt' : team[1] + ' pts' };
    });

    // Return a JSON object
    const result = { scores: scores, ranking: tableRanking };
    res.json(result);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

module.exports = app;
