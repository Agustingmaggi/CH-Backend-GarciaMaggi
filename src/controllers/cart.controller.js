import { cartService } from "../services/index.js"
import { productsService } from "../services/index.js"
import { ticketsService } from '../services/index.js'
import { userService } from "../services/index.js"

import mongoose from 'mongoose';

const getCart = async (req, res) => {
    const cartId = req.params.cartId
    const cart = await cartService.getCart(cartId).populate('products.product') //le agregue el populate para que se vean los productos dentro y no solamente el id de los productos dentro
    if (!cart) return res.status(404).send({ status: "error", error: "Cart not found" })
    res.send({ status: "success", payload: cart })
}

const createCart = async (req, res) => {
    const result = await cartService.createCart()
    res.send({ status: "success", payload: result._id })
}

const updateCart = async (req, res) => {

    const productId = req.body.pid
    const cartId = req.user.cart
    const cart = await cartService.getCart({ _id: req.user.cart });

    if (!cart) return res.status(400).send({ status: "error", error: "Cart doesn't exist" });

    const product = await productsService.getProduct({ _id: productId });

    if (!product) return res.status(400).send({ status: "error", error: "Product doesn't exist" });

    if (product.owner != req.user.id) {
        let productExistInCart = cart.products.find(item => item.product.toString() === productId);
        if (productExistInCart) {
            // Si el producto ya existe en el carrito, aumenta la cantidad en uno
            productExistInCart.quantity += 1;
        } else {
            // Si el producto no existe en el carrito, agrégalo con cantidad 1
            cart.products.push({
                product: productId,
                quantity: 1,
                added: new Date().toISOString()
            });
        }

        await cartService.updateCart(cartId, { products: cart.products });
        res.send({ status: "success", message: "Product Added" });
    } else {
        res.send({ status: "error", error: "no podes agregar productos tuyos a tu carrito" })
    }
}
const ticket = async (req, res) => {
    const cartId = req.params.cid
    const cart = await cartService.getCart(cartId) // Obtén el carrito asociado al cartId

    const allUsers = await userService.get()
    const cartObjectId = new mongoose.Types.ObjectId(cartId);
    const userWithMatchingCart = allUsers.find(user => user.cart.equals(cartObjectId));

    const productsToPurchase = [];
    const productsNotPurchased = [];
    for (const productInfo of cart.products) {
        const productId = productInfo.product
        const quantity = productInfo.quantity

        const product = await productsService.getProduct(productId);
        //guardamos los prods que sí y que no se pueden comprar segun la cantidad que se pretende comprar y el stock disponible
        if (product && product.stock >= quantity) {
            productsToPurchase.push(productInfo);
        } else {
            productsNotPurchased.push(productId)
        }
    }
    console.log("Productos que se van a comprar:")
    console.log(productsToPurchase)
    console.log("Productos que no se pudieron comprar por que hay menos stock del que se queria comprar")
    console.log(productsNotPurchased)

    const productsToPurchaseIds = productsToPurchase.map(productInfo => productInfo.product.toString());
    // Filtra los productos que no deben eliminarse del carrito
    cart.products = cart.products.filter(productInfo => !productsToPurchaseIds.includes(productInfo.product.toString()));
    //actualizamos el carrito eliminando los productos que se van a comprar y dejando los que no se pudieron comprar
    await cartService.updateCart(cartId, { products: cart.products });
    console.log("Carrito actualizado con los productos que quedaron en el carrito a la espera de que haya mas stock");
    console.log(cart);

    //ahora actualizamos el stock en la db de los productos que sí se van a comprar
    for (const productInfo of productsToPurchase) {
        const productId = productInfo.product;
        const quantity = productInfo.quantity;

        // Busca el producto en la base de datos para restarle la cantidad comprada
        const product = await productsService.getProduct(productId);
        await productsService.updateProducts(
            { _id: product._id.toString() },
            { stock: product.stock - quantity }, // Resta la cantidad del stock
        );


        const generateUniqueCode = () => {
            // Obtiene la fecha y hora actual en milisegundos y genera un código único concatenando la fecha actual y un número aleatorio
            const timestamp = new Date().getTime();
            return `CODE-${timestamp}-${Math.floor(Math.random() * 10000)}`;
        };

        const ticketData = {
            code: generateUniqueCode() || 1, // Genera un código único para el ticket
            purchase_datetime: new Date(),
            amount: product.price * quantity,
            purchaser: userWithMatchingCart ? userWithMatchingCart.email : "usuario de prueba",
            products: [productInfo]
        };

        // Crea un nuevo ticket y guárdalo en la base de datos utilizando el servicio de tickets
        await ticketsService.createTicket(ticketData);
    }

    if (productsNotPurchased.length === 0) {
        res.status(200).json({ message: 'Compra completada con éxito' });
    } else { //en realidad no es un error que se hayan podido comrpar unos y otros no pero lo dejo asi por ahora
        res.status(400).json({ message: 'Algunos productos no pudieron procesarse', productsNotPurchased });
    }
}

export default { getCart, createCart, updateCart, ticket }