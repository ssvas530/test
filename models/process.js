var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Process = new Schema({
   name1: {
      type: String,
      required: true,
      lowercase: true
   },
   name: {
      type: String,
      required: true
   },
   rate: {
      type: Number,
      required: true
   },
   estamount: {
      type: Number,
      required: false
   },

   job: {
      type: ObjectId,
      ref: 'Job'
   },
   master: {
      type: Boolean
   },
   default: {
      type: Boolean
   },
   branch: {
      type: ObjectId,
      ref: 'Branch'
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

if (!Process.options.toJSON) Process.options.toJSON = {};
Process.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};

Process.pre('save', true, function(next, done) {
   var self = this; //in case inside a callback
   var re = new RegExp('^[0-9]+(.[0-9]{0,2})$');
   // console.log('rate :', self.rate);
   // console.log('regeX result :', re.test(self.rate));
   if (re.test(self.rate) == false) {
      self.invalidate('rate', 'Please enter a valid rate');
      done(new Error("Rate format is invalid"));
   } else
      done();
   next();
});

module.exports = mongoose.model('Process', Process);
