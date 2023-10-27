export default class SessionRepository {
    constructor(dao) {
        this.dao = dao
    }
    get = () => {
        return this.dao.get()
    }
    getBy = (param) => {
        return this.dao.getBy(param)
    }
    createUser = (user) => {
        return this.dao.create(user)
    }
    updateUser = (id, user) => {
        return this.dao.updateUser(id, user)
    }
    deleteUser = (id) => {
        return this.dao.deleteUser(id)
    }
}