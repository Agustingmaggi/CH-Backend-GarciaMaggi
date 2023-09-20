import { Router } from "express"
import passport from "passport"

const router = Router()

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/authFail', failureMessage: true }), async (req, res) => {
    res.send({ status: "success", payload: req.user._id })
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/authFail', failureMessage: true }), async (req, res) => {
    req.session.user = req.user
    res.send({ status: "success", message: "logged in" })
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