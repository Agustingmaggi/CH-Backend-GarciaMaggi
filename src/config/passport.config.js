import passport from 'passport'
import local from 'passport-local'
import UserManager from "../dao/mongo/managers/UserManager.js"
import auth from "../services/auth.js"
import GithubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy
const usersService = new UserManager()

const initializeStrategies = () => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, email, password, done) => {
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

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
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

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.6716409f195868aa',
        clientSecret: '95a51a7beedda6fca62c6963355a5ed414dc2621',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        const { email, name } = profile._json

        const user = await usersService.getBy({ email })
        if (!user) {
            const newUser = {
                firstName: name,
                email,
                password: ''
            }
            const result = await usersService.create(newUser)
            done(null, result)
        } else {
            done(null, user)
        }
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