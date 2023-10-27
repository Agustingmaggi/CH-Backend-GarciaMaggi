import fs from 'fs';

export default class productsDao {
    constructor() {
        this.path = `./src/dao/FS/files/products.json`;
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

    create = async (product) => {
        const products = await this.get();
        if (products.length === 0) {
            product.id = 1;
        } else {
            product.id = products[products.length - 1].id + 1;
        }
        products.push(toy);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return product;
    }

    update = (product) => {

    }
}