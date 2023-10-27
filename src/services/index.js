import ProductsRepository from "./repositories/ProductsRepository.js";
import CartsRepository from "./repositories/CartsRepository.js";
import SessionRepository from "./repositories/SessionRepository.js";

import PersistenceFactory from "../dao/PersistenceFactory.js";

const { ProductsDao, CartsDao, UsersDao } = await PersistenceFactory.getPersistence();

export const productsService = new ProductsRepository(new ProductsDao())
export const cartService = new CartsRepository(new CartsDao())
export const userService = new SessionRepository(new UsersDao())