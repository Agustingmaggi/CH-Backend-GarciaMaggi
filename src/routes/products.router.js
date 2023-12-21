import BaseRouter from './BaseRouter.js'
import uploader from '../services/uploadService.js'
import productsController from "../controllers/products.controller.js"

class ProductRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], productsController.getProducts);
        this.post('/', ['PUBLIC'], uploader.array('images'), productsController.createProducts)
        this.put('/:pid', ['PUBLIC'], productsController.updateProduct)
        this.delete('/', ['AUTH'], productsController.deleteProducts)
    }
}

const productRouter = new ProductRouter()
export default productRouter.getRouter()