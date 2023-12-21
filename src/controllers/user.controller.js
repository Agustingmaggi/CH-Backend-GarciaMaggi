import jwt from 'jsonwebtoken'
import config from "../config/config.js";
import MailerService from '../services/MailerService.js';
import DMailTemplates from '../constants/DMailTemplates.js';
import { userService } from '../services/index.js';
import authService from '../services/auth.js'
import CloudStorageService from "../services/CloudStorageService.js";

const register = async (req, res) => {
    try {
        const mailService = new MailerService()
        const result = await mailService.sendMail([req.user.email], DMailTemplates.WELCOME, { user: req.user })
    } catch (error) {
        console.log(`fallo envio de correo para ${req.user.email}`, error)
    }

    res.clearCookie('cart')
    res.sendSuccess('Registered');
}
const login = async (req, res) => {

    if (req.user.role == 'admin') {
        const tokenizedUser = {
            name: `${req.user.firstName} ${req.user.lastName}`,
            role: req.user.role,
            // Agregar cualquier otra propiedad específica para el usuario admin
        };
        const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1d' });
        res.cookie(config.jwt.COOKIE, token, { expiresIn: '1d' });
        res.send({ status: 'success', message: 'Logeado como administrador' });
    } else {

        const tokenizedUser = {
            name: `${req.user.firstName} ${req.user.lastName}`,
            id: req.user._id,
            role: req.user.role,
            email: req.user.email,
            cart: req.user.cart
        }
        const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1d' })

        res.cookie(config.jwt.COOKIE, token, { expiresIn: "1d" })
        res.clearCookie('cart')
        // req.logger.info("probando")
        res.sendSuccess('Logged in')
    }
}

const current = async (req, res) => {
    res.sendSuccessWithPayload(req.user)
}

const changeToPremium = async (req, res) => {
    const { uid } = req.params
    const requiredDocuments = ['Identificacion.jpeg', 'Comprobante de domicilio.jpeg', 'Comprobante de estado de cuenta.jpeg'];
    try {
        const user = await userService.getBy({ _id: uid })

        const documentsLoaded = user.documents.every(document =>
            requiredDocuments.includes(document.name)
        );
        if (documentsLoaded) {
            const updateUser = { role: 'premium' }
            await userService.updateUser(uid, updateUser)
            res.send({ status: "success", message: "cambiaste el rol del usuario a premium" })
        } else {
            res.status(400).send({
                status: 'error',
                message: 'El usuario no ha cargado todos los documentos requeridos'
            });
        }
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al cambiar a premium', error });
    }
};

const password = async (req, res) => {
    const { email } = req.body
    const user = await userService.getBy({ email })
    if (!user) return res.sendBadRequest('User doesnt exist')
    const token = jwt.sign({ email }, config.jwt.SECRET, { expiresIn: 30 })
    const mailerService = new MailerService()
    const result = await mailerService.sendMail([email], DMailTemplates.PASSWORD, { token })
    res.sendSuccess('email sent')
}

const restorePassword = async (req, res) => {
    const { newPassword, token } = req.body
    if (!newPassword || !token) return res.sendBadRequest('Incomplete values')
    try {
        const { email } = jwt.verify(token, config.jwt.SECRET)
        // console.log(email)
        const user = await userService.getBy({ email })
        // console.log(user)
        if (!user) return res.sendBadRequest("User doesnt exist")
        const isSamePassword = await authService.validatePassword(newPassword, user.password)
        if (isSamePassword) return res.sendBadRequest('New password cant be equal to old one')
        const hashNewPassword = await authService.createHash(newPassword)
        await userService.updateUser(user._id, { password: hashNewPassword })
        //TODO ESTE CODIGO FUNCIONA SOLO SI APRETAS ENTER (Y NO CLICK EN EL BOTON DE ENVIAR) EN LA VISTA DE PONER TU NUEVA CONTRA
        res.sendSuccess()
        //    console.log("Por mas de que tire error de jwt vencido y de que no se puede setear headers despues de enviarselos al cliente, sí cambia la contrasenia del usuario")

    } catch (error) {
        console.log(error)
        res.sendBadRequest('Invalid token')
    }

}
const google = async (req, res) => {
    const tokenizedUser = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        id: req.user._id,
        role: req.user.role,
        email: req.user.email,
        cart: req.user.cart
    }

    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1d' })

    res.cookie(config.jwt.COOKIE, token, { expiresIn: "1d" })
    res.clearCookie('cart')
    // req.logger.info("probando")
    res.redirect('/')
    // res.sendStatus(200) // si pones esto te tira error de headers porque no pods enviar un status despues
}

const subirDocs = async (req, res) => {
    const googleStorageService = new CloudStorageService()
    const documents = []
    // console.log(req.files)
    for (const file of req.files) {
        const url = await googleStorageService.uploadFileToCloudStorage(file)
        const document = {
            name: file.originalname,
            reference: url
        }
        documents.push(document)
    }
    const uid = req.params.uid
    const user = await userService.updateUser({ _id: uid }, { documents: documents })
    res.send({ status: 'success', payload: user })
}

export default { register, login, current, changeToPremium, password, restorePassword, google, subirDocs }