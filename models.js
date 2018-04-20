var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;

db.on("error", function(err) {
  console.error("MongoDB connection error: ", err);
});

db.once("open", function callback() {
  console.log("Connected to MongoDB.");
});

var PhotoSchema = mongoose.Schema({
  location: {
    type: String,
    required: true
  }
});

var Photo = mongoose.model('Photo', PhotoSchema);

module.exports = {
  Photo
};
