var mongoose = require("mongoose");

var schemaStudent = new mongoose.Schema({
    Name : String,
    Image : String,
    Class : String,
    MSV :Number,
    Age : Number
});

module.exports = mongoose.model("Student" , schemaStudent);