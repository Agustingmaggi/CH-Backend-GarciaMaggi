export default class ProductsService {
    constructor(manager) {
        this.manager = manager;
    }

    getProducts = () => {
        return this.manager.getProducts();
    }
    createProducts = (product) => {
        return this.manager.createProduct(product)
    }
    updateProducts = (id, product) => {
        return this.manager.updateProduct(id, product)
    } //en todos estos metodos hay que poner la misma cant de parametros que en los metodos del manager, lo pongo aca porque me di cuenta con este update.
    getProduct = (params) => {
        return this.manager.getProduct(params)
    }
    deleteProduct = (id) => {
        return this.manager.deleteProduct(id)
    }
}