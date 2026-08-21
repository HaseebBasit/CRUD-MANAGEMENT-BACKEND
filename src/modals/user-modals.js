// User modal structure...!

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            required: true,
            enum: ["trainer", "student"]
        },

        profileImage: {
            type: String,
            default: ""
        }
    },
    {
        collection: "users",
        timestamps: true
    }
);

const UserModal = mongoose.model("users", userSchema);

export default UserModal;
