const Item =require('./../model/item');
const catchAsync=require('./../middlerwares/catchAsync');
const ErrorHandler=require('../utils/errorHandler')
const APIFeatures=require('../utils/apiFeatures');

// Create items
exports.createNewItem=catchAsync(async (req,res,next)=>{
    req.body.seller=req.user._id;
    const item=await Item.create(req.body);
    res.status(200).json({
        success:true,
        item
    })
})

// Find unsold items
exports.findUnsoldItem=catchAsync(async (req,res,next)=>{
    // console.log("work1");
    const items=await Item.find({status:'Unsold'});
    console.log(items);
    res.status(200).json({
        status:"success",
        items
    })
})




// Find sold items for perticular user
exports.findItemForUser=catchAsync(async (req,res,next)=>{
    // console.log("work1");
    const items=await Item.find({seller:req.user._id});
    console.log(items);
    res.status(200).json({
        status:"success",
        items
    })
})

// find purchase for single User

exports.findPurchaseItemForUser=catchAsync(async (req,res,next)=>{
    // console.log("work1");
    const items=await Item.find({buyer:req.user._id});
    console.log(items);
    res.status(200).json({
        status:"success",
        items
    })
})



// Buy product

exports.buyProduct=catchAsync(async(req,res,next)=>{
    const product=await Item.findById(req.body.id);
    product.buyer=req.user._id;
    product.status='Sold';
    await product.save();

    res.save(200).json({
        status:'success',
        product
    })
})



// find