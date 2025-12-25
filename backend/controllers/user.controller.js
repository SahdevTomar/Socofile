import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import { Post } from "../models/post.model.js";


export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            });

        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: " User already exists",
                success: false
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            message: " user created successfully",
            success: true,
        });
        
    }
    catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            });
    
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false

            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "inavaild credentials",
                success: false
            });
        }
        const token = await jwt.sign(
          { userId: user._id },
          process.env.SECRET_KEY,
          { expiresIn: "1d" }
        );
        //populate each post if in the post array
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    post.author = user;
                    return post;
                }
                return null;
            })
        )
        
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            gender: user.gender,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts

        }
        
        return res.cookie('token', token, {
            httpOnly:true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000
        }).json({
            message: "User logged in successfully",
            success: true,
            user
                
        });
    } catch (error) {
        console.log(error);
    }
};


export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "User logged out successfully",
            success: true
        });
        
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select("-password");
        return res.status(200).json({
            message: "User fetched successfully",
            success: true,
            user
        })
    } catch (error) {
        ;
        console.log(error);
    }
};


export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;
        if (profilePicture) {
            cloudResponse = await getDataUri(profilePicture);
        }
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;
        await user.save();
        return res.status(200).json({
            message: "User updated successfully",
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: "No users found",
                success: false
           })
        }
        
        return res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            suggestedUsers
        })

    }catch (error) {
        console.log(error);
    }
}

export const FollowOrUnfollowUser = async(req, res) => {
    try {
        const user = req.id;
        const userId = req.params.id;
        if (user === userId) {
            return res.status(400).json({
                message: "You can't follow yourself",
                success: false
            })
        }
        const userToFollow = await User.findById(userId);
        const currentUser = await User.findById(user);
       
        if (!userToFollow || !currentUser) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }
        const isFollowing = currentUser.following.includes(userId);
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: user }, { $pull: { following: userId } }),
                User.updateOne({_id:userId},{$pull:{followers:user}})
            ])
            return res.status(200).json({
                message: "User unfollowed successfully",
                success: true
            })
        } else {
            await Promise.all([
                User.updateOne({ _id: user }, { $push: { following: userId } }),
                    
                User.updateOne({ _id: userId }, { $push: { followers: user } })
            ])
        }
        return res.status(200).json({
            message: "User followed successfully",
            success: true
        })
    }catch(error){
        console.log(error);
    }
}

