let mongoose = require ('mongoose');

let Schema = mongoose.Schema

let GameSchema = new Schema(
    {
        title: {type: String, required: true},
        summary: {type: String, required: true},
        price: {type: Number, required: true},
        stock: {type: Number, required: true},
        genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}],
        platform: [{type: Schema.Types.ObjectId, ref: 'Platform'}]
    }
);

GameSchema
.virtual('url')
.get(function () {
    return '/category/game' + this._id;
});

module.exports = mongoose.model('Game', GameSchema);