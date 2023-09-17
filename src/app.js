import express from 'express'
import mongoose from "mongoose"
import session from 'express-session'
import MongoStore from 'connect-mongo'
import __dirname from './utils.js'
import Handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import sessionsRouter from './routes/sessions.router.js'

const app = express()

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`))

const connection = mongoose.connect("mongodb+srv://agustingmaggi:Agustin011235@cluster0.ewlnbwy.mongodb.net/ecommerce?retryWrites=true&w=majority")

app.engine('handlebars', Handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

app.use(express.static(`${__dirname}/public`))
app.use(express.json())
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

app.use('/api/cart', cartRouter);
app.use('/', viewsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/products', productsRouter)
