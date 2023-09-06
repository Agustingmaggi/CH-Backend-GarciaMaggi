import { Router } from 'express'
import productsManager from '../dao/mongo/managers/productsManager.js'
import uploader from '../services/uploadService.js'
import productModel from '../dao/mongo/models/products.js'
import cartModel from '../dao/mongo/models/cart.js'

const router = Router()
const productsService = new productsManager

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const options = {
            limit: parseInt(limit),
            page: parseInt(page)
        };

        const result = await productModel.paginate({}, options);

        res.send({ status: "success", payload: result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
});

router.post('/', uploader.array('images'), async (req, res) => {
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
    const images = req.files.map(file => `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}/img/${file.filename}`)
    newProduct.images = images

    const result = await productsService.createProduct(newProduct)
    res.send({ status: "success", payload: result._id })
})

router.post('/:pid/carrito/:cid', async (req, res) => {
    try {
        const { pid, cid } = req.params
        const prod = await productModel.findOne({ _id: pid })
        if (!prod) return res.status(400).send({ status: "error", error: "prod no existe" })
        const carrito = await cartModel.findOne({ _id: cid })
        if (!carrito) return res.status(400).send({ status: "error", error: "no existe el carrito" })
        await cartModel.updateOne({ _id: cid }, { $push: { products: { product: pid, quantity: 1 } } })
        res.send({ status: "success", message: "producto ingresado al carrito" })
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" })
    }
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const {
        title,
        categories,
        price,
        stock
    } = req.body

    const updateProducto = {
        title, categories, price, stock
    }

    const product = await productsService.getProduct({ _id: pid })
    if (!product) return res.status(400).send({ status: "error", error: "El producto no existe" })
    await productsService.updateProduct(pid, updateProducto)
    res.send({ status: "success", message: "Producto updateado" })
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params
    const result = await productsService.deleteProduct(pid)
    console.log(result)
    res.send({ status: "success", message: "Producto eliminado" })
})

export default router