import { cartService } from "../services/index.js"
import { productsService } from "../services/index.js"
import { ticketsService } from '../services/index.js'
import { userService } from "../services/index.js"

import mongoose from 'mongoose';

const getCart = async (req, res) => {
    const cartId = req.params.cartId
    const cart = await cartService.getCart(cartId)
    if (!cart) return res.status(404).send({ status: "error", error: "Cart not found" })
    res.send({ status: "success", payload: cart })
}

const createCart = async (req, res) => {
    const result = await cartService.createCart()
    res.send({ status: "success", payload: result._id })
}

//este endpoint agrega un producto 1 sola vez al carrito
const updateCart = async (req, res) => {
    const { cartId, productId } = req.params
    const cart = await cartService.getCart({ _id: cartId })
    if (!cart) return res.status(400).send({ status: "error", error: "Cart doesn't exist" })
    const product = await productsService.getProduct({ _id: productId })
    if (!product) return res.status(400).send({ status: "error", error: "Product doesn't exist" })
    const productExistInCart = cart.products.find(item => {
        return item.product.toString() === productId
    })
    if (productExistInCart) return res.status(400).send({ status: "error", error: "product is already in cart" })
    cart.products.push({
        product: productId,
        added: new Date().toISOString()
    })
    await cartService.updateCart(cartId, { products: cart.products })
    res.send({ status: "success", message: "Product Added" })
}

//este endpoint aumenta la cantidad de un producto ya agregado en un carrito
const addProdToCart = async (req, res) => {
    const { productId } = req.params
    const cart = await cartService.getCart({ _id: req.user.cart })
    if (!cart) return res.status(400).send({ status: "error", error: "Cart doesn't exist" })
    const product = await productService.getProduct({ _id: productId })
    if (!product) return res.status(400).send({ status: "error", error: "Product doesn't exist" })
    const productExistInCart = cart.products.find(item => {
        return item.product.toString() === productId
    })
    if (productExistInCart) {
        productExistInCart.quantity++
    } else {
        cart.products.push({
            product: productId,
            added: new Date().toISOString()
        })
    }
    await cartService.updateCart(req.user.cart, { products: cart.products })
    res.send({ status: "success", message: "Product Added" })
}

const ticket = async (req, res) => {
    const cartId = req.params.cid
    const cart = await cartService.getCart(cartId) // Obtén el carrito asociado al cartId

    const productsToPurchase = cart.products;
    const productsNotPurchased = [];

    const allUsers = await userService.get()
    const cartObjectId = new mongoose.Types.ObjectId(cartId);
    const userWithMatchingCart = allUsers.find(user => user.cart.equals(cartObjectId));
    // console.log(userWithMatchingCart);

    for (const productInfo of productsToPurchase) {
        const { productId, quantity } = productInfo;
        // Busca el producto en la base de datos
        const product = await productsService.getProduct(productId);

        if (product && product.stock >= quantity) {
            // Resta la cantidad comprada del stock del producto
            await productsService.updateProducts(
                { _id: product._id },
                { $inc: { stock: -quantity } } // Resta la cantidad del stock
            );
            // Agrega el producto al ticket
            // Asegúrate de ajustar los campos del ticket según tu modelo

            const generateUniqueCode = () => {
                // Obtiene la fecha y hora actual en milisegundos
                const timestamp = new Date().getTime();

                // Genera un código único concatenando la fecha actual y un número aleatorio
                return `CODE-${timestamp}-${Math.floor(Math.random() * 10000)}`;
            };
            const ticketData = {
                code: generateUniqueCode(), // Genera un código único para el ticket
                purchase_datetime: new Date(),
                amount: product.price * quantity,
                purchaser: userWithMatchingCart.email
            };
            console.log(`el comprador es ${ticketData.purchaser}`)

            // Crea un nuevo ticket y guárdalo en la base de datos utilizando el servicio de tickets
            await ticketsService.createTicket(ticketData);

        } else {
            // Agrega el producto al arreglo de productos no comprados
            productsNotPurchased.push(productId);
        }
    }

    // Actualiza el carrito con los productos no comprados
    cart.products = cart.products.filter((productInfo) => !productsNotPurchased.includes(productInfo.productId));
    await cart.save();

    if (productsNotPurchased.length === 0) {
        res.status(200).json({ message: 'Compra completada con éxito' });
    } else {
        res.status(400).json({ message: 'Algunos productos no pudieron procesarse', productsNotPurchased });
    }
}

export default { getCart, createCart, updateCart, addProdToCart, ticket }