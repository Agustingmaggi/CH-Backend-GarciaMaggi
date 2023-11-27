import mongoose from "mongoose";
import userManager from "../../../dao/mongo/managers/UserDao.js";
import { strict as assert } from 'assert'
import config from "../../../config/config.js";

mongoose.connect(config.mongo.URL)

describe('Test unitarios para DAO de usuarios', function () {

    this.timeout(10000)

    before(function () {
        this.users = new userManager()
    })

    after(function () {
        mongoose.connection.collections.users.drop()
        console.log('colection eliminada para la sig prueba')
    })

    it('El DAO debe poder devolver a los usuarios en formato de arreglo', async function () {
        const result = await this.users.get()
        assert.equal(Array.isArray(result), true)
    })

    it('El DAO debe poder insertar correctamente un usuario', async function () {
        const mockUser = {
            firstName: 'carlos',
            lastName: 'Perez',
            email: 'correo@correo.com',
            password: '123'
        }
        const result = await this.users.create(mockUser)
        assert.ok(result._id)
    })

    it('El DAO debe poder obtener usuarios a partir de algun parametro, como el email', async function () {
        const user = await this.users.getBy({ email: 'correo@correo.com' })
        assert.equal(typeof user, 'object')
    })
})