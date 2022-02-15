let Genre = require('../models/genre')

exports.genre_list = function(req, res, next) {
    Genre.find({}, 'name')
        .sort({name : 1})
        .exec(function (err, list_genres) {
            if (err) {return next(err); }

            res.render('genre_list', {title: 'All Genres', genre_list: list_genres})
        })
}