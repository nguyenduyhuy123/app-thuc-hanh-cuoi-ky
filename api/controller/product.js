const express = require("express");
const product = express.Router();
var multer = require("multer");

const Cates = require("../models/Categories.model");
const Products = require("../models/products.model");
const User = require("../models/user.model");

const adminLayout = "../views/layouts/admin";

/**
 * Upload
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log(file);
    if (
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/PNG" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/gif"
    ) {
      cb(null, true);
    } else {
      return cb(new Error("Only image are allowed!"));
    }
  },
}).single("image");

/**
 * GET list products
 */
product.get("/admin/list-product", (req, res) => {
  if (req.session.loggin) {
    User = req.user;
    if (User.role == "admin") {
      let perPage = 12; // số lượng sản phẩm xuất hiện trên 1 page
      let page = req.params.page || 1;
      Products.find() // find tất cả các data
        .sort({ date: "descending" })
        .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .exec((err, data) => {
          Products.countDocuments((err, count) => {
            // đếm để tính có bao nhiêu trang
            if (err) return next(err);

            res.render("admin/list_product", {
              danhsach: data,
              message: "",
              current: page, // page hiện tại
              pages: Math.ceil(count / perPage),
              layout: adminLayout,
            });
          });
        });
    } else {
      res.redirect("/dashboard");
    }
  } else {
    res.redirect("/dashboard");
  }
});

/**
 * GET Admin Insert Product -ok
 */
product.get("/admin/insert-product", async (req, res) => {
  try {
    const locals = {
      title: "Insert product",
      description: "Trang chỉnh sửa hệ thống"
    };
    const data = await Cates.find();
    res.render("admin/insert_product", { locals, message: '', data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST Product -ok
 */

product.post("/insert-product", (req, res) => {
    upload(req, res, async function(err) {
        const data = await Cates.find();
        if (err instanceof multer.MulterError) {
            res.render("admin/insert_product", {
                message: "Không thể tải lên!!!",
                layout: adminLayout,
                data
            });
        } else if (err) {
            res.render("admin/insert_product", {
                message: "Định dạng file tải lên không hỗ trợ!!!",
                layout: adminLayout,
                data
            });
        } else {
            const newProduct = new Products({
                name: req.body.name,
                price: req.body.price,
                note: req.body.note,
                cateID: req.body.cateID,
                image: req.file.filename
            });
            
            Products.save(function(err) {
                if (err) {
                    res.render("admin/insert_product", {
                         message: "Lỗi tải lên!!!", 
                         layout: adminLayout,
                         data
                        });
                } else {
                    res.redirect("/admin/list-product");
                }
            });
        }
    });
});


module.exports = product;
