import { Router } from 'express'
import productsManager from '../dao/mongo/managers/productsManager.js'

const router = Router()
const productsService = new productsManager

router.get('/', async (req, res) => {
    const products = await productsService.getProducts()
    res.render("Home", {
        products
    })
})

export default router