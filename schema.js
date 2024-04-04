const mongoose = require('mongoose');

const certSchema = new mongoose.Schema({             // MONGOOSE SCHEMA
    _id : String,
    mail : String,
    name : String,
    fathernm : String,
    rollnm : String,
    schoolcd : String,
    percentage : String
  });

  const userSchema = new mongoose.Schema({
    username : String,
    password : String,
    type : String
  });

  module.exports = {
    certSchema , 
    userSchema
  };