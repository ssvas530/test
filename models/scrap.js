var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Scrap = new Schema({
   name: {
      type: String,
      required: true
   },
   amount: {
      type: Number,
      required: true
   },
   date: {
      type: Date
   },
   materialType: {
      type: ObjectId,
      ref: 'MaterialType',
      required: true
   },
   job: {
      type: ObjectId,
      ref: 'Job',
      required: true
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

if (!Scrap.options.toJSON) Scrap.options.toJSON = {};
Scrap.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};


module.exports = mongoose.model('Scrap', Scrap);
