import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../../models/usermodel/user.model.js";
import { sendresponse } from "../../utils/response.util.js";

// POST : User registration
export const handle_user_registration = async (request, response) => {
    const { username, email, password } = request.body;
    // Checking if any of the field is missing 
    if ([ username, email, password ].some((item) => !item)) {
        return sendresponse(response,400, "MISSING FIELDS RECIEVED !");
    }
    // Error handling 
    try {
        // Checking if the user is already present in the database of the application
        const existing_user = userModel.findOne( { $or: [{username, email} ] } );
        if ( existing_user ) {
            return sendresponse(response, 400, "USER ALREADY EXISTS !");
        }
        // Hashing the user password if the user is not found in the database
        const hashed_password = await bcrypt.hash(password, 10);
        // Creating the user user 
        await userModel.create({
            username,
            email,
            password : hashed_password,
        });
        return sendresponse(response, 200, "USER REGISTERED SUCCESSFULLY !");
    } catch ( error ) {
        return sendresponse(response, 500, "INTERNAL SERVER ERROR", null, error);
    }
};

// POST : User login
export const handle_user_login = async (request, response) => {
    const { identifier, password } = request.body;
    // Checking if any fo the fields is missing
    if ([ identifier, password ].some((item) => !item)) {
        return sendresponse(response, 400, "MISSING FILEDS RECIEVED !");
    }
    // Error handling
    try {
        // Checking if the user exists or not 
        const existing_user = await userModel.findOne({
            $or : [{username : identifier},{email : identifier}]
        })
        if ( !existing_user ) {
            return sendresponse(response, 400, "USER DOES NOT EXISTS !");
        }
        // Checking for the password matching if the user is present 
        const is_password_valid = await bcrypt.compare(password, existing_user.password);
        if ( !is_password_valid ) {
            return sendresponse(response, 401, "PASSWORD DOES NOT MATCH WITH THE REGISTERED PASSWORD !");
        }
        // Accesstoken for the user 
        const access_token = jwt.sign(
            {
                id : existing_user.id,
                username : existing_user.username,
                email : existing_user.email
            }, 
            process.env.JWT_KEY,
            {
                expiresIn : "15m"
            }
        );
        // Refreshtoken for the user 
        const refresh_token = jwt.sign(
            {
                id : existing_user.id
            },
            process.env.JWT_KEY,
            {
                expiresIn : "15d"
            }
        );
        existing_user.refreshToken = refresh_token;
        await existing_user.save();
        // Returning the response
        return response
            .status(200)
            .cookie("access_token", access_token, {
                httpOnly : true,
                secure : true,
                sameSite : "None"
            })
            .cookie("refresh_token", refresh_token, {
                httpOnly : true, 
                secure : true, 
                sameSite : "None"
            })
            .json({
                message : "USER LOGGED IN SUCCESSFULLY !",
                data : {
                    id : existing_user._id, 
                    username : existing_user.username,
                    email : existing_user.email,
                },
                error : "None"
            });
    } catch ( error ) {
        return sendresponse(response, 500, "INTERNAL SERVER ERROR !", null, error);
    }
}

// POST : User logout 
export const handle_user_logout = (request, response) => {}

// GET : User authentication validation 
export const handle_user_validation = (request, response) => {}