var chai = require('chai')
var expect = chai.expect;

var spies = require('chai-spies');
chai.use(spies);
chai.should();
chai.use(require('chai-things'));

var models = require('../models')
var Page = models.Page;

// does it find all the pages? (get /wiki/)

// posts correctly (post /wiki/)
// part 1 / post title = title
// part 2 / post url generated correctly
// part 3 / if new user, new user is created in database

describe('Page model', function () {

  describe('Virtuals', function () {
    var page;

    beforeEach(function() {
      page = Page.build({
        title: "What a day",
        content: 'Hello my friend'
      });
    })

    describe('route', function () {
      xit('returns the url_name prepended by "/wiki/"', function() {
        // console.log('page urlTitle', page.urlTitle)
        page.urlTitle = 'What_a_day';
        expect(page.route).to.equal('/wiki/What_a_day')
      });
    });

    describe('renderedContent', function () {
      xit('converts the markdown-formatted content into HTML', function() {
        expect(page.renderedContent).to.equal('<p>Hello my friend</p>\n')
      });
    });
  });

  describe('Class methods', function () {
    var page;

    beforeEach(function(done) {
      page = Page.create({
        title: 'Snow is great',
        content: 'I want to go out and play!',
        tags: ['snow', 'play', 'fun']
      })
      .then(function() {
        done();
      })
      .catch(done)
    })

    afterEach(function() {
      return Page.destroy({where:{}})
    })

    describe('findByTag', function () {
      it('gets pages with the search tag', function() {
        var searchPage = Page.findByTag('snow') //returns  a promise
            .then(function(resultPages) {
              expect(resultPages).to.have.lengthOf(1)
            });
        return searchPage
      })

  // USING THE CALL/DONE METHOD
  // it('does not get pages without the search tag', function (done) {
  //   Page.findByTag('falafel')
  //   .then(function (pages) {
  //     expect(pages).to.have.lengthOf(0);
  //     done();
  //   })
  //   .catch(done);
  // });

  //USING THE PROMISE METHOD
      xit('does not get pages without the search tag', function() {
        var searchPage = Page.findByTag('nothing')
          .then(function(resultPages) {
            expect(resultPages).to.have.lengthOf(0)
          });
        return searchPage;
      })
    });
  });

  describe('Instance methods', function () {
    describe('findSimilar', function () {
      var pageOne, pageTwo, pageThree
      beforeEach(function() {

      return Promise.all([
      Page.create({
        title: 'Firstborn',
        content: 'I am responsible',
        tags: ['first', 'highschool']
      }).then(function(result) {
        pageOne = result;
      }),
      Page.create({
        title: 'Middle child',
        content: 'I am quirky',
        tags:['second', 'elementary']
      }).then(function(result) {
        pageTwo = result;
      }),
      Page.create({
        title: 'Baby',
        content: 'I am cute',
        tags:['third', 'elementary']
      }).then(function(result){
        pageThree =result;
      })])
    })

    afterEach(function() {
      return Page.destroy({where:{}})
    })

      it('never gets itself', function() {
        var similarPages = pageTwo.findSimilar()
        .then(function(result) {
          // console.log(JSON.stringify(result, null, 2))
          // THIS IS HOW YOU READ COMPLICATED JSON RESULTS
          expect(result).not.to.include.a.thing.with.property("id", pageTwo.id)
        })
        return similarPages;
      });

      it('gets other pages with any common tags', function() {
        var similarPages = pageThree.findSimilar()
          .then(function(result) {
            // console.log(JSON.stringify(result, null, 2))
            expect(result).include.a.thing.with.property("id", pageTwo.id)
          })
          return similarPages;
      });

      it('does not get other pages without any common tags', function(){
        var similarPages = pageTwo.findSimilar()
          .then(function(result) {
            expect(result).not.to.include.a.thing.with.property("id", pageOne.id)
          })
        return similarPages;
      });
    });
  });

  describe('Validations', function () {
    var pageNoTitle, pageNocontent, pageInvalidStatus;

    beforeEach(function() {
      pageNoTitle = Page.build({
        title: null,
        content: 'I have content',
        status: 'open'
      })
      pageNoContent = Page.build({
        title: 'I have a title',
        content: null,
        status: 'closed'
      })
      pageInvalidStatus = Page.build({
        title: 'I also have a title',
        content: 'I also have content',
        status: 'invalid'
      })
    })

    afterEach(function() {
      return Page.destroy({where:{}})
    })

    it('errors without title', function(done) {
      pageNoTitle.save()
      .then(function(result) {
          expect(result).to.equal('notNull Violation: title cannot be null')
      })
      .catch(done)
      })

    xit('errors without content');
    xit('errors given an invalid status');
  });

  describe('Hooks', function () {
    xit('it sets urlTitle based on title before validating');
  });

});
