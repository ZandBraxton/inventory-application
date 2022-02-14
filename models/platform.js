let mongoose = require ('mongoose');

let Schema = mongoose.Schema

let PlatformSchema = new Schema(
    {
        name: {type: String, required: true, minlength: 3},
        summary: {type: String, required: true}
    }
);

PlatformSchema
.virtual('url')
.get(function () {
    return '/genres' + this._id;
});

module.exports = mongoose.model('Platform', PlatformSchema);