import ProductsService from "./ProductsServices.js";
import CartService from "./CartServices.js";
import SessionService from "./SessionServices.js";

import PersistenceFactory from "../dao/PersistenceFactory.js";

const { ProductsDao, CartsDao, UsersDao } = await PersistenceFactory.getPersistence();

console.log("PersistenceFactory.getPersistence() result:", { ProductsDao, CartsDao, UsersDao });

export const productsService = new ProductsService(new ProductsDao())
export const cartService = new CartService(new CartsDao())
export const userService = new SessionService(new UsersDao())