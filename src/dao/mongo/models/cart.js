import mongoose from 'mongoose'
const collection = "Carts"

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    dni: {
        type: String,
        required: true
    },
    course: {
        type: String,
        enum: ["backend", "frontend"],
        default: "backend"
    },
    grade: {
        type: Number,
        required: true
    }
})

const cartModel = mongoose.model(collection, schema)

export default cartModel