import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUrl.js";
import { Order } from "../models/orderModel.js";

export const addProduct = async (req, res) => {
    try {
        const { productName, productDesc, productPrice, category, brand } = req.body;
        const userId = req.id;

        if (!productName || !productDesc || !productPrice || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //Handle Multiple Image Upload
        let productImg = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file)
                const result = await cloudinary.uploader.upload(fileUri, { folder: "mern_products" });
                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                })
            }
        }

        //create product in DB
        const newProduct = await Product.create({
            userId,
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            productImg
        })

        return res.status(200).json({
            success: true,
            message: "Product added successfully",
            product: newProduct
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products available"
            });
        }
        return res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        //delete image fom cloudinary
        if (product.productImg && product.productImg.length > 0) {
            for (const img of product.productImg) {
                const result = await cloudinary.uploader.destroy(img.public_id);

            }
        }

        //delete product from mongoDb
        await Product.findByIdAndDelete(productId)
        return res.status(200).json({
            success: true,
            message: "Product delete Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, productDesc, productPrice, category, brand, existingImages } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        let updateImages = [];

        //keep selected old images
        // const { existingImages } = req.body
        if (existingImages) {
            const keepIds = JSON.parse(existingImages)
            // ✅ keep selected images
            updateImages = product.productImg.filter((img) =>
                keepIds.includes(img.public_id)
            )

            // ✅ remove unselected images
            const removedImages = product.productImg.filter((img) =>
                !keepIds.includes(img.public_id)
            )


            for (const img of removedImages) {
                await cloudinary.uploader.destroy(img.public_id)
            }
        } else {
            updateImages = product.productImg
        }

        //Upload new img if any
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file)
                const result = await cloudinary.uploader.upload(fileUri, { folder: "mern_products" });
                updateImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                })
            }
        }

        //Update Product
        product.productName = productName || product.productName
        product.productDesc = productDesc || product.productDesc
        product.productPrice = productPrice || product.productPrice
        product.category = category || product.category
        product.brand = brand || product.brand

        product.productImg = updateImages;


        await product.save()
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//Home bestseller and catgeory
export const getBestSellerProducts = async (req, res) => {
    try {

        // Aggregate most ordered products
        const bestSellers = await Order.aggregate([

            { $unwind: "$products" },

            {
                $group: {
                    _id: "$products.productId",

                    totalSold: {
                        $sum: "$products.quantity"
                    }
                }
            },

            {
                $sort: {
                    totalSold: -1
                }
            },

            {
                $limit: 4
            }
        ])

        // get only product ids
        const productIds = bestSellers.map(item => item._id)

        const products = await Product.find({
            _id: { $in: productIds }
        })

        return res.status(200).json({
            success: true,
            products
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export const getCategories = async (req, res) => {
    try {

        const categories = await Product.aggregate([

            // sort products high to low
            {
                $sort: {
                    productPrice: -1
                }
            },

            // group by category
            {
                $group: {
                    _id: "$category",

                    image: {
                        $first: {
                            $arrayElemAt: ["$productImg.url", 0]
                        }
                    },

                    highestPrice: {
                        $first: "$productPrice"
                    }
                }
            },

            // sort categories by highest price
            {
                $sort: {
                    highestPrice: -1
                }
            },

            // final response
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    image: 1,
                    highestPrice: 1
                }
            }

        ])

        return res.status(200).json({
            success: true,
            categories
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
