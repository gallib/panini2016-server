var express    = require('express');
var bodyParser = require('body-parser');
var mongoOp    = require('./models/mongo');
var cors       = require('cors');
var app        = express();
var router     = express.Router();

/*for (var i = 0; i < data.length; i++) {
    var db = new mongoOp();
    db.name = data[i].name;
    db.stickers = data[i].stickers;
    db.save();
}*/

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));

router
    .route('/team')
    .get(function(req, res) {
        var response = {};

        mongoOp.find({}, function(err, data){
            if (err) {
                response = {'error': true, 'message': 'Error while fetching data'};
            } else {
                response = {'error': false, 'data': data};
            }

            res.json(response);
        });
    })
    .post(function(req, res) {
        var db = new mongoOp();
        var response = {};

        db.save(function(err) {
            if (err) {
                console.log(err);
                response = {'error': true, 'message': 'Error while adding data'};
            } else {
                response = {'error': false, 'message': 'Data added'};
            }

            res.json(response);
        });
    })
;

router
    .route('/team/:teamId/sticker/:stickerId')
    .put(function(req, res){
        var response = {};

        mongoOp.findById(req.params.teamId, function(err, team){
            var sticker = team.stickers.id(req.params.stickerId);

            if (err || !sticker) {
                response = {'error': true, 'message': 'Error while fetching data'};
                res.json(response);
            } else {
                if (req.body.glued !== undefined) {
                    sticker.glued = req.body.glued;
                }

                if (req.body.duplicate !== undefined && req.body.duplicate > 0) {
                    sticker.duplicate = req.body.duplicate;
                }

                team.save(function(err) {
                    if (err) {
                        response = {'error': true, 'message': 'Error while updating data'};
                    } else {
                        response = {'error': false, 'data': team};
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
