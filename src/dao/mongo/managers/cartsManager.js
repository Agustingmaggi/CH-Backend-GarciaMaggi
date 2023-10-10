import cartModel from "../models/cart.js";

export default class cartManager {

    getCart = (cartId, options = {}) => {
        if (options.populate) {
            return cartModel.findOne({ _id: cartId }).populate('products.product').lean();
        }
        return cartModel.findOne({ _id: cartId })
    }

    createCart = (cart) => {
        return cartModel.create(cart);
    }

    updateCart = (cartId, cart) => {
        return cartModel.updateOne({ _id: cartId }, { $set: cart });
    }

    deleteCart = (cartId) => {
        return cartModel.deleteOne({ _id: cartId });
    }
}