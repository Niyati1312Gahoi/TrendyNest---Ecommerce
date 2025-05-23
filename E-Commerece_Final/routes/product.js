const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { validateProduct , isLoggedIn  , isSeller ,isProductAuthor} = require('../middleware');


router.get('/products', async (req, res) => {
    
    try {
        const products = await Product.find({});
        res.render('products/index', { products });
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }
});


router.get('/products/new', (req, res) => {
    try {
        res.render('products/new');
    }
    catch (e) {
         res.status(500).render('error',{err:e.message})
    }  
});

router.post('/products',isLoggedIn,isSeller,validateProduct,async (req, res) => {
    
    try {
        const { name, img, desc, price } = req.body;
        await Product.create({ name, img, price: parseFloat(price), desc,author:req.user._id });
        req.flash('success', 'Successfully added a new product!');
        res.redirect('/products');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message })
    }
});

router.get('/products/:id',isLoggedIn, async (req, res) => {


    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('reviews');
        res.render('products/show', { product}); 
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }
});


router.get('/products/:id/edit',isLoggedIn,isProductAuthor, async (req, res) => {
    
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.render('products/edit', { product });
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }  
});

router.patch('/products/:id',isLoggedIn,isProductAuthor,validateProduct,async (req, res) => {
    

    try {
        const { id } = req.params;
        const { name, price, img, desc } = req.body;
        await Product.findByIdAndUpdate(id, { name, price, desc, img });
        req.flash('success', 'Edit Your Product Successfully');
        res.redirect(`/products/${id}`);
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
        
    } 
});


router.delete('/products/:id',isLoggedIn,isProductAuthor, async (req, res) => {
    
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect('/products');
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})   
    }
});




module.exports = router;