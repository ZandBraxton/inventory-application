#! /usr/bin/env node

// Get arguments passed on command line
let userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
let async = require('async')
let Game = require('./models/game')
let Platform = require('./models/platform')
let Genre = require('./models/genre')


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let platforms = []
let genres = []
let games = []

function platformCreate(name, summary, cb) {
  platformdetail = {
    name: name,
    summary: summary
  }

  
  let platform = new Platform(platformdetail);
       
  platform.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Platform: ' + platform);
    platforms.push(platform)
    cb(null, platform)
  }  );
}

function genreCreate(name, cb) {
  let genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function gameCreate(title, summary, price, stock, genre, platform, cb) {
  gamedetail = { 
    title: title,
    summary: summary,
    price: price,
    stock: stock,
  }
  if (genre != false) gamedetail.genre = genre
  if (platform != false) gamedetail.platform = platform
    
  let game = new Game(gamedetail);    
  game.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Game: ' + game);
    games.push(game)
    cb(null, game)
  }  );
}



function createPlatformsGenre(cb) {
    async.series([
        function(callback) {
          platformCreate('Playstation 4', 'Home video game console developed by Sony Computer Entertainment, the successor to the Playstation 3', callback);
        },
        function(callback) {
          platformCreate('Playstaion 5', 'Home video game console developed by Sony Computer Entertainment, the successor to the Playstation 4', callback);
        },
        function(callback) {
          platformCreate('Xbox Series X|S', 'Home video game consoles developed by Microsoft, the successor to the Xbox One family', callback);
        },
        function(callback) {
          platformCreate('Xbox One', 'Line of home video game consoles developed by Microsoft, the successor to the Xbox 360', callback);
        },
        function(callback) {
          platformCreate('Nintendo Switch', 'Video game console developed by Nintendo, a hybrid device capable of being docked for home use or used as a portable device', callback);
        },
        function(callback) {
          genreCreate("Action", callback);
        },
        function(callback) {
          genreCreate("Adventure", callback);
        },
        function(callback) {
          genreCreate("Casual", callback);
        },
        function(callback) {
          genreCreate("Fighting", callback);
        },
        function(callback) {
          genreCreate("Horror", callback);
        },
        function(callback) {
          genreCreate("Puzzle", callback);
        },
        function(callback) {
          genreCreate("Sports", callback);
        },
        ],
        // optional callback
        cb);
}


function createGames(cb) {
    async.parallel([
        function(callback) {
          gameCreate(
            'Elden Ring',
            'The Golden Order has been broken. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
            '59.99',
            '10',
            [genres[0],genres[1]], 
            [platforms[0],platforms[1],platforms[2],platforms[3]],
              callback);
        },
        function(callback) {
          gameCreate(
            'Forza Horizon 5',
            'Lead breathtaking expeditions across the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world’s greatest cars.',
            '59.99',
            '8',
            [genres[2]], 
            [platforms[2],platforms[3]],
              callback);
        },
        function(callback) {
          gameCreate(
            'Pokemon Legends: Arceus',
            'Get ready for a new kind of grand, Pokémon adventure in Pokémon Legends: Arceus, a brand new game from Game Freak that blends action and exploration with the RPG roots of the Pokémon series.',
            '59.99',
            '9',
            [genres[1], genres[2]], 
            [platforms[4]],
              callback);
        },
        ],
        // optional callback
        cb);
}




async.series([
    createPlatformsGenre,
    createGames,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Success');
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



