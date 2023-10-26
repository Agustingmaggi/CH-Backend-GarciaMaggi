export default class CartService {
    constructor(manager) {
        this.manager = manager;
    }

    getCarts = () => {
        return this.manager.getCarts();
    }
    createCart = (cart) => {
        return this.manager.createCart(cart)
    }
    updateCart = (id, cart) => {
        return this.manager.updateCart(id, cart)
    }
    getCart = (id) => {
        return this.manager.getCart(id)
    }
    deleteCart = (id) => {
        return this.manager.deleteProduct(id)
    }
}