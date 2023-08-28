import mongoose from "mongoose"

const collection = "Messages"

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    message: String,
    phone: String,
    active: {
        type: Boolean,
        default: true
    }
})

const messageModel = mongoose.model(collection, schema)

export default messageModel