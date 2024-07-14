const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    name: String,
    email: String,
    movie_id: {
        type: mongoose.Types.ObjectId,
        ref: 'movies'
    },
    text: String,
    date: Date,
});

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;
