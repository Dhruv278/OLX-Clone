const express=require('express');
const router=express.Router();
const {createNewItem,findUnsoldItem, findItemForUser, findPurchaseItemForUser}=require('./../Controller/product');
const {isAuthenticatedUser}=require('./../middlerwares/auth');



router.get('/products',findUnsoldItem);
router.get('/myProducts',isAuthenticatedUser,findItemForUser);
router.get('/myPurchase',isAuthenticatedUser,findPurchaseItemForUser);
router.post('/createProduct',isAuthenticatedUser,createNewItem);

module.exports=router
