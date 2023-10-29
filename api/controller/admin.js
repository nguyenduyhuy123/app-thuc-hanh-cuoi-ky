const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");

const User = require('../models/user.model');

const adminLayout = '../views/layouts/admin';

const jwtSecret = process.env.JWT_SECRET;

/**
 *
 * Check Login 1 -ok
 */
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
 * GET/
 * Login - ok
 */
router.get('/login', function(req, res, next) {
  try {
    const locals = {
      title: "Sign in"
    }
    res.render('login', {locals, message:''});
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Login / sign in -ok
 */
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('login', {message: 'Tài khoản không tồn tại.'});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.render('login', {message: 'Mật khẩu không chính xác.'});
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET/
 * Register -ok
 */

router.get('/register', function(req, res, next) {
  try {
    const locals = {
      title: "Sign up"
    }
    res.render('register', {locals, message:''});
  } catch (error) {
    console.log(error);
  }
});

/**
 * POST /
 * Register -ok
 * fix lỗi chỗ redirect & render.
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(email, hashedPassword, name);
    
    try {
      const user = await User.create({ email, password: hashedPassword, name, role: 'user', lock:0 });
      res.render('login', {message:'User created successfully.'});
    } catch (error) {
      if (error.code === 11000) {
        res.render('register', {message: "User already in use."});
      }
      res.render('register', {message: "Internal server error."});
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin Logout -ok
*/
router.get('/logout', (req, res) => {
  res.clearCookie("token");
  //res.json({ message: 'Logout successful.'});
  res.redirect("/");
});

/**
 * GET /
 * Admin Dashboard 
*/
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin page",
      description: "Trang chỉnh sửa hệ thống",
    };
    // const data = await Post.find();
    res.render("admin/dashboard", {locals, layout: adminLayout});
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
