const { mongo } = require("mongoose")

const schema = mongoose.Schema({
    guildID: String,
    userID: String,
    money: { type: Number, default: 0 }
})
module.exports = mongoose.model("User", schema)