import { cartService } from "../services/index.js"
import { productsService } from "../services/index.js"

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

export default { getCart, createCart, updateCart, addProdToCart }