import mongoose from 'mongoose';

const collection = "Carts";

const schema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'products',
                // required: true
            },
            quantity: {
                type: Number,
                // required: true,
                default: 1
            }
        }
    ],
    total: {
        type: Number,
        // required: true
    }
}, { timestamps: true });

const cartModel = mongoose.model(collection, schema);

export default cartModel;