//Nodeunit tests

//Dependencies
var mongoose = require('mongoose');


//SUT
var timestamps = require('./index');


//Create an example model
var Item = (function() {
  var ItemSchema = new mongoose.Schema({});

  ItemSchema.plugin(timestamps);

  return mongoose.model('timestampsItem', ItemSchema);
})();


exports['timestamps'] = {
  'adds created and updated': function(test) {
    var start = Date.now();
    var item = new Item();
    var end = Date.now();

    //Test created
    test.ok(item.created.getTime() >= start, 'Should be after start');
    test.ok(item.created.getTime() <= end, 'Should be before end');

    //Test updated
    test.ok(item.updated.getTime() >= start, 'Should be after start');
    test.ok(item.updated.getTime() <= end, 'Should be before end');

    test.done();
  },

  'called on save': function(test) {
    var item = new Item();

    //Throw save error to prevent actual save to DB
    item.pre('save', function(next) {
      next(new Error('Prevent save'));
    });

    //Let time pass to make sure updated time is different to created
    setTimeout(function() {
      var start = Date.now();

      item.save(function(err) {
        if (err.message != 'Prevent save') return test.done(err);

        var end = Date.now();

        //Test created
        test.ok(item.updated.getTime() >= start, 'Should be after start');
        test.ok(item.updated.getTime() <= end, 'Should be before end');

        test.done();
      });
    }, 10);
  }
};
