import { Router } from "express";
import ProductManager from "../dao/mongomanagers/productManagerMongo.js";
import { __dirname } from "../utils.js";

const router = Router()
const pManager = new ProductManager()

router.get('/', async (req, res) => {
    const listProducts = await pManager.getProducts()
    res.render("home", { listProducts })
})

router.get('/realtimeproducts', (req, res) => {
    res.render("realTimeProducts")
})

router.get('/chat', (req, res) => {
    res.render("chat")
})

export default router