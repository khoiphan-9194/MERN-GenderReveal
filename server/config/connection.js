const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/genderdb');
//mongoose.connect('mongodb://127.0.0.1:27017/genderdb' || process.env.MONGODB_URI );
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
module.exports = mongoose.connection;
