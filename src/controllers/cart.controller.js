import { cartService } from "../services/index.js"

const getCart = async (req, res) => {
    async (req, res) => {
        const cartId = req.params.cartId
        const cart = await cartService.getCart(cartId)
        if (!cart) return res.status(404).send({ status: "error", error: "Cart not found" })
        res.send({ status: "success", payload: cart })
    }
}

export default { getCart }