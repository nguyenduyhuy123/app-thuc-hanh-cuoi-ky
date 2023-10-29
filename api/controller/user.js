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

/* GET home page. */
router.get('/homehome', function(req, res, next) {
    if (req.session.loggin) {
        user = req.user
        if (user.role == "admin") {
            userModel.find({ role: "user" }).then(function(data) {
                listuser = data
                var total = 0;
                var arr = [];
                products.find().then(function(data) {
                    tour.find().then(function(tour1) {
                        var arr = tour1.filter(a => {
                            var arr1 = new Array(a);
                            return arr1;
                        })
                        for (var i = 0; i < arr.length; i++) {
                            total += parseInt(arr[i].price);
                        }
                        // console.log(total);
                        res.render("admin/index-admin", {
                            danhsach: data,
                            doanhthu: total
                        });
                    })

                })
            })
        } else {
            products.find().sort({ ngaynhap: "descending" }).limit(12).exec(function(err, data) {
                if (err) {
                    res.json({ "kq": 0, "errMsg": err });
                } else {

                    res.render("user/index", { danhsach: data });
                }
            })
        }

    } else {
        user = null;
        products.find().sort({ ngaynhap: "descending" }).limit(12).exec(function(err, data) {
            if (err) {
                res.json({ "kq": 0, "errMsg": err });
            } else {
                res.render("user/index", { danhsach: data });
            }
        })
    }
})

/**
 * GET Home page -ok
 */ 
router.get('', function(req, res, next) {
    try {
        const locals = {
          title: "Home page"
        }
        res.render('index', {locals});
    } catch (error) {
        console.log(error);
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