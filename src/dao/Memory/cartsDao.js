export default class cartsDao {
    constructor() {
        this.carts = [];
    }

    get = () => {
        return this.carts;
    }

    create = (cart) => {
        cart.id = this.carts.length === 0 ? 1 : this.carts[this.carts.length - 1].id + 1;
        this.carts.push(cart);
        return cart;
    }
    update = () => {

    }
}