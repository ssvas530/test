var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Purchase = new Schema({
   ponumber: {
      type: String,
      required: true,
      lowercase: true
   },
   product: {
      type: String,
      required: true
   },
   quantity: {
      type: Number,
      required: true
   },
   invoiceamount: {
      type: Number,
      required: true
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

}, {
   timestamps: true
});

if (!Purchase.options.toJSON) Purchase.options.toJSON = {};
Purchase.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};

Purchase.pre('save', true, function(next, done) {
   var self = this; //in case inside a callback
   var re = new RegExp('^[0-9]+(.[0-9]{0,2})$');
   // console.log('rate :', self.rate);
   // console.log('regeX result :', re.test(self.rate));
   if (re.test(self.invoiceamount) == false) {
      self.invalidate('rate', 'Please enter a valid rate');
      done(new Error("Rate format is invalid"));
   } else
      done();
   next();
});

module.exports = mongoose.model('Purchase', Purchase);
