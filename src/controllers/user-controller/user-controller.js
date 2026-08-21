// All user related controller functions are defined here...!

import UserModal from "../../modals/user-modals.js";
import mongoose from "mongoose";


// =========================
// GREET USER
// =========================

const greetUser = (req, res) => {

    return res.status(200).send({
        message: "User module in Node JS"
    });

};


// =========================
// CREATE USER
// =========================

const createUser = async (req, res) => {

    try {

        const email =
            req.body.email?.trim().toLowerCase();

        if (!email) {

            return res.status(400).send({
                status: false,
                message: "Email is required!"
            });

        }


        // Check duplicate email

        const isUserExist =
            await UserModal.findOne({
                email: email
            });

        if (isUserExist) {

            return res.status(400).send({
                status: false,
                message: "Email already exists!"
            });

        }


        // Create user

        const newUser = new UserModal({

            ...req.body,

            email: email

        });


        const saveUser =
            await newUser.save();


        if (saveUser) {

            return res.status(200).send({

                status: true,

                message:
                    "User saved successfully",

                data: {
                    _id: saveUser._id,
                    userName: saveUser.userName,
                    email: saveUser.email,
                    role: saveUser.role,
                    profileImage:
                        saveUser.profileImage || "",
                    createdAt:
                        saveUser.createdAt
                }

            });

        }

    } catch (error) {

        console.log(
            `Err while saving user: ${error}`
        );

        return res.status(500).send({

            status: false,

            message:
                "Internal server error!"

        });

    }

};


// =========================
// FETCH USERS
// =========================

const fetchUsers = async (req, res) => {

    try {

        const { role } = req.query;

        console.log("Query:", role);


        const query =
            role ? { role } : {};


        const fetchData =
            await UserModal
                .find(query)
                .select("-password")
                .sort({
                    createdAt: -1
                });


        console.log(
            "Users found:",
            fetchData.length
        );


        return res.status(200).send({

            status: true,

            message:
                fetchData.length > 0
                    ? "Users"
                    : "No users found",

            data: fetchData

        });

    } catch (error) {

        console.log(
            `Err while fetching user: ${error}`
        );

        return res.status(500).send({

            status: false,

            message:
                "Err while fetching user!"

        });

    }

};


// =========================
// DELETE ONE USER
// =========================

const handleDeleteUser = async (req, res) => {

    try {

        const { uid } = req.params;

        console.log("Uid:", uid);


        const checkUid =
            mongoose.isValidObjectId(uid);


        if (!checkUid) {

            return res.status(400).send({

                status: false,

                message:
                    "Invalid Uid"

            });

        }


        const existingUser =
            await UserModal.findById(uid);


        if (!existingUser) {

            return res.status(404).send({

                status: false,

                message:
                    "User not found"

            });

        }


        await UserModal.deleteOne({
            _id: uid
        });


        return res.status(200).send({

            status: true,

            message:
                "User deleted successfully!"

        });

    } catch (error) {

        console.log(
            `Err while deleting user: ${error}`
        );

        return res.status(500).send({

            status: false,

            message:
                "Error while deleting user!"

        });

    }

};


// =========================
// DELETE ALL USERS
// =========================

const handleDeleteAllUsers = async (req, res) => {

    try {

        console.log(
            "Deleting all users..."
        );


        const result =
            await UserModal.deleteMany({});


        console.log(
            `Deleted users: ${result.deletedCount}`
        );


        return res.status(200).send({

            status: true,

            message:
                result.deletedCount > 0
                    ? `${result.deletedCount} users deleted successfully!`
                    : "No users found to delete.",

            deletedCount:
                result.deletedCount

        });

    } catch (error) {

        console.log(
            `Err while deleting all users: ${error}`
        );

        return res.status(500).send({

            status: false,

            message:
                "Error while deleting all users!"

        });

    }

};


// =========================
// UPDATE USER
// =========================

