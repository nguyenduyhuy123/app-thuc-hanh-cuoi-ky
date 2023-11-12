var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var passport = require('passport');

const User = require('../models/user.model');

const Products = require('../models/products.model');

const { json } = require('express');

/**
 * GET/ Check role user
 */
router.get('/home', function(req, res, next) {
    if (req.session.loggin) {
        user = req.user
        if (user.role == "admin") {
            res.redirect('/dashboard');
        } else {
            res.redirect('/');
        }
    } else {
        user = null;
        res.redirect('/');
    }
});

router.get("/lock/:id", (req, res) => {
        userModel.findOne({ _id: req.params.id }, function(err, data) {
        data.lock = 1;
        data.save();
        res.redirect("/view_user");
    })
});
router.get("/unlock/:id", (req, res) => {
    userModel.findOne({ _id: req.params.id }, function(err, data) {
        data.lock = 0;
        data.save();
        res.redirect("/view_user");
    })
});


/*---------------Xoá tài khoản ------------------------*/

router.get("/delete-user/:id", (req, res) => {
    if (req.session.loggin) {
        userModel.deleteOne({ _id: req.params.id }, function(err, data) {
            req.session.destroy(function(err) {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            });
        })
    }
});

module.exports = router;