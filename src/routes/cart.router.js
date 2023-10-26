import BaseRouter from './BaseRouter.js'
import cartManager from '../dao/mongo/managers/cartsManager.js'
import productsManager from '../dao/mongo/managers/productsManager.js'
import cartController from '../controllers/cart.controller.js'

const cartService = new cartManager()
const productService = new productsManager()

class CartRouter extends BaseRouter {
    init() {
        this.get('/:cartId', ['PUBLIC'], cartController.getCart)
        this.post('/', async (req, res) => { //el prof puso ['ADMIN'] como middleware supongo de executePolicies.js pero no existe tal politica en su codigo, es raro
            const result = await cartService.createCart()
            res.send({ status: "success", payload: result._id })
        }) //este endpoint no anda con postman, me estuvo pasando que los endpoints post con postman no funcionan 
        //asi que no se si es que estoy haciendo algo mal en postman al hcer un post o si no funciona el endpoint en si.
        //el error que me tira es que no puede leer el role de executepolicies.js
        this.put('/:cartId/products/:productId', ['NO_AUTH'], async (req, res) => {
            const { cartId, productId } = req.params
            const cart = await cartService.getCart({ _id: cartId })
            if (!cart) return res.status(400).send({ status: "error", error: "Cart doesn't exist" })
            const product = await productService.getProduct({ _id: productId })
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
        })
        this.put('/products/:productId', ['USER'], async (req, res) => {
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
        })
    }
}

// router.put('/:cartId', async (req, res) => {
//     try {
//         const cartId = req.params.cartId;
//         const updatedCart = req.body;
//         await cartService.updateCart(cartId, updatedCart);
//         res.json({ message: 'Carrito actualizado exitosamente' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error en el servidor' });
//     }
// });

// router.delete('/:cartId', async (req, res) => {
//     try {
//         const cartId = req.params.cartId;
//         await cartService.deleteCart(cartId);
//         res.json({ message: 'Carrito eliminado exitosamente' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error en el servidor' });
//     }
// });

// router.delete('/:cartId/products/:productId', async (req, res) => {
//     try {
//         const cartId = req.params.cartId;
//         const productId = req.params.productId;

//         await cartService.removeProductFromCart(cartId, productId);

//         res.json({ message: 'Producto eliminado del carrito exitosamente' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error en el servidor' });
//     }
// });

// export default router;

const cartRouter = new CartRouter()
export default cartRouter.getRouter()