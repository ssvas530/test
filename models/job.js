var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Job = new Schema({
   code1: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      dropDups: true
   },
   code: {
      type: String
   },
   name: {
      type: String,
      required: true
   },
   title: {
      type: String
   },
   activity: {
      type: String,
      default: "active"
   },
   amount: {
      type: Number,
      required: true
   },
   totalMaterialCost: {
      type: Number,
      default: 0
   },
   totalProcessCost: {
      type: Number,
      default: 0
   },
   poAmount: {
      type: Number,
      default: 0
   },
   comment: {
      type: String
   },
   client: {
      type: ObjectId,
      ref: 'Client',
      required: true
   },
   branch: {
      type: ObjectId,
      ref: 'Branch'
   },
   updated: {
      type: Date
   },
   startDate: {
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

if (!Job.options.toJSON) Job.options.toJSON = {};
Job.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};

Job.pre('save', true, function(next, done) {
   var self = this; //in case inside a callback
   self.title = '' + self.code + ' - ' + self.name;
   var re = new RegExp('^[0-9]+(.[0-9]{0,2})$');
   if (re.test(self.amount) == false) {
      self.invalidate('amount', 'Please enter a valid amount');
      done(new Error("amount format is invalid"));
   } else
      done();
   next();
});

module.exports = mongoose.model('Job', Job);
