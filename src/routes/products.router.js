import { Router } from 'express'
import uploader from '../services/uploadService.js'
import productsController from "../controllers/products.controller.js"

const router = Router()

router.get('/', productsController.getProducts);

router.post('/', uploader.array('images'), productsController.createProducts)

// router.post('/:pid/carrito/:cid', async (req, res) => {
//     try {
//         const { pid, cid } = req.params
//         const prod = await productModel.findOne({ _id: pid })
//         if (!prod) return res.status(400).send({ status: "error", error: "prod no existe" })
//         const carrito = await cartModel.findOne({ _id: cid })
//         if (!carrito) return res.status(400).send({ status: "error", error: "no existe el carrito" })
//         await cartModel.updateOne({ _id: cid }, { $push: { products: { product: pid, quantity: 1 } } })
//         res.send({ status: "success", message: "producto ingresado al carrito" })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" })
//     }
// }) //este endpoint es para agrgar un producto al carrito pero tmb tengo esta misma funcionalidad
//en cart router con un put y basado en BaseRouter asi que creo mejor pasar ese endpoint para el desafio de la clase 14.

router.put('/:pid', productsController.updateProduct)

router.delete('/:pid', productsController.deleteProducts)

export default router