import productModel from "../models/products.js";

export default class productsDao {

    getProducts = () => {
        return productModel.find().lean()
    }

    getProduct = (params) => {
        return productModel.findOne(params)
    }

    createProduct = (product) => {
        return productModel.create(product)
    }

    updateProduct = (id, product) => {
        return productModel.updateOne({ _id: id }, { $set: product })
    }

    deleteProduct = (id) => {
        return productModel.deleteOne({ _id: id })
    }
}