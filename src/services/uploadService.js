import multer from 'multer'
import __dirname from '../utils.js'

//Almacenamiento en disco

// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         return callback(null, `${__dirname}/public/img`)
//     },
//     filename: function (req, file, callback) {
//         return callback(null, `${Date.now()}-${file.originalname}`)
//     }
// })

//multer ya no tiene prsencia en archivo, solo en memoria

const storage = multer.memoryStorage()



const uploader = multer({ storage })

export default uploader