import nodemailer from 'nodemailer'

export default class MailerService {
    constructor() {
        this.client = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {

            }
        })
    }
}