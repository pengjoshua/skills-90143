const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(__dirname));

app.post('/', (req, res) => {
  if (typeof req.body.input !== 'string') res.status(400).send('input must be a string');
  const lines = req.body.input.split('\r\n');
  const games = lines.filter(line => line.length > 0).map(line => line.split(', '));
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

  let ranking = [];
  for (let team in points) {
    ranking.push([team, points[team]]);
  }
  let sortedRanking = ranking.sort((a, b) => a[1] - b[1]).reverse();
  let tableRanking = sortedRanking.map((team, i) => {
    return (i > 0 && sortedRanking[i][1] === sortedRanking[i - 1][1]) ?
      { rank: i + '.', team: team[0], points: (team[1] === 1) ? team[1] + ' pt' : team[1] + ' pts' } :
      { rank: (i + 1) + '.', team: team[0], points: (team[1] === 1) ? team[1] + ' pt' : team[1] + ' pts' };
  });

  const result = { scores: scores, ranking: tableRanking };
  res.json(result);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

module.exports = app;
