const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const Cates = require("../models/Categories.model");
const Products = require("../models/products.model");

const adminLayout = "../views/layouts/admin";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

/**
 * GET CATEGORY -ok
 */
router.get("/insertcate", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin page",
      description: "Trang chỉnh sửa hệ thống",
    };
    res.render("admin/insert_cate", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET LIST CATEGORY -ok
 */
router.get("/listcate", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "List category",
    };
    const data = await Cates.find();
    res.render("admin/list_cate", {
      data,
      locals,
      message: "",
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET CATEGORY by ID -ok
 */
router.get("/cate/:id", async (req, res) => {
  try {
    Cates.find().then(function (data) {
      item = data;
      Products.find({ cateID: req.params.id }).then(function (data) {
        console.log(data);
        res.render("user/cate_view", { danhsach: data });
      });
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * DELETE CATEGORY -ok
 */
router.delete("/delete_cate/:id", async (req, res) => {
  try {
    await Cates.deleteOne({ _id: req.params.id });
    res.redirect("/listcate");
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET EDIT CATEGORY -ok
 */
router.get("/edit-cate/:id", async (req, res) => {
  try {
    const locals = {
      title: "Edit Category",
    };
    const data = await Cates.findOne({ _id: req.params.id });
    res.render("admin/edit_cate", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * PUT EDIT CATEGORY -ok
 */
router.put("/edit-cate/:id", authMiddleware, async (req, res) => {
  try {
    await Cates.findByIdAndUpdate(req.params.id, {
      namecate: req.body.namecate,
      updatedAt: Date.now(),
    });
    res.redirect("/listcate");
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST CATEGORY -ok
 */

router.post("/insertcate", async (req, res) => {
  try {
    try {
      const newCate = new Cates({
        namecate: req.body.namecate,
      });

      await Cates.create(newCate);
      Cates.find().then(function (data) {
        res.render("admin/list_cate", {
          data: data,
          message: "Thêm mới thành công",
          layout: adminLayout,
        });
      });
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        res.render("admin/insert_cate", {
          message: "Thêm mới không thành công.",
          layout: adminLayout,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
