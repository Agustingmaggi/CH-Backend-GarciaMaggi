import mongoose from 'mongoose'

const collection = "products"

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: true,
        default: []
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    stock: {
        type: Number,
        required: true,
    }
}, { timestamps: true })

const productModel = mongoose.model(collection, schema)

export default productModel