//bring in mongoose so we can create a schema that represents the data for a Like
const mongoose = require('mongoose');

const opts = { timestamps: { createdAt: true, updatedAt: false } };
//Create our schema using mongoose that contains the fields and their data types for our Likes
//More info: https://mongoosejs.com/docs/schematypes.html
const likeSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        minlength: 3
    },
}, opts)

likeSchema.index({ postId: 1, username: 1 }, { unique: true });

//Generate the model our code with interact with from the above schema
//Models allow us to interact with the data inside our MongoDB collections
//More info: https://mongoosejs.com/docs/models.html
const Like = mongoose.model('Like', likeSchema);

//export our model
module.exports = Like;