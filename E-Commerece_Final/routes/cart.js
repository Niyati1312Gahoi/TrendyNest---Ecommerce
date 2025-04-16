const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const Product = require('../models/product');
const User = require('../models/user');

router.get('/user/cart' , isLoggedIn , async(req,res)=>{
    const user = await User.findById(req.user._id).populate('cart');
    res.render('cart/cart' , {user, stripekey:'pk_test_51QnoP5PJGxUIqjvWFjNfgpQUvi3uWBatSVnSEfzyYaFTstnuFO2gEzeCyavZiK8eqcwGBye199bQQ2kZuyxMSO53001BMgxJCO'});
})


router.post('/user/:productId/add' , isLoggedIn , async(req,res)=>{
    let {productId} = req.params;
    let userId = req.user._id;
    let product = await Product.findById(productId);
    let user = await User.findById(userId);
    user.cart.push(product);
    await user.save();
    res.redirect('/user/cart'); 
})

module.exports = router;