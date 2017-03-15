var chai = require('chai')
var expect = chai.expect;

var spies = require('chai-spies');
chai.use(spies);
chai.should();
chai.use(require('chai-things'));
var marked = require('marked')

var models = require('../models')
var Page = models.Page;

// does it find all the pages? (get /wiki/)

// posts correctly (post /wiki/)
// part 1 / post title = title
// part 2 / post url generated correctly
// part 3 / if new user, new user is created in database

describe('Page model', function () {

    /*
    beforeEach( function () {
      return User.sync({force:true}).then(function() {
        return Page.synce({force:true})
      })
    })
    RESETS the database instead of Page.destroys()
    */

  describe('Virtuals', function () {
    var page;

    beforeEach(function() {
      //.build is not Async, which means it's not touching the database
      page = Page.build({
        title: "What a day",
        content: 'Hello my friend'
      });
    })

    describe('route', function () {
      it('returns the url_name prepended by "/wiki/"', function() {
        // console.log('page urlTitle', page.urlTitle)
        page.urlTitle = 'What_a_day';
        expect(page.route).to.be.equal('/wiki/What_a_day')
      });
    });

    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function() {
        var markedContent = marked(page.content)
        expect(page.renderedContent).to.be.equal(markedContent)
      });
    });
  });


  /** CLASS METHODS
   * within the 'optional' field within the third object of findByTag
   * functionality you attach to model itself that is typically used to do custom querying
   * findAll/.create/.findOne - adding our extra utility to existing methods
   * convenient custom querying functions!
  **/

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
        return searchPage //waits for the async task of findByTag (touching db)
      })

  // USING THE CALL/DONE METHOD
  // it('does not get pages without the search tag', function (done) {
  //   Page.findByTag('falafel')
  //   .then(function (pages) {
  //     expect(pages).to.have.lengthOf(0);
  //     done();
  //   })
  //   .catch(done); //if error happens on previous '.then' will catch error
  // });
  //
  /*** done callback - 'done' is a convention (can be called anything)
   * needs to be called at the end of the function!
   * if error, then pass the done to the .catch function
   ***/

  //USING THE PROMISE METHOD
      it('does not get pages without the search tag', function() {
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
        pageOne = result; //this is where you save the instance in the variable pageOne!!!
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

          //below is an example of chai-things
          expect(result).to.have.lengthOf(1);
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

    it('errors without title', function() {
      page = Page.build({
        content: 'I have a content',
        status: 'open'
      })
    return page.validate()
              .then(function(err) {
                expect(err).to.exist;
                expect(err.errors).to.contain.a.thing.with.property('path', 'title') //why is path a property?
              })
    });

    it('errors without content', function() {
      page = Page.build({
        title: 'I have a title',
        status: 'closed'
      })
      return page.validate()
                .then(function(err){
                  expect(err).to.exist;
                  expect(err.errors).to.contain.a.thing.with.property('path', 'content')
                })
    });

    it('errors given an invalid status', function() {
      page = Page.build({
        title: 'I also have a title',
        content: 'I also have a content',
        status: 'invalid'
      })
      return page.save().then(function() {
        throw Error('Promise should have rejected')
      }, function(err) {
        expect(err).to.exist;
        expect(err.message).to.contain('status')
      })
  });
});

  describe('Hooks', function() {
    it('it sets urlTitle based on title before validating', function() {
      var page = Page.build({
        title: 'The Who',
        content: 'A band on first base'
      });

      page.save()
        .then(function() {
          expect(page.urlTitle).to.equal('The_Who')
        });
    })
  })
})
