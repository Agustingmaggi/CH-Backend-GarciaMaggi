import config from "../config/config.js";

export default class PersistenceFactory {

    static getPersistence = async () => {
        //Tengo una lista de las ENTIDADES que necesito modelar a nivel persistencia.
        let UsersDao;
        let CartsDao;
        let ProductsDao;

        switch (config.app.PERSISTENCE) {
            // case "MEMORY": {
            //     ProductsDao = (await import('./Memory/toysDao.js')).default;
            //     CartsDao = (await import('./Memory/toysDao.js')).default;
            //     UsersDao = (await import('./Memory/toysDao.js')).default;
            //     break;
            // }
            // case "FS": {
            //     ProductsDao = (await import('./FS/ToysDao.js')).default;
            //     CartsDao = (await import('./FS/ToysDao.js')).default;
            //     UsersDao = (await import('./FS/ToysDao.js')).default;
            //     break;
            // }
            case "MONGO": {
                ProductsDao = (await import('./mongo/managers/productsDao.js')).default;
                CartsDao = (await import('./mongo/managers/cartsDao.js')).default;
                UsersDao = (await import('./mongo/managers/UserDao.js')).default;
                console.log("ProductsDao:", ProductsDao);
                console.log("CartsDao:", CartsDao);
                console.log("UsersDao:", UsersDao);
                break;
            }
        }
        return {
            ProductsDao, CartsDao, UsersDao
        }
    }

}