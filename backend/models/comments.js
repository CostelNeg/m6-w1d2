import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema({
    blogId :{
        type:Schema.Types.ObjectId
    },
    author:{
        type:String
    },
    content:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
},
{
    collection:"comments",
    timestamps:true
}
);
const Comment = model("Comment",commentSchema)
export default Comment