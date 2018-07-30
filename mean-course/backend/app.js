const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

//model imported
const Post = require('./models/post')

// body-parse middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Mongo database connection
const db = 'mongodb+srv://gops:zEryTIOtfW3T8epM@cluster0-adefd.mongodb.net/node-angular?retryWrites=true';
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to database')
    })
    .catch((err) => {
        console.log(err);
    })

// to connect to different port URL cor
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
    next();
});

//POSt method
app.post('/api/post', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    post.save()
        .then((createdPost) => {
            res.status(201).json({
                message: 'Post added successfully',
                postId: createdPost._id
            });
        })
})

app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Post fetched successsfully',
                posts: documents
            });
        })
});

app.delete('/api/post/:id', (req, res, next) => {
    Post.deleteOne({
        _id: req.params.id
    }).then(() => {
        res.status(200).json({
            message: 'Post fetched successsfully'
        });
    }).catch((err) => {
        console.log(err);
    })
})

module.exports = app;