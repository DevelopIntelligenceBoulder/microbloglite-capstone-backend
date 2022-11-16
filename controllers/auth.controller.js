const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Import our model so we can us it to interact with the realated data in MongoDB
const User = require("../models/user.model")


const authController = {

    login: async function(req, res){

        //using a try/catch since we are using asyn/await and want to catch any errors if the code in the try block fails
        try {

            const { username, password } = req.body;
            
            //use our model to find recipes that match a query.
            //{} is the current query which really mean find all the recipes
            //we use await here since this is an async process and we want the code to wait for this to finish before moving on to the next line of code
            let user = await User.findOne({username: username}).select('+password')

            if ( user &&  (await bcrypt.compare(password, user.password)) ) {
                const payload = { username: user.username };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                  expiresIn: "24h"
                });
                res.json({
                  token,
                  username: user.username,
                  statusCode: res.statusCode
                });
              } else {
                res.status(400).json({
                  statusCode: res.statusCode,
                  message: "Invalid username or password"
                });
              }
            
        } catch (error) {

            //if any code in the try block fails, send the user a HTTP status of 400 and a message
            res.status(400).send("Something went wrong: " + error)

        }
    },
    logout: async function(req, res){
      await req.logout();
      res.status(204).send()
    }
    

}

module.exports = authController;
