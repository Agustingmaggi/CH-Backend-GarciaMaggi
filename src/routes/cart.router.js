import { Router } from 'express'
import cartManager from '../dao/mongo/managers/cartsManager.js'

const router = Router()
const cartService = new cartManager

router.get('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart = await cartService.getCart(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = req.body;
        const createdCart = await cartService.createCart(newCart);
        res.status(201).json(createdCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.put('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const updatedCart = req.body;
        await cartService.updateCart(cartId, updatedCart);
        res.json({ message: 'Carrito actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.put('/:cartId/products/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const { quantity } = req.body;

        const cart = await cartService.getCart(cartId);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(product => product.product._id.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        cart.products[productIndex].quantity = quantity;

        await cartService.updateCart(cartId, cart);

        res.json({ message: 'Cantidad de producto en el carrito actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.delete('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        await cartService.deleteCart(cartId);
        res.json({ message: 'Carrito eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.delete('/:cartId/products/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

        await cartService.removeProductFromCart(cartId, productId);

        res.json({ message: 'Producto eliminado del carrito exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

export default router;