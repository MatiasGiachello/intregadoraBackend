import fs from 'fs'

class CartManager {
    constructor(path) {
        this.path = path
        this.carts = []
    }

    writeFile = async data => {
        try {
            await fs.promises.writeFile(
                this.path, JSON.stringify(data, null, 2)
            )
        } catch (error) {
            console.log(error)
        }
    }

    getCarts = async () => {
        try {
            const productsList = await fs.promises.readFile(this.path, 'utf-8')
            const product = productsList === "" ? [] : JSON.parse(productsList)
            return product
        } catch (error) {
            if (error.message.includes('ENOENT: no such file or directory')) return []
            console.log(error)
        }
    }

    getCartById = async (id) => {
        let cartProd = await this.getCarts()
        const cartFound = cartProd.find(product => product.id === id)
        if (cartFound) {
            return cartFound
        } else {
            return (`El Carrito con el ID: ${id} no ha sido encontrado`)
        }
    }

    addCart = async () => {
        const listCarts = await this.getCarts()
        const cartNew = {
            products: []
        }

        if (listCarts.length === 0) {
            cartNew.id = 1;
        } else {
            cartNew.id = listCarts[listCarts.length - 1].id + 1;
        }

        listCarts.push(cartNew)
        await this.writeFile(listCarts)
    }

    addProductToCart = async (cid, pid) => {
        const listaCarts = await this.getCarts();
        const cart = listaCarts.find(e => e.id === cid);
        const productIndex = cart.products.findIndex(p => p.pid === pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({
                pid,
                quantity: 1
            });
        }

        await this.writeFile(listaCarts);
    }
}

export default CartManager