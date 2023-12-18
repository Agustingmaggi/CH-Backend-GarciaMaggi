import passportCall from "../middlewares/passportCall.js"
import BaseRouter from "./BaseRouter.js";

import userController from "../controllers/user.controller.js";

class SessionsRouter extends BaseRouter {
    init() {
        this.get('/current', ['PUBLIC'], userController.current)
        this.get('/google', ['NO_AUTH'], passportCall('google', { scope: ['profile', 'email'], strategyType: 'OAUTH' }), async (req, res) => { })
        this.get('/googlecallback', ['NO_AUTH'], passportCall('google', { strategyType: 'OAUTH' }), userController.google)
        this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: 'LOCALS' }), userController.register)
        this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: 'LOCALS' }), userController.login)
        // this.post('/premium/:uid', ['PUBLIC'], userController.changeToPremium)
        this.post('/password', ['PUBLIC'], userController.password)
        this.put('/password-restore', ['PUBLIC'], userController.restorePassword)
    }
}

const router = new SessionsRouter()

export default router.getRouter()