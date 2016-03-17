var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Sticker = new Schema({
    number   : Number,
    glued    : {type: Boolean, default: false},
    duplicate: {type: Number, default: 0}
});

var Team = new Schema({
    name : String,
    stickers: [Sticker]
});

mongoose.connect('mongodb://localhost:27017/panini');
module.exports = mongoose.model('team', Team);