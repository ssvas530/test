var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Role = new Schema({
   name1: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
      lowercase: true
   },
   name: {
      type: String
   },
   detail: {
      type: String
   },
   branch: {
      type: ObjectId,
      ref: 'Branch'
   },
   created: {
      type: Date
   },
   updated: {
      type: Date
   },
   updatedby: {
      type: ObjectId,
      ref: 'User'
   },
   createdby: {
      type: ObjectId,
      ref: 'User'
   },
   status: {
      type: ObjectId,
      ref: 'Status'
   }

}, {
   timestamps: true
});

if (!Role.options.toJSON) Role.options.toJSON = {};
Role.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};


module.exports = mongoose.model('Role', Role);
