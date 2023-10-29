
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var cates = new Schema({

    namecate: { type: String, required: false }
});

module.exports = mongoose.model('cates', cates);