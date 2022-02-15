let Game = require('../models/game');
let Platform = require('../models/platform')
let Genre = require('../models/genre')

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