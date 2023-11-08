import express from 'express'
import Handlebars from 'express-handlebars'
import mongoose from "mongoose"
import cookieParser from 'cookie-parser'
import attachLogger from './middlewares/attachLogger.js'

import viewsRouter from './routes/views.router.js'
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import dictionaryRouter from './routes/dictionary.router.js'
import sessionsRouter from './routes/SessionsRouter.js'
import mockingproductsRouter from './routes/mockingproducts.router.js'

import initializeStrategies from './config/passport.config.js'
import __dirname from './utils.js'

import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'

import config from './config/config.js'

const app = express()


const PORT = config.app.PORT
app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`))

const connection = mongoose.connect(config.mongo.URL)

app.engine('handlebars', Handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use(express.static(`${__dirname}/public`))
app.use(express.json())
app.use(cookieParser())


app.use(express.urlencoded({ extended: true }))

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://agustingmaggi:Agustin011235@cluster0.ewlnbwy.mongodb.net/ecommerce?retryWrites=true&w=majority",
        ttl: 3600
    }),
    resave: false,
    saveUninitialized: false,
    secret: "papa"
}))

initializeStrategies()
app.use(passport.initialize())

app.use('/api/cart', cartRouter);
app.use('/', viewsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/products', productsRouter)
app.use('/api/dictionary', dictionaryRouter)
app.use('/mockingproducts', mockingproductsRouter)

// app.use('/loggerTest', attachLogger)
app.use(attachLogger)
app.get('/loggerTest', (req, res) => {
    req.logger.debug('a ver si anda')
    req.logger.http('a ver si anda')
    req.logger.info('a ver si anda')
    req.logger.warning('a ver si anda')
    req.logger.error('a ver si anda')
    req.logger.fatal('a ver si anda')
    res.send('mirar consola')
})
