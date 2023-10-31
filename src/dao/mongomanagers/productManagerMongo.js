import { productsModel } from "../models/products.js";
import mongoose from "mongoose";

export default class ProductManager {
    getProducts = async () => {
        try {
            return await productsModel.find().lean();
        } catch (error) {
            return error;
        }
    }

    getProductById = async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return `El producto con el ID: ${id} no fue encontrado`;
        }
        try {
            return await productsModel.findById(id);
        } catch (error) {
            return error
        }
    }

    addProduct = async (product) => {
        try {
            const existingProduct = await productsModel.findOne({ code: product.code });

            if (existingProduct) {
                return "Ya existe un producto con el mismo código";
            }

            const newProduct = await productsModel.create(product);
            return newProduct;
        } catch (error) {
            return error;
        }
    }


    updateProduct = async (id, product) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return `El producto con el ID: ${id} no fue encontrado`;
        }
        try {
            return await productsModel.findByIdAndUpdate(id, { $set: product });
        } catch (error) {
            return error
        }
    }

    deleteProduct = async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return `El producto con el ID: ${id} no fue encontrado`;
        }

        try {
            const deletedProduct = await productsModel.findByIdAndDelete(id);
            return deletedProduct;
        } catch (error) {
            return error;
        }
    }
}