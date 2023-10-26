import passportCall from "../middlewares/passportCall.js"
import BaseRouter from "./BaseRouter.js";

import userController from "../controllers/user.controller.js";

class SessionsRouter extends BaseRouter {
    init() {
        this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: 'LOCALS' }), userController.register)
        this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: 'LOCALS' }), userController.login)
        this.get('/current', ['PUBLIC'], userController.current)
    }
}

const router = new SessionsRouter()

export default router.getRouter()