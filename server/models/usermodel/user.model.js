import { Schema, model } from "mongoose";

// User schema definition
const userSchema = new Schema({
    username : {
        type : String,
        required : [ true, "Username is required" ],
        unique : true,
        lowercase : true,
        minlength : [ 5, "Username must be at least 5 characters long" ],
        maxlength : [ 10, "Username must be at least 10 characters long" ],
    },
    email : {
        type : String,
        required : [ true, "An email must be provided" ],
        unique : true
    },
    password : {
        type : String, 
        required : [ true, "A password must be set" ]
    },
    refreshToken : {
        type : String
    }
}, { timestamps: true });

// User model definition 
const userModel = new model("Users", userSchema);
export { userModel };