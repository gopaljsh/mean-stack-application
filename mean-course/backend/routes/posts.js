const express = require('express');
const multer = require('multer');
//model imported
const Post = require('../models/post')

const router = express.Router();

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if(isValid) {
            error = null;
        }
        callback(error, "backend/images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});


//POSt method
router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });
    post.save()
        .then((createdPost) => {
            res.status(201).json({
                message: 'Post added successfully',
                post: {
                    ...createdPost,
                    imagePath: createdPost.imagePath
                }
            });
        })
})

//UPDATE method
router.put('/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post)
        .then((responseData) => {
            res.status(200).json({
                message: 'Post updated successfully'
            })
        })
})

//GET single post
router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
        .then ((singlePost) => {
            res.status(200).json(singlePost);
        })
});

//GET method
router.get('', (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: 'Post fetched successsfully',
                posts: documents
            });
        })
});

router.delete('/:id', (req, res, next) => {
    Post.deleteOne({
        _id: req.params.id
    }).then(() => {
        res.status(200).json({
            message: 'Post fetched successsfully'
        });
    }).catch((err) => {
        console.log(err);
    })
});

module.exports = router;