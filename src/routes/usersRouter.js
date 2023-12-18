import BaseRouter from "./BaseRouter.js";
import uploader from '../services/uploadService.js'

import userController from "../controllers/user.controller.js";

class SessionsRouter extends BaseRouter {
    init() {
        this.post('/premium/:uid', ['PUBLIC'], userController.changeToPremium)
        this.post('/:uid/documents', ['PUBLIC'], uploader.array('images'), userController.subirDocs)
    }
}

const router = new SessionsRouter()

export default router.getRouter()