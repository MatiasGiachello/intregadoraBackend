import { cartModel } from '../models/carts.js'

export default class cartManager {
    getCarts = async () => {
        try {
            const carts = await cartModel.find()
            return carts
        } catch (error) {
            return error
        }
    }

    getCartById = async (id) => {
        try {
            const cart = await cartModel.findById(id)
            return cart
        } catch (error) {
            return error
        }
    }

    addCart = async (products) => {
        try {
            let cartData = {}
            if (products && products.length > 0) {
                cartData.products = products;
            }
            console.log(cartData)

            const cart = await cartModel.create(cartData)
            return cart
        } catch (error) {
            return error
        }
    }

    addProductInCart = async (cartId, product) => {
        try {
            const filter = { _id: cartId, "products._id": product._id }
            const cart = await cartModel.findById(cartId)
            const findProduct = cart.products.some((product) => product._id.toString() === product._id)

            if (findProduct) {
                const update = { $inc: { "products.$.quantity": product.quantity } };
                await cartModel.updateOne(filter, update)
            } else {
                const update = { $push: { products: { _id: product._id, quantity: product.quantity } } };
                await cartModel.updateOne({ _id: cartId }, update)
            }

            return await cartModel.findById(cartId)
        } catch (error) {
            return error
        }
    }
}