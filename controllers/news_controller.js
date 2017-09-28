var Article = require('../models/article');
var Comment = require('../models/comment');
var cheerio = require('cheerio');
var request = require('request');

// export the routes
module.exports = function(app) {
    // get root
    app.get('/', function(_request, response) {
        var scrapings = [];
        request('https://www.nytimes.com/', function(_error, _response, html) {
            var $ = cheerio.load(html);
            $('.title').each(function(i, element) {
                if (i % 2 !== 0) {
                    var articleObject = {};
                    articleObject.id = i;
                    articleObject.title = $('a', element).first().text();
                    articleObject.link = $('a', element).attr('href');
                    articleObject.origin = $(element).children().children().text();
                    scrapings.push(articleObject);
                }
            });
            response.render('index', {
                articles: scrapings
            });
        });
    });

    // api route for all saved articles
    app.get('/api/articles', function(_request, response) {
        Article.find({}, function(error, articles) {
            if (error) {
                response.send(error);
            } else {
                var articleMap = articles.map(function(article) {
                    return article;
                });
                response.json(articleMap);
            }
        });
    });

    app.post('/articles', function(request, response) {
        var article = request.body;
        Article.create(article, function(error, _article) {
            if (error) {
                response.send(error);
            } else {
                response.redirect('/');
            }
        });
    });

    app.get('/articles', function(_request, response) {
        Article.find({})
            .populate('comments')
            .exec(function(error, articles) {
                if (error) {
                    response.send(error);
                } else {
                    var articleMap = articles.map(function(article) {
                        return article;
                    });
                    response.render('articles', {
                        articles: articleMap
                    });
                }
            });
    });

    app.delete('/articles/:id', function(request, response) {
        var articleId = request.params.id;
        Article.remove({ _id: articleId }, function(error, _article) {
            if (error) {
                response.send(error);
            } else {
                response.redirect('/articles');
            }
        });
    });

    app.post('/comments', function(request, response) {
        var comment = request.body;
        Article.findOne({
            title: comment.article_title
        }, function(error, article) {
            Comment.create({
                _article: article._id,
                body: comment.body
            }, function(error, comment) {
                article.comments.push(comment);
                article.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.redirect('/articles');
                    }
                });
            });
        });
    });

    app.delete('/comments/:id', function(request, response) {
        var commentId = request.params.id;
        Comment.remove({ _id: commentId }, function(error, _comment) {
            if (error) {
                response.send(error);
            } else {
                response.redirect('/articles');
            }
        });
    });
};