const handleUpdateUser = async (req, res) => {

    try {

        const { uid } = req.params;


        console.log(
            "Update Uid:",
            uid
        );


        const checkUid =
            mongoose.isValidObjectId(uid);


        if (!checkUid) {

            return res.status(400).send({

                status: false,

                message:
                    "Invalid Uid"

            });

        }


        const existingUser =
            await UserModal.findById(uid);


        if (!existingUser) {

            return res.status(404).send({

                status: false,

                message:
                    "User not found"

            });

        }


        // =========================
        // EMAIL CHECK
        // =========================

        if (req.body.email) {

            const email =
                req.body.email
                    .trim()
                    .toLowerCase();


            const isEmailExist =
                await UserModal.findOne({

                    email: email,

                    _id: {
                        $ne: uid
                    }

                });


            if (isEmailExist) {

                return res.status(400).send({

                    status: false,

                    message:
                        "Email already exists!"

                });

            }


            req.body.email = email;

        }


        // =========================
        // UPDATE
        // =========================

        const updatedUser =
            await UserModal.findByIdAndUpdate(

                uid,

                req.body,

                {
                    returnDocument: "after",
                    runValidators: true
                }

            ).select("-password");


        return res.status(200).send({

            status: true,

            message:
                "User updated successfully",

            data:
                updatedUser

        });

    } catch (error) {

        console.log(
            `Err while updating user: ${error}`
        );


        return res.status(500).send({

            status: false,

            message:
                "Error while updating user!"

        });

    }

};


// =========================
// UPLOAD PROFILE IMAGE
// =========================

const handleUploadProfileImage = async (
    req,
    res
) => {

    try {

        console.log(
            "Uploaded File:",
            req.file
        );


        if (!req.file) {

            return res.status(400).send({

                status: false,

                message:
                    "Image is required!"

            });

        }


        // =========================
        // COMPLETE BACKEND URL
        // =========================

        const backendUrl =
            process.env.BACKEND_URL ||
            `${req.protocol}://${req.get("host")}`;


        const imageUrl =
            `${backendUrl}/uploads/${req.file.filename}`;


        console.log(
            "Image URL:",
            imageUrl
        );


        // =========================
        // IF USER ID PROVIDED
        // =========================

        const userId =
            req.body.userId;


        if (userId) {

            if (
                !mongoose.isValidObjectId(
                    userId
                )
            ) {

                return res.status(400).send({

                    status: false,

                    message:
                        "Invalid user ID!"

                });

            }


            const updatedUser =
                await UserModal.findByIdAndUpdate(

                    userId,

                    {
                        profileImage:
                            imageUrl
                    },

                    {
                        returnDocument: "after"
                    }

                ).select("-password");


            if (!updatedUser) {

                return res.status(404).send({

                    status: false,

                    message:
                        "User not found!"

                });

            }


            return res.status(200).send({

                status: true,

                message:
                    "Image uploaded and saved successfully!",

                data: {

                    fileName:
                        req.file.filename,

                    originalName:
                        req.file.originalname,

                    size:
                        req.file.size,

                    type:
                        req.file.mimetype,

                    url:
                        imageUrl,

                    user:
                        updatedUser

                }

            });

        }


        // =========================
        // NO USER ID
        // =========================

        return res.status(200).send({

            status: true,

            message:
                "Image uploaded successfully!",

            data: {

                fileName:
                    req.file.filename,

                originalName:
                    req.file.originalname,

                size:
                    req.file.size,

                type:
                    req.file.mimetype,

                url:
                    imageUrl

            }

        });


    } catch (error) {

        console.log(
            `Err while uploading image: ${error}`
        );


        return res.status(500).send({

            status: false,

            message:
                "Error while uploading image!"

        });

    }

};


// =========================
// EXPORT
// =========================

export {

    greetUser,

    createUser,

    fetchUsers,

    handleDeleteUser,

    handleDeleteAllUsers,

    handleUpdateUser,

    handleUploadProfileImage

};
