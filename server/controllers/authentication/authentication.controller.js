import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../../models/usermodel/user.model.js";
import { response } from "../../utils/response.util.js";

// POST : User registration
export const handle_user_registration = async (request, response) => {
    const { username, email, password } = request.body;
    // Checking if any of the field is missing 
    if ([ username, email, password ].some((item) => !item)) {
        return response(response,400, "MISSING FIELDS RECIEVED!");
    }
    // Error handling 
    try {
        // Checking if the user is already present in the database of the application
        const existing_user = userModel.findOne( { $or: [{username, email} ] } );
        if ( existing_user ) {
            return response(response, 400, "USER ALREADY EXISTS!");
        }
        // Hashing the user password if the user is not found in the database 
        const generated_salt = await bcrypt.genSaltSync(10);
        const hashed_password = await bcrypt.hashSync(password, generated_salt);
        // Creating the user user 
        await userModel.create({
            username,
            email,
            password : hashed_password,
        });
        return response(response, 200, "USER REGISTERED SUCCESSFULLY!");
    }catch (error) {
        return response(response, 500, "INTERNAL SERVER ERROR", null, error);
    }
};

// POST : User login
export const handle_user_login = (request, response) => {}

// POST : User logout 
export const handle_user_logout = (request, response) => {}

// GET : User authentication validation 
export const handle_user_validation = (request, response) => {}