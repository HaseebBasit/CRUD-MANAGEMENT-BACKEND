// DB Configuration...!

import mongoose from "mongoose";

let dbUrl = "mongodb+srv://testing123:testing123@cluster0.ex87fqp.mongodb.net/?appName=Cluster0";

const connectDB = async () => {
    try {
        const res = await mongoose.connect(
            dbUrl,
            { dbName: "testing" }
        );
        res && console.log('Mongo DB connected successfully!');
    }

    catch (error) {
        console.log('Something went wrong while connecting DB:', error);
    };
};

export default connectDB;