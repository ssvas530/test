var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Department = new Schema({
   name1: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      dropDups: true
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

if (!Department.options.toJSON) Department.options.toJSON = {};
Department.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};

module.exports = mongoose.model('Department', Department);
