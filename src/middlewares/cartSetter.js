import cartManager from "../dao/mongo/managers/cartsDao.js";

const cartService = new cartManager();

const cartSetter = async (req, res, next) => {
    if (!req.cookies.cart && !req.user) {
        const cart = await cartService.createCart();
        res.cookie('cart', cart._id.toString())
    }
    next();
}

export default cartSetter;