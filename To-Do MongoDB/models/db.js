const mongoose  = require("mongoose");

module.exports.init = async function(){
    await mongoose.connect("mongodb+srv://any:8LIyIPUsjppB9RPQ@cluster0.bjvv75q.mongodb.net/superCodersGlobal?retryWrites=true&w=majority");
}