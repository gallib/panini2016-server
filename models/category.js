var mongoose = require('mongoose');
var Sticker  = require('./sticker');

var Schema   = mongoose.Schema;

var Category = new Schema({
    name : String,
    stickers: [{type: Schema.Types.ObjectId, ref: 'sticker'}]
});

module.exports = mongoose.model('category', Category);