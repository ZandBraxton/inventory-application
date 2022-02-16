var express = require('express');
var router = express.Router();


let game_controller = require('../controllers/gamecontroller')
let platform_controller = require('../controllers/platformController')
let genre_controller = require('../controllers/genreController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//All games
router.get('/video-games', game_controller.game_list);


router.get('/video-games/add', game_controller.game_create_get)

router.post('/video-games/add', game_controller.game_create_post)

//Single Game
router.get('/video-games/game/:id', game_controller.game_detail);






//All platforms
router.get('/platforms', platform_controller.platform_list);


//All genres
router.get('/genres', genre_controller.genre_list);


module.exports = router;
