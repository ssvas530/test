var mongoose = require('mongoose');
var Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var PurchaseOrder = new Schema({
   poNumber1: {
      type: String,
      required: false,
      unique: false,
      lowercase: true
   },
   poNumber: {
      type: String,
      required: false
   },
   refNo: {
      type: String,
      required: true,
      unique: true
   },
   reason: {
      type: String
   },
   remark: {
      type: String
   },
   approvedBy: {
      type: ObjectId,
      ref: 'User'
   },
   requestedBy: {
      type: ObjectId,
      ref: 'User'
   },
   poStatus: {
      type: String,
      enum: ['open', 'submitted', 'approved'],
      default: 'open'
   },
   totalAmount: {
      type: Number,
      default: 0
   },
   supplier: {
      type: ObjectId,
      ref: 'Supplier',
      required: true
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

if (!PurchaseOrder.options.toJSON) PurchaseOrder.options.toJSON = {};
PurchaseOrder.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   return ret;
};


module.exports = mongoose.model('PurchaseOrder', PurchaseOrder);
