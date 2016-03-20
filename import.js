var mongoose      = require('mongoose');
var data          = require('./data.json');
var categoryModel = require('./models/category');
var stickerModel  = require('./models/sticker');

mongoose.connect('mongodb://localhost:27017/panini');

for (var i = 0; i < data.length; i++) {
    var stickers = [];

    console.log('Import: ' + data[i].name + ' category');

    for (var j = 0 ; j < data[i].stickers.length; j++) {
        var sticker = new stickerModel();

        sticker.number = data[i].stickers[j];
        sticker.save();

        stickers.push(sticker._id);
    }

    var category = new categoryModel();
    category.name = data[i].name;
    category.stickers = stickers;

    category.save();
}

// Find a way to close the connection once import is done (by callback ?)
//mongoose.connection.close();

console.log('Import terminé');