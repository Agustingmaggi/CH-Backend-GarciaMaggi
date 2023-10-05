import { Router } from "express"
import passport from "passport"
import jwt from 'jsonwebtoken'
import passportCall from "../middlewares/passportCall.js"
import authorization from "../middlewares/authorization.js"

const router = Router()

router.post('/register', passportCall('register'), (req, res) => {
    res.send({ status: "success", payload: req.user._id })
})

router.post('/login', passportCall('login'), (req, res) => {
    // req.session.user = req.user
    const tokenizedUser = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        id: req.user._id,
        role: req.user.role,
        email: req.user.email
    }
    //estos console log son para chequear si ambos funcionan y qué traen exactamente
    console.log(req.user.firstName)
    console.log(tokenizedUser)

    const token = jwt.sign(tokenizedUser, 'jwtSecret', { expiresIn: '1d' })


    res.cookie('authCookie', token, { httpOnly: true }).send({ status: "success", message: "logged in" })
})

router.get('/github', passport.authenticate('github'), (req, res) => { })
router.get('/githubcallback', passport.authenticate('github'), (req, res) => {
    req.session.user = req.user
    res.redirect('/')
})

router.get('/authFail', (req, res) => {
    console.log(req.session.messages)
    res.status(401).send({ status: "error", error: "error de autenticacion" })
})

router.get('/current', passportCall('jwt'), authorization('admin'), (req, res) => {
    const user = req.user
    res.send({ status: "success", payload: user })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error)
            return res.redirect('/')
        } else {
            res.redirect('/login')
        }
    })
})

export default router