var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
   code1: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      dropDups: true
   },
   username1: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      dropDups: true
   },
   code: String,
   username: String,
   name: {
      type: String,
      required: true
   },
   password: String,
   dob: {
      type: Date
   },
   gender: {
      type: String,
      enum: ['m', 'f'],
      default: 'm'
   },
   email: String,
   mobile: Number,
   address: String,
   role: {
      type: String,
      enum: ['admin', 'manager', 'employee', 'super'],
      default: 'employee'
   }
}, {
   timestamps: true
});

if (!User.options.toJSON) User.options.toJSON = {};
User.options.toJSON.transform = function(doc, ret, options) {
   // remove the _id of every document before returning the result
   delete ret.__v;
   delete ret.password;
   if (ret.role === 'super') ret.role = 'admin';
   return ret;
};

User.plugin(passportLocalMongoose, {
   usernameField: 'username'
});

module.exports = mongoose.model('User', User);
