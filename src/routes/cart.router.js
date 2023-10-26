import BaseRouter from './BaseRouter.js'
import cartController from '../controllers/cart.controller.js'

class CartRouter extends BaseRouter {
    init() {

        this.get('/:cartId', ['PUBLIC'], cartController.getCart)

        this.post('/', ['PUBLIC'], cartController.createCart)

        this.put('/:cartId/products/:productId', ['NO_AUTH'], cartController.updateCart)

        this.put('/products/:productId', ['NO_AUTH'], cartController.addProdToCart)
    }
}
const cartRouter = new CartRouter()
export default cartRouter.getRouter()