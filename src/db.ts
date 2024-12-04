import mongoose, { Schema } from "mongoose";

const User = new Schema({
    email : {
        type : String,
        unique : true,
        require : true
    },
    username : {
        type : String,
        unique : true,
        require : true
    },
    password : String,
})

const Admin = new Schema({
    email : {
        type : String,
        unique : true,
        require : true
    },
    username : {
        type : String,
        unique : true,
        require : true
    },
    password : String,
})

const UserModel = mongoose.model("users",User);
const AdminModel = mongoose.model("admins",Admin);

export default UserModel;