const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        console.log(process.env.DB_URL);
        await mongoose.connect(process.env.DB_URL)
        console.log("Connect Successfully to MongoDB");
    }
    catch(err){
        console.error("Connect Failed to MongoDB");
    }
}

module.exports = {connectDB};