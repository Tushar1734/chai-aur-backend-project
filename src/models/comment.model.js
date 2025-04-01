import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const commentSchema= new Schema({

    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    content :{
        type:String,
        required:true,
        trim:true
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },




},{timestapes:true})

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment",commentSchema)