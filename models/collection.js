var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Collection = new Schema({
    sticker: Schema.Types.ObjectId,
    glued    : {type: Boolean, default: false},
    duplicate: {type: Number, default: 0}
});

module.exports = mongoose.model('collection', Collection);