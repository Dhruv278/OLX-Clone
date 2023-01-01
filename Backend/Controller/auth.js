const User=require('../model/user');
const sendToken=require('./../utils/jwtToken');
const ErrorHandler=require('../utils/errorHandler');
const catchAsync=require('../middlerwares/catchAsync');
const sendMail = require('../utils/sendMail');
const crypto=require('crypto');

exports.registerUser=catchAsync(async(req,res,next)=>{
    const {name,email,password}=req.body;
    
    const user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:'d',
            url:'d'
        }
    })
    // const token =user.getJwtToken(); 
    sendToken(user,200,res)
})


exports.loginUser=catchAsync(async(req,res,next)=>{
    const {email,password}=req.body;


    if(!email ||!password){
        return next(new ErrorHandler('Please enter deatils',404))

    }


    const user=await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHandler('Invalid Email or Password',401))

    }

    // checking if password is coorect 
    const isPasswordMatched=await user.comparePassword(password) ;

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid Email or Password',401));

    }
    // const token=user.getJwtToken();

    sendToken(user,200,res);


})


exports.logout=catchAsync(async(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:'Logged out'
    })

})

exports.forgotPassword=catchAsync(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler('User not found with this email Id ',404));

    }

    const resetToken=user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});


    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message=`Your password reset token is as follow :\n\n${resetUrl}\n\nIf you have not requested this email,then ignore it.`

    try{
        await sendMail({
            email:user.email,
            subject:'OLX Password Recovery',
            message
        })

        res.status(200).json({
            success:true,
            message:`Email sent to: ${user.email}`
        })

    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave:false});
         
        return next(new ErrorHandler(error.message,500))
    }

})


exports.resetPassword=catchAsync(async(req,res,next)=>{
    const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}

    })

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired ',400))

    }
    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match',400))

    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    sendToken(user,200,res);

})

exports.getUserProfile=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
})

exports.updatePassword=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select('+password');
    // console.log(user)
   const isMAtched=await user.comparePassword(req.body.oldPassword)

   if(!isMAtched){
    return next(new ErrorHandler('Old password is incoorect',400))

   }

   user.password=req.body.password;
   await user.save();

   sendToken(user,200,res)
})




exports.updateUserProfile =catchAsync(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email
    }

    // UPDATE user avatar

    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        user
    })
})

exports.getAllUser=catchAsync(async(req,res,next)=>{
    const users=await User.find();

    res.status(200).json({
        success:true,
        users
    })

})


exports.getUSerDetails=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler('User does not found ...'))
    }

    res.status(200).json({
        success:true,
        user
    })
})


exports.updateUserProfileByAdmin =catchAsync(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    // UPDATE user avatar

    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        user
    })
})



exports.deleteUSer=catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler('User does not found ...'))
    }


    // Delete Avatar of user

    await user.remove()

    res.status(200).json({
        success:true,
        user
    })
})
