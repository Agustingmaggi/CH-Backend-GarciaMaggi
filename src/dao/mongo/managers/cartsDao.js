import cartModel from "../models/cart.js";

export default class cartDao {

    getCart = (cartId, options = {}) => {
        if (options.populate) {
            return cartModel.findOne({ _id: cartId }).populate('products.product').lean();
        }
        return cartModel.findOne({ _id: cartId })
    }

    getCarts = () => {
        return cartModel.find().lean()
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