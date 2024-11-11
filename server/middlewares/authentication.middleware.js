import jwt from "jsonwebtoken";
import { sendresponse } from "../utils/response.util";

export const authentication_validation = (request, response, next) => {
    const accessToken = request.cookies.access_token;
    console.log(accessToken);
    // Checking if the access token is present or not 
    if ( !accessToken ) {
        return sendresponse(response, 401, "UNAUTHORIZED ACCESS !");
    }
    // Verification 
    jwt.verify(accessToken, process.env.JWT_KEY, (error, decoded) => {
        if ( error ) {
            sendresponse(response, 401, "UNAUTHORIZED ACCESS !");
        }
        request.existing_user = decoded;
        next();
    });
};