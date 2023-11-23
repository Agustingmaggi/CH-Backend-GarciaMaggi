import config from "../config/config.js";

export default class PersistenceFactory {

    static getPersistence = async () => {
        //Tengo una lista de las ENTIDADES que necesito modelar a nivel persistencia.
        let UsersDao;
        let CartsDao;
        let ProductsDao;
        let TicketsDao;

        switch (config.app.PERSISTENCE) {
            case "MEMORY": {
                ProductsDao = (await import('./Memory/productsDao.js')).default;
                CartsDao = (await import('./Memory/cartsDao.js')).default;
                UsersDao = (await import('./Memory/usersDao.js')).default;
                // TicketsDao = (await import('./Memory/ticketsDao.js')).default;
                break;
            }
            case "FS": {
                ProductsDao = (await import('./FS/productsDao.js')).default;
                CartsDao = (await import('./FS/cartsDao.js')).default;
                UsersDao = (await import('./FS/usersDao.js')).default;
                // TicketsDao = (await import('./FS/ticketsDao.js')).default;
                break;
            }
            case "MONGO": {
                ProductsDao = (await import('./mongo/managers/productsDao.js')).default;
                CartsDao = (await import('./mongo/managers/cartsDao.js')).default;
                UsersDao = (await import('./mongo/managers/UserDao.js')).default;
                TicketsDao = (await import('./mongo/managers/ticketsDao.js')).default;
                break;
            }
        }
        return {
            ProductsDao, CartsDao, UsersDao, TicketsDao
        }
    }

}