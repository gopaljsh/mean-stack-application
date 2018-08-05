const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();


router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new user({
                email: req.body.email,
                password: req.body.password
            })

            user.save()
                .then((result) => {
                    res.status(200).json({
                        message: "User register successfully",
                        result: result
                    })
                })
        })

});

module.exports = router;