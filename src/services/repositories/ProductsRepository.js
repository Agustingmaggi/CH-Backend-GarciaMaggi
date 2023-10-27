export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = () => {
        return this.dao.getProducts();
    }
    createProducts = (product) => {
        return this.dao.createProduct(product)
    }
    updateProducts = (id, product) => {
        return this.dao.updateProduct(id, product)
    } //en todos estos metodos hay que poner la misma cant de parametros que en los metodos del dao, lo pongo aca porque me di cuenta con este update.
    getProduct = (params) => {
        return this.dao.getProduct(params)
    }
    deleteProduct = (id) => {
        return this.dao.deleteProduct(id)
    }
}