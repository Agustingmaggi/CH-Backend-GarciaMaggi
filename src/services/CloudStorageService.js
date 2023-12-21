import { Storage } from '@google-cloud/storage'
import __dirname from "../utils.js"

export default class CloudStorageService {
    constructor() {
        this.storage = new Storage({
            keyFilename: `${__dirname}/../molten-optics-406215-5f669e81e6a4.json`
        })
        this.bucket = 'curso_backend'
    }

    uploadFileToCloudStorage = (file) => {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(`${Date.now()}-${file.originalname}`)
        const blobStream = blob.createWriteStream();

        return new Promise((resolve, reject) => {
            blobStream.on('error', error => {
                console.log(error);
                reject(error);
            })
            blobStream.on('finish', () => {
                //Si llegaste hasta aquí, ya se escribió en el bucket
                const publicURL = `https://storage.googleapis.com/${this.bucket}/${blob.name}`
                // console.log(publicURL);
                resolve(publicURL);
            })
            blobStream.end(file.buffer);
        })

    }
}