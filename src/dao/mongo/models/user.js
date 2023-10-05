import mongoose from "mongoose"

const collection = "Users"

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Carts"
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

const userModel = mongoose.model(collection, schema)

export default userModel