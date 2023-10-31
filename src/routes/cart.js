import { Router } from "express"
import CartManager from "../dao/mongomanagers/cartManagerMongo.js"
import ProductManager from "../dao/mongomanagers/productManagerMongo.js"
import { __dirname } from "../utils.js"

const cManager = new CartManager()
const pManager = new ProductManager()

const router = Router()

router.get("/", async (req, res) => {
    const carrito = await cManager.getCarts()
    res.json({ carrito });
})

router.get("/:cid", async (req, res) => {
    const carritoFound = await cManager.getCartById(req.params.cid);
    res.json({ status: "success", carritoFound });
});


router.post('/', async (req, res) => {
    try {
        const obj = req.body;
        if (!Array.isArray(obj)) {
            return res.status(400).send('Invalid request: products must be an array');
        }

        const validProducts = [];

        for (const product of obj) {
            const checkId = await pManager.getProductById(product._id);
            if (checkId === `El producto con el ID: ${product._id} no fue encontrado`) {
                return res.status(404).send(`Product with id ${product._id} not found`);
            }
            validProducts.push({ _id: product._id, quantity: product.quantity });
        }
        const cart = await cManager.addCart(validProducts);
        res.status(200).send(cart);

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const checkIdProduct = await pManager.getProductById(pid);
        if (!checkIdProduct) {
            return res.status(404).send({ message: `Product with ID: ${pid} not found` });
        }

        const checkIdCart = await cManager.getCartById(cid);
        if (!checkIdCart) {
            return res.status(404).send({ message: `Cart with ID: ${cid} not found` });
        }

        const result = await cManager.addProductInCart(cid, { _id: pid, quantity: quantity });
        console.log(result);
        return res.status(200).send({
            message: `Product with ID: ${pid} added to cart with ID: ${cid}`,
            cart: result,
        });
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).send({ message: "An error occurred while processing the request" });
    }
});


export default router