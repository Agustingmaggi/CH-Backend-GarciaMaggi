import BaseRouter from './BaseRouter.js';
import viewsController from '../controllers/views.controller.js';

class ViewsRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], viewsController.home)
        this.get('/register', ['NO_AUTH'], viewsController.register)
        this.get('/login', ['NO_AUTH'], viewsController.login)
        this.get('/profile', ['AUTH'], viewsController.profile)
        this.get('/carrito', ['AUTH'], viewsController.carrito)
        this.get('/passwordRestore', ['PUBLIC'], viewsController.passwordRestore)
    }
}

const viewsRouter = new ViewsRouter();

export default viewsRouter.getRouter();