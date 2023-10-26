export default class SessionService {
    constructor(manager) {
        this.manager = manager
    }
    get = () => {
        return this.manager.get()
    }
    getBy = (param) => {
        return this.manager.getBy(param)
    }
    createUser = (user) => {
        return this.manager.create(user)
    }
    updateUser = (id, user) => {
        return this.manager.updateUser(id, user)
    }
    deleteUser = (id) => {
        return this.manager.deleteUser(id)
    }
}