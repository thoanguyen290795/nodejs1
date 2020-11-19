const mongoose = require('mongoose');
let databaseConfig = require(__path_config + 'database'); 

const schema = new mongoose.Schema({
    name:  String, // String is shorthand for {type: String}
    status: String,
    ordering:   Number, 
    tags: []
  });

module.exports = mongoose.model(databaseConfig.col_items, schema); 