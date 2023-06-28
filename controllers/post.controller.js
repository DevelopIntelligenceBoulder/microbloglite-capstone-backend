//Import our model so we can us it to interact with the realated data in MongoDB
const Post = require("../models/post.model")


//build our controller that will have our CRUD and other methods for our posts
const postController = {

    //method to get all records using async/await syntax
    getPosts: async function(req, res){

        //create base query
        let query = {}

        let limit = parseInt(req.query.limit) || 100
        let skip =  parseInt(req.query.offset) || 0

        //if firstName filter appears in query parameters then modify the query to do a fuzzy search
        if(req.query.username){
            query.username = req.query.username
        }

        //using a try/catch since we are using asyn/await and want to catch any errors if the code in the try block fails
        try {
            
            //use our model to find users that match a query.
            //{} is the current query which really mean find all the users
            //we use await here since this is an async process and we want the code to wait for this to finish before moving on to the next line of code
            let allPosts = await Post.find(query, { __v: 0 }).populate("likes", { __v: 0 }).limit(limit).skip(skip).sort({ createdAt: 'desc' })
            
            //return all the users that we found in JSON format
            res.json(allPosts)
            
        } catch (error) {
            console.log("error getting all users: " + error)
            //if any code in the try block fails, send the user a HTTP status of 400 and a message stating we could not find any users
            res.status(400).json({
                message: error.message,
                statusCode: res.statusCode
            })

        }
    },
    //method to create a new user
    createPost: async function(req, res){

        try {
            //store user data sent through the request
            const postData = req.body;
            postData.username = req.user.username

            //pass the userData to the create method of the User model
            let newPost = await Post.create(postData)

            //return the newly created user
            res.status(201).json(await Post.findById(newPost._id, {__v: 0}))
            
        } catch (error) {
            //handle errors creating user
            console.log("failed to create post: " + error)
            res.status(400).json({
                message: error.message,
                statusCode: res.statusCode
            })
        }

    },
    //method to get all users using async/await syntax
    getPost: async function(req, res){

        //using a try/catch since we are using asyn/await and want to catch any errors if the code in the try block fails
        try {

            //get the email address of the user from the url parameters
            const postId = req.params.postId;
            
            //use our model to find the user that match a query.
            //{email: some@email.com} is the current query which really mean find the user with that email
            //we use await here since this is an async process and we want the code to wait for this to finish before moving on to the next line of code
            let foundPost = await Post.findById(postId, {__v: 0}).populate("likes", {__v: 0})

            //if we found the user, return that user otherwise return a 404
            if(foundPost){
                res.json(foundPost)
            }else{
                res.status(404).send({
                    status: res.statusCode,
                    message: "Post Not Found!"
                })
            }
            
        } catch (error) {
            console.log("error getting post: " + error)
            //if any code in the try block fails, send the user a HTTP status of 400 and a message stating we could not find the user
            res.status(400).json({
                message: error.message,
                statusCode: res.statusCode
            })

        }
    },
    //method to get all users using async/await syntax
    deletePost: async function(req, res){

        //using a try/catch since we are using asyn/await and want to catch any errors if the code in the try block fails
        try {

            //get the email address of the user from the url parameters
            const postId = req.params.postId;
            
            //use our model to find the user that match a query.
            //{email: some@email.com} is the current query which really mean find the user with that email
            //we use await here since this is an async process and we want the code to wait for this to finish before moving on to the next line of code
            let foundPost = await Post.findById(postId)

            //if we found the user, return that user otherwise return a 404
            if(foundPost){
                Post.deleteOne(foundPost, (error) => {
                        if (error) throw error
                    });

                res.status(202).send({ message: "Post deleted", statusCode: res.statusCode });
            }else{
                res.status(404).send({
                    status: res.statusCode,
                    message: "Post Not Found!"
                })
            }
            
        } catch (error) {
            console.log("failed to delete post: " + error)
            //if any code in the try block fails, send the user a HTTP status of 400 and a message stating we could not delete the post
            res.status(400).json({
                message: error.message,
                statusCode: res.statusCode
            })

        }
    }
}

module.exports = postController;
