var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    lock: { type: Number, required: false },
});

module.exports = mongoose.model('User', UserSchema);