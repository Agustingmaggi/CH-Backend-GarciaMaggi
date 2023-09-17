import { Router } from "express"
import userManager from '../dao/mongo/managers/UserManager.js'

const router = Router()

const usersService = new userManager()

router.post('/register', async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        age,
        password
    } = req.body
    if (!firstName || !email || !password) return res.status(400).send({ status: "error", error: "Incomplete Values" })

    const newUser = {
        firstName,
        lastName,
        email,
        age,
        password
    }
    const result = await usersService.create(newUser)
    console.log(firstName)
    res.send({ status: "success", payload: result._id })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).send({ status: "error", error: "incomplete values" })

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        const adminUser = {
            firstName: "admin",
            lastName: "",
            email: "",
            age: 0, // Puedes establecer la edad que desees
            password: "adminCod3r123", // O puedes encriptar la contraseña si es necesario
            role: "admin"
        }
        req.session.user = adminUser;
        console.log(adminUser)
        return res.send({ status: "success", message: "Logeado como administrador" });
    }

    const user = await usersService.getBy({ email, password })
    if (!user) return res.status(400).send({ status: "error", error: "incorrect credentials" })
    req.session.user = user
    res.send({ status: "success", message: "Logeado" })
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