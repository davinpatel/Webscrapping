var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    _article: {
        type: String,
        ref: 'Article'
    },
    body: String
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
