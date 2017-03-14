var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);

var models = require('../models')
var Page = models.Page;

describe('http requests', function () {

  describe('GET /wiki/', function () {
    it('responds with 200', function(done) {
      agent
      .get('/wiki')
      .expect(200, done);
    });
  });

  describe('GET /wiki/add', function () {
    it('responds with 200', function(done) {
      agent
      .get('/wiki/add')
      .expect(200,done)
    });
  });

  describe('GET /wiki/:urlTitle', function () {

    beforeEach(function(done) {
      Page.create( {
        title: 'I am here',
        content: 'Getting tired...',
        tags: ['tired', 'end', 'workshop']
      })
      .then(function() {
        done()
      })
      .catch(done)
    })

    afterEach(function() {
      return Page.destroy({where:{}})
    });

    it('responds with 404 on page that does not exist', function(done) {
      agent
      .get('/wiki/howdoyoudo')
      .expect(404, done)
    });

    it('responds with 200 on page that does exist', function(done){
      agent
      .get('wiki/I_am_here')
      .expect(200, done)
    });
  });

  describe('GET /wiki/search/:tag', function () {
    it('responds with 200');
  });

  describe('GET /wiki/:urlTitle/similar', function () {
    it('responds with 404 for page that does not exist');
    it('responds with 200 for similar page');
  });

  describe('POST /wiki', function () {
    it('responds with 302');
    it('creates a page in the database');
  });

});
