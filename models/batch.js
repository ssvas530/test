var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Batch = new Schema({
   name: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
      lowercase: true
   },
   sDate: {
      type: Date
   },
   eDate: {
      type: Date
   },
   startTime: {
      type: Date
   },
   endTime: {
      type: Date
   },
   job: {
      type: ObjectId,
      ref: 'Job'
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
   message: {
      type: String
   },
   status: {
      type: String,
      required: true
   },
   path: {
      type: String,
      required: true
   }
}, {
   timestamps: true
});

if (!Batch.options.toJSON) Batch.options.toJSON = {};
Batch.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};


module.exports = mongoose.model('Batch', Batch);
