// console.log('laugh my little puppet!') //test code to make sure file runs when 'npm test' run
var chai = require('chai')
var expect = chai.expect;

var spies = require('chai-spies');
chai.use(spies);

// describe('Testing suite capabilities', function() {
//   it('confirms basic arithmetic', function() {
//     expect(2+2).to.equal(4)
//   });

//   it('checks if setTimeout waits for the right amount of time', function(done) {
//     var startTime = new Date(); //captures start time
//     setTimeout(function() {
//       var duration = new Date() - startTime;
//       expect(duration).to.be.closeTo(1000, 50); //close to 1000ms with +/-50
//       done();
//     }, 1000)
//   }) //if catch added here, it says catch is not a function

//   it('will invoke a function once per element', function() {
//     var someArr = ['yay', 'snow', 'day']
//     function logElement(array) {
//       array.forEach(function(elem) {
//         console.log(elem)
//       })
//     }
//     logElement(someArr)
//     var spy = chai.spy.on(['logElement'])
//     expect(spy).to.not.have.been.called.exactly(someArr.length);
//   })
// });
