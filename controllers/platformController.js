let Platform = require('../models/platform')

exports.platform_list = function(req, res, next) {
    Platform.find({}, 'name')
        .sort({name : 1})
        .exec(function (err, list_platforms) {
            if (err) {return next(err); }

            res.render('platform_list', {title: 'All Platforms', platform_list: list_platforms})
        })
}