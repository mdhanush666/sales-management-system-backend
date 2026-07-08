const mongoose = require('mongoose');

const ConnectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_SMS_URL_DEV)
        console.log(`Database Connection Success..`);
    } catch (error) {
        console.log(`Database Connection Failed!`);
        process.exit(1);
    }
}

module.exports = ConnectDatabase;