import express from "express";
import {FollowOrUnfollowUser, getProfile, getSuggestedUsers, login,logout,register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
 
import { User } from "../models/user.model.js";


const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route("/profile/edit").post(isAuthenticated, upload.single('profilePicture'),updateProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followOrunfollow/:id').post(isAuthenticated, FollowOrUnfollowUser);

export default router;
