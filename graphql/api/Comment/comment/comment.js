import Comment from "../../../model/Comment";
import mongoose from "mongoose";
import Video from "../../../model/Video";
import User from "../../../model/User";

export default {
 Mutation: {
  //////////////////////////////////////////////////////////////////////////////////
  createComment: async (_, args) => {
   const { description, userId, videoId } = args;

   try {
    const newUserId = mongoose.Types.ObjectId(userId);

    const commentResult = await Comment.create({
     description,
     author: newUserId,
     createdAt: new Date().toString(),
    });

    const newCommentId = mongoose.Types.ObjectId(commentResult._id);

    const parentVideo = await Video.findOne({ _id: videoId });
    parentVideo.comments.push(newCommentId);
    parentVideo.save();
    const parentUser = await User.findOne({ _id: userId });
    parentUser.comments.push(newCommentId);
    parentUser.save();

    console.log(commentResult);
    return true;
   } catch (e) {
    console.log(e);
    return false;
   }
  },
  //////////////////////////////////////////////////////////////////////////////////
  deleteComment: async (_, args) => {
   const { id } = args;

   try {
    const result = await Comment.deleteOne({ _id: id });

    return true;
   } catch (e) {
    console.log(e);
    return false;
   }
  },
  //////////////////////////////////////////////////////////////////////////////////
  updateComment: async (_, args) => {
   const { id, description } = args;
   try {
    const result = await Comment.updateOne(
     { _id: id },
     {
      $set: {
       // mongodb 안에서 기능을 사용하고 싶을때 $(달러)를 사용함
       description,
      },
     }
    );
    return true;
   } catch (e) {
    console.log(e);
    return false;
   }
  },
 },

 Query: {
  //////////////////////////////////////////////////////////////////////////////////
  viewComments: async (_, args) => {
   const { videoId } = args;

   try {
    const result = await Video.findOne({ _id: videoId }).populate({
     path: `comments`,
     model: Comment,
     populate: {
      path: `author`,
      model: User,
     },
    });

    console.log(result);

    return result.comments;
   } catch (e) {
    console.log(e);
    return [];
   }
  },
 },
};
