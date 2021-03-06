const express = require('express');
const multer = require('multer');
//model imported
const Post = require('../models/post')
const checkAuth = require('../middleware/check-auth');

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
router.post('', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });

    post.save()
        .then((createdPost) => {
            res.status(201).json({
                message: 'Post added successfully',
                post: {
                    ...createdPost,
                    id: createdPost._id
                }
            });
        })
});

//UPDATE method
router.put('/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
        .then((responseData) => {
            if(responseData.nModified > 0) {
                res.status(200).json({
                    message: 'Post updated successfully'
                });
            } else {
                res.status(401).json({
                    message: "Your not authorised to update !"
                });
            }
            
        })
});

//GET single post
router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id)
        .then ((singlePost) => {
            res.status(200).json(singlePost);
        })
});

//GET method
router.get('', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage -1))
            .limit(pageSize)
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Post fetched successsfully',
                posts: fetchedPosts,
                maxPosts: count
            });
        })
});

router.delete('/:id', checkAuth, (req, res, next) => {
    Post.deleteOne({
        _id: req.params.id,
        creator: req.userData.userId
    }).then((result) => {
        if(result.n > 0) {
            res.status(200).json({
                message: 'Post fetched successsfully'
            });
        } else {
            res.status(401).json({
                message: 'You are not authorized to delete post'
            });
        }
    }).catch((err) => {
        console.log(err);
    })
});

module.exports = router;