import dotenv from 'dotenv';
import { Command } from 'commander'

const program = new Command();
program.option('-m, --mode <mode>', 'Modo de trabajo', 'production')
    .option('-p <port>', 'Puerto del servidor', 8080)

program.parse();

const envPath = program.opts().mode === "dev" ? './.env.dev' : './.env.prod'
dotenv.config({
    path: envPath
})

if (envPath === "./.env.dev") {
    console.log(`ATENCION! Estas trabajando en desarrollo! --> ${envPath}`);
} else console.log("Estas en produccion, podes hacer lo que quieras..")

export default {
    app: {
        PORT: process.env.PORT || 8080,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        PERSISTENCE: process.env.PERSISTENCE || 'MONGO',
        GOOGLEID: process.env.CLIENTID,
        GOOGLESECRET: process.env.CLIENTSECRET,
        CLIENTIDGITHUB: process.env.CLIENTIDGITHUB,
        CLIENTSECRETGITHUB: process.env.CLIENTSECRETGITHUB
    },
    mongo: {
        URL: process.env.MONGO_URL || 'localhost:27017'
    },
    jwt: {
        COOKIE: process.env.JWT_COOKIE,
        SECRET: process.env.JWT_SECRET
    },
    mailer: {
        USER: process.env.NODE_MAILER_USER,
        PWD: process.env.NODE_MAILER_PASSWORD
    }
}