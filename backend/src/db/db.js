const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    });
        isConnected = true;
        console.log("Connected to DB");
}    catch (error) {
        console.error("Error connecting to DB:", error);
}
};

// app.use((req, res, next) => {
//     if (!isConnected) {
//      connectDB();
//     }
//     next();
// })

// function connectDB(){
//     mongoose.connect(process.env.MONGODB_URL)

//     .then(()=>{
//         console.log("connected to db");
//     })
// }

module.exports = connectDB;

// const mongoose = require("mongoose");

// module.exports = async function connectDB() {
//   const uri = process.env.MONGO_URI;
//   if (!uri) throw new Error("MONGO_URI missing");
//   await mongoose.connect(uri, { dbName: undefined });
//   console.log("Mongo connected");
// };
