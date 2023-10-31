import fs from 'fs'

class ProductManager {
    constructor(path) {
        this.products = []
        this.path = path
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

    getProducts = async () => {
        try {
            const productsList = await fs.promises.readFile(this.path, 'utf-8')
            const product = productsList === "" ? [] : JSON.parse(productsList)
            return product
        } catch (error) {
            if (error.message.includes('ENOENT: no such file or directory')) return []
            console.log(error)
        }
    }

    addProduct = async (title, description, price, status, category, thumbnail, code, stock) => {

        let products = await this.getProducts()

        const product = {
            title,
            description,
            price,
            status: true,
            category,
            thumbnail,
            code,
            stock
        }

        if (!title || !description || !price || !code || !stock || !category) {
            return ("Debe completar todos los Datos para Generar un nuevo Producto")
        }

        const codeExists = products.some(product => product.code === code)
        if (codeExists) {
            return ("El Código del Producto ya existe. Debe ser único para cada Producto")
        }


        if (products.length === 0) {
            product.id = 1;
        } else {
            product.id = products[products.length - 1].id + 1;
        }

        products.push(product)
        await this.writeFile(products)
        return this.getProducts()

    }

    getProductById = async (id) => {
        let products = await this.getProducts()

        const productFind = products.find(product => product.id === id)
        if (productFind) {
            return productFind
        } else {
            return (`El producto con el ID: ${id} no ha sido encontrado`)
        }
    }

    updateProduct = async (id, { title, description, price, thumbnail, code, stock }) => {
        try {
            let products = await this.getProducts()
            let product = await this.getProductById(id)
            if (product) {
                Object.assign(products[id - 1], { title, description, price, thumbnail, code, stock })
                await this.writeFile(products)
            }
        } catch (error) {
            console.log(error)
        }
    }

    deleteProduct = async (id) => {
        try {
            let products = await this.getProducts()
            let product = await this.getProductById(id)
            let newList = products.filter(prod => prod.id !== id)
            if (product) {
                await this.writeFile(newList)
            }

        } catch (error) {
            console.log(error)
        }
    }

}

export default ProductManager