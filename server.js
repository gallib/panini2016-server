var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var shortid    = require('shortid');
var cors       = require('cors');

var categoryModel   = require('./models/category');
var collectionModel = require('./models/collection');
var ownerModel      = require('./models/owner');
var stickerModel    = require('./models/sticker');

var app    = express();
var router = express.Router();

mongoose.connect('mongodb://localhost:27017/panini');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));

/*******************************
 *******************************
 * Owner
 *******************************
 ******************************/
router
    .route('/owner')
    .get(function(req, res) {
        var response = {};
        var params = {};

        if (req.query.private_id !== undefined) {
            params.private_id = req.query.private_id;
        }

        if (req.query.public_id !== undefined) {
            params.public_id = req.query.public_id;
        }

        ownerModel.findOne(params, '_id name public_id collections')
        .populate('collections')
        .exec(function(err, owner){
            if (err) {
                response = {error: true, message: 'Error while fetching data'};
            } else {
                if (!owner) {
                    response = {error: true, message: 'Owner not found'};
                } else {
                    var coll = {};

                    collectionModel.find({}, function(err, collection){
                        coll = collection;
                    });

                    response = {error: false, owner: owner, collection: coll};
                }
            }

            res.send(response);
        });
    })
    .post(function(req, res) {
        var response = {},
            owner    = new ownerModel();

        if (req.body.owner === undefined) {
            response = {error: true, message: 'Invalid data'};
            res.json(response);
        } else {
            stickerModel.find({}, function(err, stickers) {
                var collections = [];

                stickers.forEach(function(sticker) {
                    var collection = new collectionModel();

                    collection.sticker = sticker._id;
                    collection.save();

                    collections.push(collection);
                });

                var owner = new ownerModel();

                owner.name        = req.body.owner;
                owner.public_id   = shortid.generate();
                owner.private_id  = shortid.generate();
                owner.collections = collections;

                owner.save(function(err) {
                    if (err) {
                        response = {error: true, message: 'Error while adding data'};
                    } else {
                        response = {error: false, message: 'Data added', owner: owner};
                    }

                    res.json(response);
                });
            });
        }
    })
;

/*******************************
 *******************************
 * Category
 *******************************
 ******************************/
router
    .route('/category')
    .get(function(req, res) {
        var response = {};

        categoryModel.find({})
        .populate('stickers')
        .exec(function(err, data){
            if (err) {
                response = {error: true, message: 'Error while fetching data'};
            } else {
                response = {error: false, categories: data};
            }

            res.json(response);
        });
    })
    .post(function(req, res) {
        var db = new mongoOp();
        var response = {};

        db.save(function(err) {
            if (err) {
                response = {error: true, message: 'Error while adding data'};
            } else {
                response = {error: false, message: 'Data added'};
            }

            res.json(response);
        });
    })
;

/*******************************
 *******************************
 * Collection
 *******************************
 ******************************/
router
    .route('/collection/:collectionId')
    .put(function(req, res){
        var response = {};

        collectionModel.findById(req.params.collectionId, function(err, collection){
            if (err) {
                response = {error: true, message: 'Error while fetching data'};
                res.json(response);
            } else {
                if (req.body.glued !== undefined) {
                    collection.glued = req.body.glued;
                }

                if (req.body.duplicate !== undefined && req.body.duplicate > 0) {
                    collection.duplicate = req.body.duplicate;
                }

                collection.save(function(err) {
                    if (err) {
                        response = {error: true, message: 'Error while updating data'};
                    } else {
                        response = {error: false, collection: collection};
                    }

                    res.json(response);
                });
            }
        });
    })
;

app.use('/', router);

app.listen(3005);

console.log('Listening to PORT 3005');
