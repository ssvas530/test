var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var ScrapEffort = new Schema({
   job: {
      type: ObjectId,
      ref: 'Job',
      required: true
   },
   partNo: {
      type: String,
      required: true
   },
   remarks: {
      type: String
   },
   totalEffortCost: {
      type: Number,
      required: true
   },
   totalQty: {
      type: Number,
      required: true
   },
   scrapQty: {
      type: Number,
      required: true
   },
   scrapCost: {
      type: Number,
      required: true
   },
   branch: {
      type: ObjectId,
      ref: 'Branch'
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

if (!ScrapEffort.options.toJSON) ScrapEffort.options.toJSON = {};
ScrapEffort.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};


module.exports = mongoose.model('ScrapEffort', ScrapEffort);
