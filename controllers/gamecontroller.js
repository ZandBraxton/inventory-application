let Game = require('../models/game');
let Platform = require('../models/platform')
let Genre = require('../models/genre')
const {body,validationResult} = require('express-validator')

let async = require('async')

//get list of all games
exports.game_list = function(req, res, next) {
    Game.find({}, 'title price')
        .sort({title : 1})
        .populate('platform')
        .exec(function (err, list_games) {
            if (err) {return next(err); }
            //Success!
            res.render('game_list', { title: 'All Games', game_list: list_games})
        })
}

//get details of one game
exports.game_detail = function(req, res, next) {
    Game.findById(req.params.id)
        .populate('platform')
        .populate('genre')
        .exec(function (err, game) {
            if (err) {return next(err)}
            if (game==null) {
                let err = new Error('Game not found')
                err.status = 404;
                return next(err)
            }
            res.render('game_detail', {title: game.title, game: game})
        })
}



exports.game_create_get = function(req, res, next) {

    async.parallel({
        platforms: function(callback) {
            Platform.find(callback)
        },
        genres: function(callback) {
            Genre.find(callback)
        },

    }, function(err, results) {
        if (err) {return next(err)}
        res.render('game_add', {platforms: results.platforms, genres: results.genres})
    });

}

exports.game_create_post = [

    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre === 'undefined')
            req.body.genre = []
            else
            req.body.genre = new Array(req.body.genre)
        }
        next()
    },

    (req, res, next) => {
        if(!(req.body.platform instanceof Array)){
            if(typeof req.body.platform === 'undefined')
            req.body.platform = []
            else
            req.body.platform = new Array(req.body.platform)
        }
        next()
    },

    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Invalid Price.').trim().isLength({ min: 1 }).escape(),
    body('stock', 'Invalid Stock.').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),
    body('platform.*').escape(),

    (req, res, next) => {
        const errors = validationResult(req)

        let game = new Game(
            {
                title: req.body.title,
                summary: req.body.summary,
                price: req.body.price,
                stock: req.body.stock,
                genre: req.body.genre,
                platform: req.body.platform
            })

        if (!errors.isEmpty()) {


            async.parallel({
                platforms: function(callback) {
                    Platform.find(callback)
                },
                genres: function(callback) {
                    Genre.find(callback)
                },
        
            }, function(err, results) {
                if (err) {return next(err)}

                // for (let i = 0; i < results.genres.length; i++) {
                //     if (game.genre.indexOf(results.genres[i]._id) > -1) {
                //         results.genres[i].checked='true';
                //     }
                // }
                // for (let i = 0; i < results.platforms.length; i++) {
                //     if (game.platform.indexOf(results.platforms[i]._id) > -1) {
                //         results.platforms[i].checked='true';
                //     }
                // }
                res.render('game_add', {platforms: results.platforms, genres: results.genres, game: game, errors: errors.array()})
            });
            return
        }
        else {
            game.save(function (err) {
                if(err) {return next(err)}
                res.redirect(game.url)
            });
        }
    }

]


