const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

module.exports = connectDB;





// const mongoose = require('mongoose');
// require('dotenv').config();

// let isConnected = false;

// async function connectDB() {
//     try{
//         await mongoose.connect(process.env.MONGODB_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//     });
//         isConnected = true;
//         console.log("Connected to DB");
// }    catch (error) {
//         console.error("Error connecting to DB:", error);
// }
// };


// function connectDB(){
//     mongoose.connect(process.env.MONGODB_URL)

//     .then(()=>{
//         console.log("connected to db");
//     })
// }

// module.exports = connectDB;
