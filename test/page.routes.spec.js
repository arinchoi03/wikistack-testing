var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

var models = require('../models')
var Page = models.Page;
var User = models.User;

describe('http requests', function () {

    beforeEach(function() {
      return User.sync({ force: true})
        .then(function() {
          return Page.sync({ force: true})
        });
    });

    //what is the below doing?
    beforeEach(function (done) {
        Page.truncate().then(function () {
            done()
        });
    });

  describe('GET /wiki/', function () {
    it('responds with 200', function() {
      return agent
      .get('/wiki')
      .expect(200);
    });
  });

  describe('GET /wiki/add', function () {
    it('responds with 200', function() {
      return agent
      .get('/wiki/add')
      .expect(200)
    });
  });

  describe('GET /wiki/:urlTitle', function () {

    it('responds with 404 on page that does not exist', function() {
      return agent
      .get('/wiki/howdoyoudo')
      .expect(404)
    });

    it('responds with 200 on page that does exist', function(){
      return Page.create({
            title: 'Are we almost done',
            content: 'I am going to sleep soon...'
        })
        .then(function() {
         return agent
              .get('/wiki/Are_we_almost_done')
              .expect(200)
      })
    });
  });

  describe('GET /wiki/search/:tag', function () {
    it('responds with 200', function() {
    return Page.create({
        title: 'Almost there',
        content: 'ZZZ...',
        tags: ['sleepy', 'ZZZ']
      })
      .then(function() {
        agent
        .get('/wiki/search/ZZZ')
        .expect(200)
      })
    });
  });

  describe('GET /wiki/:urlTitle/similar', function () {
    it('responds with 404 for page that does not exist', function() {
      agent
      .get('/wiki/Cello_Players/similar')
      .expect(404)
    });

    it('responds with 200 for similar page', function() {
      Promise.all([
          Page.create({
            title: 'Sailor Moon',
            content: 'In the name of the Moon, I\'ll punish you!',
            tags: ['sailor', 'scout', 'cancer']
          }).then(function(result) {
            sailorMoon = result; //this is where you save the instance in the variable pageOne!!!
          }),
          Page.create({
            title: 'Sailor Venus',
            content: 'Guardian of Love',
            tags:['sailor', 'scout', 'artemis']
          }).then(function(result) {
            pageTwo = result;
          })
          ])
      .then(function(){
      agent
      .get('/wiki/Sailor_Moon/similar')
      .expect(200)
      });
    });
  })

  describe('POST /wiki', function () {
    it('responds with 302', function() {
      agent
      .post('/wiki/')
      .expect(302)
    });

    it('creates a page in the database', function() {
      agent
      .post('/wiki/')
      .send({
        name: 'Arin Choi',
        email: 'arin@gmail.com',
        title: 'This is my last post',
        content: 'And to all a good night'
      })
      .then(function() {
        return Page.findAll();
      })
      .then(function(pages) {
        expect(pages).to.have.length(1)
        expect(pages[0].title).to.equal('This is my last post')
      })
    });
  });

});
