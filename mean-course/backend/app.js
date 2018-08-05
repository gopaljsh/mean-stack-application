const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const postRoutes = require('./routes/posts.js');
const userRoutes = require('./routes/user.js');

// body-parse middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')))

//Mongo database connection
const db = 'mongodb+srv://gops:zEryTIOtfW3T8epM@cluster0-adefd.mongodb.net/node-angular';
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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
    next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;