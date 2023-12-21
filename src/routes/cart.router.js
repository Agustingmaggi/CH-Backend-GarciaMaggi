import BaseRouter from './BaseRouter.js'
import cartController from '../controllers/cart.controller.js'

class CartRouter extends BaseRouter {
    init() {

        this.get('/:cartId', ['PUBLIC'], cartController.getCart)

        this.post('/', ['PUBLIC'], cartController.createCart)

        //este endpoint agrega un producto 1 sola vez al carrito
        this.put('/products', ['AUTH'], cartController.updateCart)

        // //este endpoint aumenta la cantidad de un producto ya agregado en un carrito
        // this.put('/products/:productId', ['NO_AUTH'], cartController.addProdToCart)

        this.post('/purchase', ['PUBLIC'], cartController.ticket)
    }
}
const cartRouter = new CartRouter()
export default cartRouter.getRouter()