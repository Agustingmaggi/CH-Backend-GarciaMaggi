export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getCarts = () => {
        return this.dao.getCarts();
    }
    createCart = (cart) => {
        return this.dao.createCart(cart)
    }
    updateCart = (id, cart) => {
        return this.dao.updateCart(id, cart)
    }
    getCart = (id) => {
        return this.dao.getCart(id)
    }
    deleteCart = (id) => {
        return this.dao.deleteProduct(id)
    }
}