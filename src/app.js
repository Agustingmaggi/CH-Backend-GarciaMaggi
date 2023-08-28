import express from 'express'
import mongoose from "mongoose"
import __dirname from './utils.js'
import Handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'

import messageModel from './dao/mongo/models/message.js'
import cartModel from './dao/mongo/models/cart.js'

import productsRouter from './routes/products.router.js'

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

// app.get('/', async (req, res) => { //toda operacion que implique acceso a datos es asincrona
//     const messages = await messageModel.find()
//     res.send({ messages })
// })

app.get('/cart', async (req, res) => {
    const cart = [
        { firstName: "Christian", lastName: "Menendez", age: 27, dni: "23423", grade: 10 },
        { firstName: "carlo", lastName: "Menendez", age: 27, dni: "23423", grade: 10 },
        { firstName: "pedro", lastName: "Menendez", age: 27, dni: "23423", grade: 10 }
    ]
    const result = await cartModel.insertMany(cart)
    res.send({ status: "success", payload: result })
})

app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
