export default class ToysDao {
    constructor() {
        this.toys = [];
    }

    get = () => {
        return this.toys;
    }

    create = (toy) => {
        toy.id = this.toys.length === 0 ? 1 : this.toys[this.toys.length - 1].id + 1;
        this.toys.push(toy);
        return toy;
    }
    update = () => {

    }
}