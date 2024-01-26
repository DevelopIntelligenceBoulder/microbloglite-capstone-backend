//Import our model so we can us it to interact with the realated data in MongoDB
const User = require('../models/user.model')
const { permissiveSanitizer, restrictiveSanitizer } = require('../services/sanitizers');


//build our controller that will have our CRUD and other methods for our users
const userController = {

    //method to get all users using async/await syntax
    getUsers: async function (req, res) {

        //create base query
        let query = {}

        let limit = parseInt(req.query.limit) || 100
        let skip = parseInt(req.query.offset) || 0

        //using a try/catch since we are using asyn/await and want to catch any errors if the code in the try block fails
        try {

            //use our model to find users that match a query.
            //{} is the current query which really mean find all the users
            //we use await here since this is an async process and we want the code to wait for this to finish before moving on to the next line of code
            let allUsers = await User.find(query, { _id: 0, __v: 0 }).limit(limit).skip(skip)

            //return all the users that we found in JSON format
            res.json(allUsers)

        } catch (error) {
            console.log('error getting all users: ' + error)
            //if any code in the try block fails, send the user a HTTP status of 400 and a message stating we could not find any users
            res.status(400).json({
                message: error.message,
                statusCode: res.statusCode
            })

        }
    },
    //method to create a new user
    createUser: async function (req, res) {

        //store user data sent through the request
        const userData = req.body;

        //strip all HTML from username and fullName if defined
        userData.username &&= restrictiveSanitizer(userData.username);
        userData.fullName &&= restrictiveSanitizer(userData.fullName);

        const exactUsernameCaseInsensitive = new RegExp(`^${userData.username}$`, "i");

        try {
            const alreadyExists = await User.exists({ username: exactUsernameCaseInsensitive });
            if (alreadyExists) {
                res.status(409)
                throw new Error(`conflict: username \`${userData.username}\` already exists.`)
            }

            //pass the userData to the create method of the User model
            let newUser = await User.create(userData)

            //return the newly created user
            res.status(201).json(await User.findById(newUser._id, { _id: 0, __v: 0 }))
        } catch (error) {
            //handle errors creating user
            error.message = 'failed to create user: ' + error.message
            console.log(error.message)

            if (res.statusCode < 400) {
                res.status(400)
            }

            res.json({
                message: error.message,
                statusCode: res.statusCode
            })
        }

    },
    //method to update a user
    updateUser: async function (req, res, next) {

        try {

            //get the username from the request params/path variable
            const username = req.params.username;

            //try to find our user by the provided username
            //if not, send error and exit the controller early
            const user = await User.findOne({ username });
            if (!user) {
                res
                    .status(404)
                    .json({
                        message: 'User not found', 
                        statusCode: res.statusCode,
                    });

                return;
            }

            const newUserData = req.body;

            //sanitize bio & fullName if defined
            newUserData.bio &&= permissiveSanitizer(newUserData.bio);
            newUserData.fullName &&= restrictiveSanitizer(newUserData.fullName);

            //check if the user which we're expected to modify is the same as
            //the currently-logged-in user
            //if not, send error and exit the controller early
            const requestedUsername = user.username;
            const requestingUsername = req.user.get('username');
            if (requestedUsername !== requestingUsername) {
                res
                    .status(403)
                    .json({ 
                        message: 'User not permitted to modify another user', 
                        statusCode: res.statusCode,
                    });

                return;
            }

            //if the controller gets this far, then we should be ready to go

            //update the user
            Object.assign(user, newUserData);
            await user.save();

            //respond with updated user
            res.json(await User.findById(user._id, { _id: 0, __v: 0 }));

        } catch (error) {
            console.log('failed to update user: ' + error);
            res
                .status(400)
                .json({
                    message: error.message,
                    statusCode: res.statusCode,
                });
            
            return;
        }

    },
    //method to get all users using async/await syntax
    getUser: async function (req, res) {

        //using a try/catch since we are using asyn/await and want to catch any errors if the code in the try block fails
        try {

            //get the email address of the user from the url parameters
            const username = req.params.username;

            //use our model to find the user that match a query.
            //{email: some@email.com} is the current query which really mean find the user with that email
            //we use await here since this is an async process and we want the code to wait for this to finish before moving on to the next line of code
            let foundUser = await User.findOne({ username: username }, { _id: 0, __v: 0 })

            //if we found the user, return that user otherwise return a 404
            if (foundUser) {
                res.json(foundUser)
            } else {
                res.status(404).send({
                    status: res.statusCode,
                    message: 'User Not Found!'
                })
            }

        } catch (error) {
            console.log('error getting user: ' + error)
            //if any code in the try block fails, send the user a HTTP status of 400 and a message stating we could not find the user
            res.status(400).json({
                message: error.message,
                statusCode: res.statusCode
            })

        }
    }


}

module.exports = userController;
