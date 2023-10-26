// import {viewsService} from "../services/views.js"
import productModel from '../dao/mongo/models/products.js';

const home = async (req, res) => {
    const { page = 1 } = req.query
    const result = await productModel.paginate({}, { page, limit: 5, lean: true });
    const productos = result.docs
    const currentPage = result.page
    const { hasPrevPage, hasNextPage, prevPage, nextPage } = result

    const user = req.user
    res.render("Home", {
        productos: productos,
        page: currentPage,
        hasPrevPage,
        prevPage,
        hasNextPage,
        nextPage,
        user: user
    });
}

const register = async (req, res) => {
    res.render('Register');
}

const login = async (req, res) => {
    res.render('Login');
}

const profile = async (req, res) => {
    res.render('Profile', { user: req.user });
}

const carrito = async (req, res) => {
    const cartId = req.user.cart
    const cart = await cartManager.getCart(cartId, { populate: true })
    res.render('Carrito', { cart })
    console.log(cart)
}

export default { home, register, login, profile, carrito }