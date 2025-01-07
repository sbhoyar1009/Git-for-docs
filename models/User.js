const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    fullName : {type:String},
    phone : {type:String},
    address: { type: String },
    birthdate: { type: Date },
    website : {type:String}

  });
  
  const User = mongoose.model("User", userSchema);

  module.exports = User;