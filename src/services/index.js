import ProductsService from "./ProductsServices.js";
import CartService from "./CartServices.js";

import productsManager from "../dao/mongo/managers/productsManager.js";
import cartManager from "../dao/mongo/managers/cartsManager.js";

export const productsService = new ProductsService(new productsManager())
export const cartService = new CartService(new cartManager())