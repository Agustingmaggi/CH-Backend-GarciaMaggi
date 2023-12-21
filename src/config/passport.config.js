import passport from 'passport'
import local from 'passport-local'
import auth from "../services/auth.js"
import GithubStrategy from 'passport-github2'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { cookieExtractor } from '../utils.js'
import config from './config.js'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { userService } from '../services/index.js'

const LocalStrategy = local.Strategy

const initializeStrategies = () => {
    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email', session: false },
        async (req, email, password, done) => {
            try {
                const { firstName, lastName, age } = req.body

                if (!firstName || !email) return done(null, false, { message: "incomplete values" })

                const exists = await userService.getBy({ email })
                if (exists) return done(null, false, { message: 'User already exists' })

                const hashedPassword = await auth.createHash(password)
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    age,
                    password: hashedPassword
                }

                let cart
                if (req.cookies['cart']) {
                    cart = req.cookies['cart']
                } else {
                    cartResult = await cartService.createCart
                    cart = cartResult._id
                }

                newUser.cart = cart

                const result = await userService.createUser(newUser)
                console.log(firstName)
                return done(null, result)
            } catch (error) {
                console.log(error)
                return done(error)
            }
        }))

    passport.use('login', new LocalStrategy({ usernameField: 'email', session: false },
        async (email, password, done) => {
            try {
                if (!email || !password) return done(null, false, { message: "Incomplete Values" })

                if (email === config.app.ADMIN_EMAIL && password === config.app.ADMIN_PASSWORD) {
                    const adminUser = {
                        firstName: "admin",
                        lastName: "",
                        email: "",
                        age: 0,
                        password: "adminCod3r123",
                        role: "admin"
                    }
                    return done(null, adminUser);
                    // return res.send({ status: "success", message: "Logeado como administrador" });
                }

                const user = await userService.getBy({ email })
                if (!user) return done(null, false, { message: "Incorrect Credentials" })
                const isValidPassword = await auth.validatePassword(password, user.password)
                if (!isValidPassword) done(null, false, { message: "Incorrect Credentials" })
                done(null, user)
            } catch (error) {
                // console.log(error)
                return done(error)
            }
        }))
    //probando

    passport.use('google', new GoogleStrategy({
        clientID: config.app.GOOGLEID,
        clientSecret: config.app.GOOGLESECRET,
        callbackURL: 'http://localhost:8080/api/sessions/googlecallback',
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        const { _json } = profile
        const user = await userervice.getBy({ email: _json.email })
        if (user) {
            return done(null, user)
        } else {
            const newUser = {
                firstName: _json.given_name,
                lastName: _json.family_name,
                email: _json.email
            }

            let cart
            if (req.cookies['cart']) {
                cart = req.cookies['cart']
            } else {
                cartResult = await cartService.createCart
                cart = cartResult._id
            }
            const result = await userService.createUser(newUser)
            done(null, result)
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'jwtSecret'
    }, async (payload, done) => {
        return done(null, payload)
    }))

    passport.use('github', new GithubStrategy({
        clientID: 'config.app.CLIENTIDGITHUB',
        clientSecret: 'config.app.CLIENTSECRETGITHUB',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        const { email, name } = profile._json

        const user = await userService.getBy({ email })
        if (!user) {
            const newUser = {
                firstName: name,
                email,
                password: ''
            }
            const result = await userService.createUser(newUser)
            done(null, result)
        } else {
            done(null, user)
        }
    }))

    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await userService.getBy({ _id: id })
        done(null, user)
    })
}

export default initializeStrategies