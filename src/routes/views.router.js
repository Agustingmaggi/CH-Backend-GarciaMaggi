import productModel from '../dao/mongo/models/products.js';
//en realidad deberiamos consumir el manager en vez del model pero como
// tengo lo de paginate con el model, lo dejo como esta,por ahora..
import BaseRouter from './BaseRouter.js';
import CartManager from '../dao/mongo/managers/cartsManager.js';

const cartManager = new CartManager();

class ViewsRouter extends BaseRouter {
    init() {
        this.get('/', ['PUBLIC'], async (req, res) => {
            const { page = 1 } = req.query
            const result = await productModel.paginate({}, { page, limit: 5, lean: true });
            // console.log(result)
            const productos = result.docs
            const currentPage = result.page
            const { hasPrevPage, hasNextPage, prevPage, nextPage } = result

            const user = req.user
            res.render("Home", {
                productos: productos,
                page: currentPage,
                hasPrevPage,
                prevPage,
                hasNextPage,
                nextPage,
                user: user
            });
        })
        this.get('/register', ['NO_AUTH'], async (req, res) => {
            res.render('Register');
        })
        this.get('/login', ['NO_AUTH'], async (req, res) => {
            res.render('Login');
        })
        this.get('/profile', ['AUTH'], async (req, res) => {
            res.render('Profile', { user: req.user });
        })
        this.get('/carrito', ['AUTH'], async (req, res) => {
            const cartId = req.user.cart
            const cart = await cartManager.getCart(cartId, { populate: true })
            res.render('Carrito', { cart })
            console.log(cart)
        })

    }
}

const viewsRouter = new ViewsRouter();

export default viewsRouter.getRouter();

//El codigo de abajo es el anterior que tenia (ants del 10/10 cuando giuliano me ayudo).
// Lo dejo por si despues tengo que ver algo para hcer alguna ruta como la de router.get('/carts/:cid'

// router.get('/', ['NO_AUTH'], passportCall('jwt', { strategyType: 'LOCALS' }), async (req, res) => {
//     try {
//         const { page = 1 } = req.query
//         const result = await productModel.paginate({}, { page, limit: 5, lean: true });
//         // console.log(result)
//         const productos = result.docs
//         const currentPage = result.page
//         const { hasPrevPage, hasNextPage, prevPage, nextPage } = result

//         const user = req.user

//         res.render("Home", {
//             productos: productos,
//             page: currentPage,
//             hasPrevPage,
//             prevPage,
//             hasNextPage,
//             nextPage,
//             user: user
//         });
//         // console.log('----> este', req.user, 'viene de un console log en la ruta / de views router')
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
//     }
// });

// router.get('/profile', passportCall('jwt'), async (req, res) => {
//     res.render('Profile', { user: req.user });
//     console.log(req.user)
// });

// router.get('/register', async (req, res) => {
//     res.render('Register')
// })

// router.get('/login', async (req, res) => {
//     res.render('Login')
// })

// router.get('/carts/:cid', async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const cart = await cartModel.findById(cartId).populate('products.product').lean();
//         console.log(cart.products[0])
//         if (!cart) {
//             return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
//         }

//         const productosDelCarrito = cart.products;
//         // console.log(productosDelCarrito)

//         res.render("Carrito", {
//             productos: productosDelCarrito,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ status: "error", error: "Ocurrió un error en el servidor" });
//     }
// });

// export default router