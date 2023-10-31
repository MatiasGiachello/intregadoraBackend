import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import { __dirname } from './utils.js'
import './dao/dbConfig.js'

import ProductManager from "./dao/mongomanagers/productManagerMongo.js";
const pManager = new ProductManager()

import MessagesManager from './dao/mongomanagers/messageManagerMongo.js'
const msgMaganer = new MessagesManager()

import productsRouter from './routes/products.js'
import cartRouter from './routes/cart.js'
import viewRouter from './routes/view.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const PORT = process.env.PORT || 8080;

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.static(__dirname + '/public'));

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewRouter)


const server = app.listen(8080, () => {
    console.log(`Servidor Inicializado en el Puerto ${PORT}`)
})

const socketServer = new Server(server)
socketServer.on('connection', async socket => {
    console.log("Cliente conectado con ID:", socket.id)

    // PRODUCTOS
    const products = await pManager.getProducts();
    socket.emit('productos', products);

    socket.on('addProduct', async (data) => {
        await pManager.addProduct(data);
        const updatedProducts = await pManager.getProducts();
        socketServer.emit('productosupdated', updatedProducts);
    });

    socket.on("deleteProduct", async (id) => {
        await pManager.deleteProduct(id);
        const updatedProducts = await pManager.getProducts();
        socketServer.emit("productosupdated", updatedProducts);
    });

    // CHAT
    socket.on("nuevoUsuario", (usuario) => {
        console.log("Usuario:", usuario)
        socket.broadcast.emit("broadcast", usuario)
    })
    socket.on("disconnect", () => {
        console.log("Usuario desconectado", socket.id)
    })
    socket.on("message", async (info) => {
        console.log(info)
        await msgMaganer.createMessage(info)
        socketServer.emit("chat", await msgMaganer.getMessages())
    })
})