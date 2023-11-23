import { productsService } from "../services/index.js"

const getProducts = async (req, res) => {
    try {
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
        stock,
        owner
    } = req.body
    if (!title || !price || !stock) return res.status(400).send({ status: "error", error: "Incomplete Files" })
    const newProduct = {
        title,
        categories,
        price,
        stock,
        owner
    }
    if (req.user.role == 'premium') {
        newProduct.owner = req.user.id
        const result = await productsService.createProducts(newProduct)
        res.send({ status: "success", payload: "producto creado con un owner premium" })
    } else {
        res.send({ staus: "error", message: "solo usuarios premium pueden crear productos" })
    }
}

const updateProduct = async (req, res) => {
    const { pid } = req.params

    const product = await productsService.getProduct({ _id: pid })
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
    const { pid } = req.body
    const product = await productsService.getProduct({ _id: pid })
    if (req.user.role == 'premium' && product.owner == req.user.id) {
        const result = await productsService.deleteProduct(pid)
        res.send({ status: "success", message: "Producto eliminado porque sos el owner" })
    } else if (req.user.role == 'admin') {
        const result = await productsService.deleteProduct(pid)
        res.send({ status: "success", message: "Producto eliminado porque sos admin" })
    }
}


export default { getProducts, createProducts, updateProduct, deleteProducts }