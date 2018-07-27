const express = require('express');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
    next();
});
app.use('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: "123",
            title: 'First post',
            content: 'this is just first post'
        },
        {
            id: "132",
            title: 'Second post',
            content: 'this is just Second post'
        },
        {
            id: "188",
            title: 'Third post',
            content: 'this is just Third post'
        }
    ];
    res.status(200).json({
        message: 'Post fetched successsfully',
        posts: posts
    });
});

module.exports = app;