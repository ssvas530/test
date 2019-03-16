var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Status = new Schema({
   name: {
      type: String,
      required: true
   }
}, {
   timestamps: true
});

if (!Status.options.toJSON) Status.options.toJSON = {};
Status.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};


module.exports = mongoose.model('Status', Status);
