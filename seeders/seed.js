var mongoose = require("mongoose");
var db = require("../models");

// not sure about the URL at the end of this line //
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/imageperformance", {
    useNewUrlParser: true
});