import mongoose from 'mongoose';

const collection = "Carts";

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
    products: [productSubschema],
    total: {
        type: Number,
        // required: true
    }
}, { timestamps: true });

// schema.pre(['find', 'findOne'], function () {
//     this.populate('products.product')
// })

const cartModel = mongoose.model(collection, schema);

export default cartModel;