/**
 * Mongoose plugin
 * Adds created and updated timestamps
 *
 * @param {Schema} schema
 */
module.exports = function(schema) {
  //Create paths
  schema.add({
    created: { type: Date, default: Date.now, index: true },
    updated: { type: Date, default: Date.now }
  });

  //Update before save
  schema.pre('save', function(next) {
    this.updated = Date.now();

    next();
  });
};
