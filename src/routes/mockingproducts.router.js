import express from 'express';

const mockingproductsRouter = express.Router();

mockingproductsRouter.get('/', (req, res) => {
    const mockedProducts = generateMockedProducts();
    res.json(mockedProducts);
});

function generateMockedProducts() {
    const mockedProducts = [];
    for (let i = 1; i <= 100; i++) {
        const product = {
            _id: i,
            name: `Product ${i}`,
            description: `Description for Product ${i}`,
            price: Math.random() * 100, // Random price
        };
        mockedProducts.push(product);
    }
    return mockedProducts;
}

export default mockingproductsRouter;