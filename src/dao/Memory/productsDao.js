export default class productsDao {
    constructor() {
        this.products = [];
    }

    get = () => {
        return this.products;
    }

    create = (product) => {
        product.id = this.products.length === 0 ? 1 : this.products[this.products.length - 1].id + 1;
        this.products.push(product);
        return product;
    }
    update = () => {

    }
}