// All user related routes are defined here...!

import express from "express";

import {

    greetUser,

    createUser,

    fetchUsers,

    handleDeleteUser,

    handleUpdateUser,

    handleDeleteAllUsers,

    handleUploadProfileImage

} from "../../controllers/user-controller/user-controller.js";

import uploadMedia from "../../middleware/upload-middleware.js";


const router = express.Router();


// =========================
// GREET
// =========================

router
    .route("/")
    .get(greetUser);


// =========================
// CREATE USER
// =========================

router
    .route("/user/save")
    .post(createUser);


// =========================
// FETCH USERS
// =========================

router
    .route("/users/fetch")
    .get(fetchUsers);


// =========================
// DELETE USER
// =========================

router
    .route("/user/delete/:uid")
    .delete(handleDeleteUser);


// =========================
// UPDATE USER
// =========================

router
    .route("/user/update/:uid")
    .put(handleUpdateUser);


// =========================
// DELETE ALL USERS
// =========================

router
    .route("/users/delete-all")
    .delete(handleDeleteAllUsers);


// =========================
// UPLOAD PROFILE IMAGE
// =========================

router
    .route("/api/profile/upload")
    .post(
        uploadMedia.single("image"),
        handleUploadProfileImage
    );


export default router;
