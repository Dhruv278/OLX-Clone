const express=require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserProfile, updatePassword, updateUserProfile, getAllUser, getUSerDetails, updateUserProfileByAdmin, deleteUSer } = require('../Controller/auth');
const router=express.Router();
const {isAuthenticatedUser, authorizeRole}=require('./../middlerwares/auth')

// const {regsisterUser}=require('../controllers/authController');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword);
router.route('/logout').get(logout)

router.route('/me').get(isAuthenticatedUser,getUserProfile);
router.route('/password/update').put(isAuthenticatedUser,updatePassword)
router.route('/me/update').put(isAuthenticatedUser,updateUserProfile)

router.route('/admin/users').get(isAuthenticatedUser,authorizeRole('admin'),getAllUser);
router.route('/admin/user/:id')
                                .get(isAuthenticatedUser,authorizeRole('admin'),getUSerDetails)
                                .put(isAuthenticatedUser,authorizeRole('admin'),updateUserProfileByAdmin)
                                .delete(isAuthenticatedUser,authorizeRole('admin'),deleteUSer);
module.exports=router;
