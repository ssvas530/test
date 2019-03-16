var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var ProductPurchase = new Schema({
   purchaseOrder: {
      type: ObjectId,
      ref: 'PurchaseOrder',
      required: true
   },
   rate: {
      type: Number,
      // required: true,
      default: 0
   },
   qty: {
      type: Number,
      // required: true,
      default: 0
   },
   amount: {
      type: Number,
      // required: true,
      default: 0
   },
   product: {
      type: ObjectId,
      ref: 'ProductMaster',
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

if (!ProductPurchase.options.toJSON) ProductPurchase.options.toJSON = {};
ProductPurchase.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};


module.exports = mongoose.model('ProductPurchase', ProductPurchase);