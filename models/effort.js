var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Effort = new Schema({
   user: {
      type: ObjectId,
      ref: 'User',
      required: true
   },
   job: {
      type: ObjectId,
      ref: 'Job',
      required: true
   },
   process: {
      type: ObjectId,
      ref: 'Process',
      required: true
   },
   partNo: {
      type: String,
      // uppercase: true,
      trim: true,
      required: true
   },
   start: {
      type: Date
   },
   stop: {
      type: Date
   },
   total: {
      type: Number
   },
   overtime: {
      type: Number
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
   // status: {
   //    type: ObjectId,
   //    ref: 'Status'
   // },
   status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open'
   }

}, {
   timestamps: true
});

if (!Effort.options.toJSON) Effort.options.toJSON = {};
Effort.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};


module.exports = mongoose.model('Effort', Effort);
