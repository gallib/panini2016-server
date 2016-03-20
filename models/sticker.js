var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Sticker = new Schema({
    number   : Number
});

module.exports = mongoose.model('sticker', Sticker);