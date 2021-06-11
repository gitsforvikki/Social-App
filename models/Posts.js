const mongoose = require('mongoose');

const PostsSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    text : {type : String , required :true},
    image : {type : String , required :true},
    name : {type : String , required :true},
    avatar : {type : String , required :true},
    likes : [
        {
            user:{type : mongoose.Schema.Types.ObjectId , ref:'user'}
        }
    ],
    comments :[
        {
            user:{type : mongoose.Schema.Types.ObjectId , ref:'user'},
            text : {type : String},
            name : {type : String},
            avatar : {type : String},
            date: {type : Date , default:Date.now()},
        }
    ]
} , {timestamps : true});

Post = mongoose.model('posts' , PostsSchema);
module.exports = Post;