import fs from 'fs';

export default class ToysDao {
    constructor() {
        this.path = `./src/dao/FS/files/toys.json`;
        this.init();
    }

    init = () => {
        const exists = fs.existsSync(this.path);
        if (!exists) {
            fs.writeFileSync(this.path, JSON.stringify([]));
        }
    }

    get = async () => {
        const content = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(content);
    }

    create = async (toy) => {
        const toys = await this.get();
        if (toys.length === 0) {
            toy.id = 1;
        } else {
            toy.id = toys[toys.length - 1].id + 1;
        }
        toys.push(toy);
        await fs.promises.writeFile(this.path, JSON.stringify(toys, null, '\t'));
        return toy;
    }

    update = (toy) => {

    }
}