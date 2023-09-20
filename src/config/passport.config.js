import passport from 'passport'
import local from 'passport-local'
import UserManager from "../dao/mongo/managers/UserManager.js"
import auth from "../services/auth.js"

const localStrategy = local.Strategy
const usersService = new UserManager()

const initializeStrategies = () => {
    passport.use('register', new localStrategy({ passReqToCallback: true, usernameField: 'email' }, async (email, password, done) => {
        const {
            firstName,
            lastName,
            age
        } = req.body
        if (!firstName || !email || !password) return done(null, false, { message: "incomplete values" })
        const hashedPassword = await auth.createHash(password)
        const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: hashedPassword
        }
        const result = await usersService.create(newUser)
        console.log(firstName)
        done(null, result)
    }))

    passport.use('login', new localStrategy({ usernameField: 'email' }, async (email, password, done) => {
        if (!email || !password) return done(null, false, { message: "Incomplete Values" })

        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            const adminUser = {
                firstName: "admin",
                lastName: "",
                email: "",
                age: 0,
                password: "adminCod3r123",
                role: "admin"
            }
            req.session.user = adminUser;
            console.log(adminUser)
            return res.send({ status: "success", message: "Logeado como administrador" });
        }

        const user = await usersService.getBy({ email })
        if (!user) return done(null, false, { message: "Incorrect Credentials" })
        const isValidPassword = await auth.validatePassword(password, user.password)
        if (!isValidPassword) done(null, false, { message: "Incorrect Credentials" })
        done(null, user)

    }))


    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await usersService.getBy({ _id: id })
        done(null, user)
    })
}

export default initializeStrategies