import { productsService } from "../services/index.js"

const getProducts = async (req, res) => {
    try {
        // const { limit = 10, page = 1 } = req.query;

        // const options = {
        //     limit: parseInt(limit),
        //     page: parseInt(page)
        // };

        const result = await productsService.getProducts();


        res.send({ status: "success", payload: result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
}
const createProducts = async (req, res) => {
    const {
        title,
        categories,
        price,
        stock
    } = req.body
    if (!title || !categories || !price || !stock) return res.status(400).send({ status: "error", error: "Incomplete Files" })
    const newProduct = {
        title,
        categories,
        price,
        stock
    }
    // const images = req.files.map(file => `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}/img/${file.filename}`)
    // newProduct.images = images

    const result = await productsService.createProducts(newProduct)
    res.send({ status: "success", payload: result._id })
}

const updateProduct = async (req, res) => {
    const { pid } = req.params

    const product = await productsService.getProduct({ _id: pid })
    console.log(product)
    const updateProducto = {
        title: req.body.title || product.title,
        categories: req.body.categories || product.categories,
        price: req.body.price || product.price,
        stock: req.body.stock || product.stock
    }
    // console.log(updateProducto)

    if (!product) return res.status(400).send({ status: "error", error: "El producto no existe" })
    await productsService.updateProducts(pid, updateProducto)
    res.send({ status: "success", message: "Producto updeteado" })
}

const deleteProducts = async (req, res) => {
    const { pid } = req.params
    const result = await productsService.deleteProduct(pid)
    console.log(result)
    res.send({ status: "success", message: "Producto eliminado" })
}


export default { getProducts, createProducts, updateProduct, deleteProducts }