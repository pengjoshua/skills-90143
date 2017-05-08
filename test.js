const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const mocha = require('mocha');
const app = require('./server');
const fs = require('fs');
const PORT = 3002;

chai.use(require('chai-things'));
chai.use(chaiHttp);

describe('Soccer League', () => {
  let server;
  beforeEach((done) => {
    server = app.listen(PORT, () => {
      // console.log(`Test server is listening on port ${PORT}!`);
      done();
    });
  });
  afterEach(() => {
    server.close();
  });

  describe('posting with data-input.txt', () => {

    it('should return a JSON object of the scores matching data-input.txt', (done) => {
      fs.readFile('data-input.txt', 'utf8', (err, data) => {
        if (err) console.log(err);
        chai.request(app)
        .post('/')
        .send({input: data})
        .end((err, res) => {
          const actual = JSON.stringify(res.body.scores);
          const expected = JSON.stringify([
            {
              team1: 'Lions',
              goals1: 3,
              team2: 'Snakes',
              goals2: 3
            },{
              team1: 'Tarantulas',
              goals1: 1,
              team2: 'FC Awesome',
              goals2: 0
            },{
              team1: 'Lions',
              goals1: 1,
              team2: 'FC Awesome',
              goals2: 1
            },{
              team1: 'Tarantulas',
              goals1: 3,
              team2: 'Snakes',
              goals2: 1
            },{
              team1: 'Lions',
              goals1: 4,
              team2: 'Grouches',
              goals2: 0
            }
          ]);
          expect(actual).to.equal(expected);
          done();
        });
      });
    });

    it('should return a JSON object of the team ranking matching data-output.txt', (done) => {
      fs.readFile('data-input.txt', 'utf8', (err, data) => {
        if (err) console.log(err);
        chai.request(app)
        .post('/')
        .send({input: data})
        .end((err, res) => {
          const actual = JSON.stringify(res.body.ranking);
          const expected = JSON.stringify([
            {
              rank: '1.',
              team: 'Tarantulas',
              points: '6 pts'
            },{
              rank: '2.',
              team: 'Lions',
              points: '5 pts'
            },{
              rank: '3.',
              team: 'FC Awesome',
              points: '1 pt'
            },{
              rank: '3.',
              team: 'Snakes',
              points: '1 pt'
            },{
              rank: '5.',
              team: 'Grouches',
              points: '0 pts'
            }
          ]);
          expect(actual).to.equal(expected);
          done();
        });
      });
    });
  });
});
