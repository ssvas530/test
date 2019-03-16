var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var Material = new Schema({
   purchaseOrder: {
      type: ObjectId,
      ref: 'PurchaseOrder'
   },
   name: {
      type: String,
      required: true
   },
   name1: {
      type: String,
      required: true,
      lowercase: true
   },
   poNumber1: {
      type: String,
      lowercase: true
         // required: true,
         // unique: false,
   },
   poNumber: {
      type: String,
      // required: true
   },
   rate: {
      type: Number,
      // required: true,
      default: 0
   },
   qty: {
      type: Number,
      required: true
   },
   amount: {
      type: Number,
      // required: true,
      default: 0
   },
   quotedAmt: {
      type: Number,
      required: false
   },
   materialType: {
      type: ObjectId,
      ref: 'MaterialType',
      required: true
   },
   supplier: {
      type: ObjectId,
      ref: 'Supplier'
      // required: true
   },
   date: {
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

if (!Material.options.toJSON) Material.options.toJSON = {};
Material.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};


module.exports = mongoose.model('Material', Material);
