const express = require("express");
const router = express.Router();

const Cates = require("../models/Categories.model");
const Products = require("../models/products.model");
const Contacts = require("../models/contacts.model");

const adminLayout = "../views/layouts/admin";

/**
 * GET LIST notification -ok
 */
router.get("/list-notification", async (req, res) => {
  try {
    const locals = {
      title: "List notifications",
    };
    const data = await Contacts.find();
    res.render("admin/notification", {
      data,
      locals,
      message: "",
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/contact", (req, res) => {
    
});

module.exports = router;
