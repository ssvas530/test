var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Branch = new Schema({
   name: {
      type: String,
      required: true
   },
   country: {
      type: String,
      required: true
   },
   currency: {
      type: String,
      required: true
   }
}, {
   timestamps: true
});

if (!Branch.options.toJSON) Branch.options.toJSON = {};
Branch.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};


module.exports = mongoose.model('Branch', Branch);
