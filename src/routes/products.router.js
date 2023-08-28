import { Router } from 'express'
import productsManager from '../dao/mongo/managers/productsManager.js'
import uploader from '../services/uploadService.js'

const router = Router()
const productsService = new productsManager

router.get('/', async (req, res) => {
    const products = await productsService.getProducts()
    res.send({ status: "success", payload: products })
})

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