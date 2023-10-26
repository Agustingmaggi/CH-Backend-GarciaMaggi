import ProductsService from "./ProductsServices.js";
import CartService from "./CartServices.js";
import SessionService from "./SessionServices.js";

import productsManager from "../dao/mongo/managers/productsManager.js";
import cartManager from "../dao/mongo/managers/cartsManager.js";
import userManager from "../dao/mongo/managers/UserManager.js";

export const productsService = new ProductsService(new productsManager())
export const cartService = new CartService(new cartManager())
export const userService = new SessionService(new userManager())