import mongoose from "mongoose"

const collection = "Users"

const productSubschema = new mongoose.Schema({
    product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'products'
    },
    added: Date,
    quantity: {
        type: Number,
        default: 1
    }
}, { _id: false })

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
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    },
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Carts'
    },
    documents: [
        {
            name: String,
            reference: String
        }
    ]
})

const userModel = mongoose.model(collection, schema)

export default userModel