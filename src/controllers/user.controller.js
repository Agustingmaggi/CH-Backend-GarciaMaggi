import jwt from 'jsonwebtoken'
import config from "../config/config.js";

const register = async (req, res) => {
    res.clearCookie('cart')
    res.sendSuccess('Registered');
}
const login = async (req, res) => {

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
}

const current = async (req, res) => {
    res.sendSuccessWithPayload(req.user)
}

export default { register, login, current }