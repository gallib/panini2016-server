var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Owner = new Schema({
    name: String,
    public_id: String,
    private_id: String,
    collections: [{type: Schema.Types.ObjectId, ref: 'collection'}]
});

module.exports = mongoose.model('owner', Owner);