const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name:  String, // String is shorthand for {type: String}
    status: String,
    ordering:   Number, 
    tags: []
  });

module.exports = mongoose.model("items", schema); 