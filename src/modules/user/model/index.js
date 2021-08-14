const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let userSchema = new Schema({
  email: {
    type:String,
    unique: true,
    required: 'Email is required'
  },
  phone: {
    type: String,
    unique: true,
    maxlength:10,
    minlength:10,
    required: 'Phone is required'
  },
  name: {
    type: String,
    required: 'Name is required'
  },
  password: {
    type: String,
    required: 'Password is required',
    minlength:10,
  }
})

9696914049
userSchema.path('email').validate((email) => {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
},'Email is not valid');

const User = mongoose.model('User',userSchema);


module.exports = {
  User
} 
