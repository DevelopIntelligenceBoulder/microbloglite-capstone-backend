//Import our model so we can us it to interact with the realated data in MongoDB
const Like = require("../models/like.model")


//build our controller that will have our CRUD and other methods for our posts
const likeController = {

    //method to create a new user
    createLike: async function(req, res){

        try {

            //store user data sent through the request
            const likeData = req.body;
            likeData.username = req.user.get("username")

            //pass the userData to the create method of the User model
            let newLike = await Like.create(likeData)

            //return the newly created user
            res.status(201).json(await Like.findById(newLike._id, {__v: 0}))
            
        } catch (error) {
            //handle errors creating user
            console.log("failed to create like: " + error)
            res.status(400).json({
                message: error.message,
                statusCode: res.statusCode
            })
        }

    },
    //method to get all users using async/await syntax
    deleteLike: async function(req, res){

        //using a try/catch since we are using asyn/await and want to catch any errors if the code in the try block fails
        try {

            //get the email address of the user from the url parameters
            const likeId = req.params.likeId;
            
            //use our model to find the user that match a query.
            //{email: some@email.com} is the current query which really mean find the user with that email
            //we use await here since this is an async process and we want the code to wait for this to finish before moving on to the next line of code
            let foundLike = await Like.findById(likeId)

            //if we found the user, return that user otherwise return a 404
            if(foundLike){
                Like.deleteOne(foundLike, (error) => {
                        if (error) throw error
                    });

                res.status(202).send({ message: "Like deleted", statusCode: res.statusCode });
            }else{
                res.status(404).send({
                    status: res.statusCode,
                    message: "Like Not Found!"
                })
            }
            
        } catch (error) {
            console.log("failed to delete like: " + error)
            //if any code in the try block fails, send the user a HTTP status of 400 and a message stating we could not delete the post
            res.status(400).json({
                message: error.message,
                statusCode: res.statusCode
            })

        }
    }
}

module.exports = likeController;
