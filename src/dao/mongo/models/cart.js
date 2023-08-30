import mongoose from 'mongoose';

const collection = "carts";

const schema = new mongoose.Schema({
    products: [
        {
            product: {
                type: String,
                ref: 'Product',
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    total: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const cartModel = mongoose.model(collection, schema);

export default cartModel;