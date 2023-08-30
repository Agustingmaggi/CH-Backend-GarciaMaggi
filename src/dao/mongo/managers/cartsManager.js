import cartModel from "../models/cart.js";

export default class cartManager {

    getCart = (cartId) => {
        return cartModel.findOne({ _id: cartId }).populate('products.product').lean();
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