import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comments.model.js";
import { populate } from "dotenv";


export const addNewPost = async(req, res) => {
    try{
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if(!image) {
            return res.status(400).json({
                message: "Image is required",
                success: false
            });
        }

        //image upload 
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg' , { quality: 80 })
            .toBuffer();
        
        
        //buffer to data uri 
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });
        const user = await User.findById(authorId);
        if (user) {
            user.post.push(post._id);
            await user.save();
        }
        await post.populate({ path: 'author', select: '-password' });
       
        return res.status(201).json({
            message: "Post created successfully",
            success: true,
            post
        });
      }
    catch (error) {
        console.log(error);
    }
};

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'usernsame profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            message: "Posts fetched successfully",
            success: true,
            posts
        });
    } catch (error) {
        console.log(error);
    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'username profilePicture'
            }).populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username , profilePicture'
                }
            });
        return res.status(200).json({
            message: "Posts fetched successfully",
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const likePost = async  (req, res) => {
    try {
        const likerId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }
        await post.updateOne({ $addToSet: { likes: likerId } });
        await post.save();


        return res.status(200).json({
            message: "Post liked successfully",
            success: true,
            post
        });
    } catch (error) {
        console.log(error);
    }
};
export const unLikePost = async  (req, res) => {
    try {
        const likerId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }
        await post.updateOne({ $pull: { likes: likerId } });
        await post.save();


        return res.status(200).json({
            message: "Post unliked successfully",
            success: true,
            post
        });
    } catch (error) {
        console.log(error);
    }
};

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commenterId = req.id;
        const { text } = req.body;
        const post = await Post.findById(postId);

        if (!text) return res.status(404).json(
            {
                message: "Text is required",
                success: false
            }
        )
        const comment = await Comment.create({
            text,
            author: commenterId,
            post: postId
        })
        await comment.populate({
            path: 'author',
            select: 'username profilePicture'
        })
        post.comments.push(comment._id);
        await post.save();
        return res.status(201).json({
            message: "Comment added successfully",
            success: true,
            comment
        })

    } catch (error) {
        console.log(error);
    }
};

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const commets = await Comment.find({ post: postId }).populate('author', 'username profilePicture');
        
        if (!commets) {
            return res.status(404).json({
                message: "Comments not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Comments fetched successfully",
            success: true,
            commets
        })
        
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.Id;
        
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }
        if (post.author.toString()  !== authorId) {
            return res.status(401).json({
                message: "You are not authorized to delete this post",
                success: false
            });
        }
        await Post.findByIdAndDelete(postId);
     // remove the ost id from user posts
        let user = await User.findById(authorId);

        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // del associcated comment with that post 
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            message: "Post deleted successfully",
            success: true
        })
       
    } catch (error) {
        console.log(error);
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }
        const user = await User.findById(authorId);
        if (user.bookmarks.includes(postId._id)) {
            //already includes meas we have to do remove it fro collection
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                message: "Post removed from bookmarks",
                success: true
            })
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                message: "Post added to bookmarks",
                success: true
            })
        }
        
     
    } catch (error) {
        console.log(error);
    }

}