import passportCall from "../middlewares/passportCall.js"
import BaseRouter from "./BaseRouter.js";
import jwt from 'jsonwebtoken'
import config from "../config/config.js";

class SessionsRouter extends BaseRouter {
    init() {
        this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: 'LOCALS' }), async (req, res) => {
            res.clearCookie('cart')
            res.sendSuccess('Registered');
        })
        this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: 'LOCALS' }), async (req, res) => {

            const tokenizedUser = {
                name: `${req.user.firstName} ${req.user.lastName}`,
                id: req.user._id,
                role: req.user.role,
                email: req.user.email,
                cart: req.user.cart
            }

            const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1d' })

            res.cookie(config.jwt.COOKIE, token, { expiresIn: "1d" })
            res.clearCookie('cart')
            res.sendSuccess('Logged in')
        })
        this.get('/current', ['PUBLIC'], async (req, res) => {
            res.sendSuccessWithPayload(req.user)
        })
    }
}

const router = new SessionsRouter()

export default router.getRouter()