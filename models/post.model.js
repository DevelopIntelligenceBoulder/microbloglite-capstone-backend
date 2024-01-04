//bring in mongoose so we can create a schema that represents the data for a Post
const mongoose = require('mongoose');

const opts = { toJSON: { virtuals: true }, id: false, timestamps: { createdAt: true, updatedAt: false } };
//Create our schema using mongoose that contains the fields and their data types for our Users
//More info: https://mongoosejs.com/docs/schematypes.html
const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1
    },
    username: {
        type: String,
        required: true,
        minlength: 3
    },
}, opts)

postSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'postId'
});


//Generate the model our code with interact with from the above schema
//Models allow us to interact with the data inside our MongoDB collections
//More info: https://mongoosejs.com/docs/models.html
const Post = mongoose.model('Post', postSchema);

//export our model
module.exports = Post;