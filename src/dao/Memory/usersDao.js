export default class usersDao {
    constructor() {
        this.users = [];
    }

    get = () => {
        return this.users;
    }

    create = (user) => {
        user.id = this.users.length === 0 ? 1 : this.users[this.users.length - 1].id + 1;
        this.users.push(user);
        return user;
    }
    update = () => {

    }
}