var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'The title of the article is required.']
    },
    origin: {
        type: String,
        required: [true, 'The origin of the article is required.']
    },
    link: {
        type: String,
        required: [true, 'The link to the article is required.']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
