import { Router } from 'express'
import productModel from '../dao/mongo/models/products.js';
import cartModel from '../dao/mongo/models/cart.js';

const router = Router()

router.get('/', async (req, res) => {
    try {
        const { page } = req.query
        const result = await productModel.paginate({}, { page, limit: 5, lean: true });
        // console.log(result) 
        const productos = result.docs
        const currentPage = result.page
        const { hasPrevPage, hasNextPage, prevPage, nextPage } = result

        res.render("Home", {
            productos: productos,
            page: currentPage,
            hasPrevPage,
            prevPage,
            hasNextPage,
            nextPage,
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
});

router.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login')
    }
    res.render(('Profile'), { user: req.session.user })
})

router.get('/register', async (req, res) => {
    res.render('Register')
})

router.get('/login', async (req, res) => {
    res.render('Login')
})

router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId).populate('products.product').lean();
        console.log(cart.products[0])
        if (!cart) {
            return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        }

        const productosDelCarrito = cart.products;
        // console.log(productosDelCarrito)

        res.render("Carrito", {
            productos: productosDelCarrito,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
    }
});

export default router