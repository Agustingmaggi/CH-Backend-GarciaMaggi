import productModel from '../dao/mongo/models/products.js';
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import { cartService, productsService } from '../services/index.js'
import { userService } from "../services/index.js"

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
    const { id } = req.user
    const productos = await productsService.getProducts()
    const userProducts = productos.filter(producto => producto.owner === id);

    res.render('Profile', { user: req.user, productos: userProducts });
}

const carrito = async (req, res) => {
    const cartId = req.user.cart
    const cart = await cartService.getCart(cartId).populate('products.product').lean()
    const products = cart.products
    // Calcular el total del carrito sumando el producto de cantidad por precio para cada producto
    const total = products.reduce((accumulator, currentProduct) => {
        return accumulator + (currentProduct.quantity * currentProduct.product.price);
    }, 0);

    res.render('Carrito', { products: products, total: total })
    // console.log(products)
}

const passwordRestore = async (req, res) => {
    const { token } = req.query
    if (!token) return res.render('RestorePasswordError', { error: 'Ruta invalida' })
    try {
        jwt.verify(token, config.jwt.SECRET)
        res.render('PasswordRestore')
    } catch (error) {
        console.log(error)
        if (error.expiredAt) {
            return res.render('RestorePasswordError', { error: 'El link de este correo expiro, solicita uno nuevo' })
        }
        res.render('RestorePasswordError', { error: 'link invalido, crea uno nuevo' })
    }
}

const users = async (req, res) => {
    const usuarios = await userService.get()
    console.log(req.user)
    if (req.user.role === 'admin') {
        res.send(usuarios)
    } else {
        res.send('Solo los admins pueden ver a los usuarios de la db')
    }
}

export default { home, register, login, profile, carrito, passwordRestore, users }