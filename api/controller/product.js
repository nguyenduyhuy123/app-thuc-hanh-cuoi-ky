const express = require("express");
const product = express.Router();
var multer = require("multer");

const Cates = require("../models/Categories.model");
const Products = require("../models/products.model");
const User = require("../models/user.model");

const adminLayout = "../views/layouts/admin";

/**
 * Upload file
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
 * GET list products for Customer:
 */
product.get("/", async (req, res) => {
  try {
    const locals = {
      title: "List products for customer",
    };
    const data = await Products.find();
    const cate = await Cates.find();
    const count = await Products.countDocuments();
    let perPage = 6;
    let page = req.params.page || 1;
    // console.log(data);

    res.render("index", {
      locals,
      message: "",
      danhsach: data,
      current: page,
      item: cate,
      pages: Math.ceil(count / perPage)
    });
    
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET list products -ok
 */
product.get("/admin/list-product", async (req, res) => {
  try {
    const locals = {
      title: "List products",
    };
    const data = await Products.find();
    const count = await Products.countDocuments();
    let perPage = 6;
    let page = req.params.page || 1;
    res.render("admin/list_product", {
      locals,
      message: "",
      data,
      current: page,
      pages: Math.ceil(count / perPage),
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET Admin Insert Product -ok
 */
product.get("/admin/insert-product", async (req, res) => {
  try {
    const locals = {
      title: "Insert product",
      description: "Trang chỉnh sửa hệ thống",
    };
    const data = await Cates.find();
    res.render("admin/insert_product", {
      locals,
      message: "",
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST Product -ok
 */

product.post("/insert-product", (req, res) => {
  upload(req, res, async function (err) {
    const data = await Cates.find();
    if (err instanceof multer.MulterError) {
      console.log(err);
      res.render("admin/insert_product", {
        message: "Không thể tải lên!!!",
        layout: adminLayout,
        data,
      });
    } else if (err) {
      res.render("admin/insert_product", {
        message: "Định dạng file tải lên không hỗ trợ!!!",
        layout: adminLayout,
        data,
      });
    } else {
      try {
        const newProduct = new Products({
          name: req.body.name,
          price: req.body.price,
          note: req.body.note,
          cateID: req.body.cateID,
          image: req.file.filename,
        });
        await Products.create(newProduct);
        res.redirect("/admin/list-product");
      } catch (error) {
        console.log(error);
      }
    }
  });
});

/**
 * DELETE Product -ok
 */
product.get("/delete-product/:id", async (req, res) => {
  try {
    await Products.deleteOne({ _id: req.params.id });
    res.redirect("/admin/list-product");
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET EDIT Product -ok
 */
product.get("/admin/edit-product/:id", async (req, res) => {
  try {
    const locals = {
      title: "Edit Product",
    };
    const data = await Products.findOne({ _id: req.params.id });
    const item = await Cates.find();
    res.render("admin/edit_product", {
      locals,
      data,
      item,
      message: "",
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * PUT EDIT Products -ok
 */

product.put("/admin/edit-product/:id", (req, res) => {
  upload(req, res, async function (err) {
    if (!req.file) {
      try {
        await Products.findByIdAndUpdate(req.params.id, {
          name: req.body.name,
          cateID: req.body.cateID,
          note: req.body.note,
          price: req.body.price,
          updatedAt: Date.now(),
        });
        res.redirect("/admin/list-product");
      } catch (error) {
        console.log(error);
      }
    } else {
      if (err instanceof multer.MulterError) {
        console.log(err);
      } else {
        try {
          await Products.findByIdAndUpdate(req.params.id, {
            image: req.file.filename,
            name: req.body.name,
            cateID: req.body.cateID,
            note: req.body.note,
            price: req.body.price,
            updatedAt: Date.now(),
          });
          res.redirect("/admin/list-product");
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
});



module.exports = product;
