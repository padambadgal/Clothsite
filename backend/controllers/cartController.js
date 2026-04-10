import { Cart } from '../models/cartModel.js'
import { Product } from '../models/productModel.js'

export const getCart = async (req, res) => {
    try {
        const userId = req.id;
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart) {
            return res.json({
                success: true,
                cart: []
            })
        }
        res.status(200).json({
            success: true,
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.id;

        //check Product Exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        // Find the user's cart (if exists)
        let cart = await Cart.findOne({ userId });

        //if cart doesn't exists, craete new one
        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity: 1, price: product.productPrice }],
                totalPrice: product.productPrice
            })
        } else {
            //Find  if product is alresy exists in cart
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId)

            if (itemIndex > -1) {
                //If product exists -> just increase quantity
                cart.items[itemIndex].quantity += 1
            } else {
                //If new product  -> Push to cart
                cart.items.push({ productId, quantity: 1, price: product.productPrice })
            }

            // Recalculate total price
            cart.totalPrice = cart.items.reduce((total, item) =>
                total + (item.price * item.quantity), 0
            )
        }

        //save Updated Cart

        await cart.save()

        //populate product deatil before sending response
        const populatedCart = await Cart.findById(cart._id).populate("items.productId")

        res.status(200).json({
            success: true,
            message: "Product added to cart Successfully",
            cart: populatedCart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, type } = req.body;

        // Find the user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }

        // Find the product index in the cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            })
        }

        if (type === 'increase') {
            cart.items[itemIndex].quantity += 1;
        }

        if (type === 'decrease' && cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        }

        // Recalculate total price
        cart.totalPrice = cart.items.reduce((total, item) =>
            total + (item.price * item.quantity), 0
        )

        // Save updated cart
        await cart.save();

        // Populate product details before sending response
        const populatedCart = await Cart.findById(cart._id).populate("items.productId");

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart: populatedCart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.id
        const {productId} = req.body

        let cart = await Cart.findOne({userId})
        if (!cart) {
            res.status(400).json({
                success:false,
                message:"Cart not found"
            })
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId)

        cart.totalPrice = cart.items.reduce((total,item) => 
            total + (item.price * item.quantity), 0)

        cart  = await cart.populate('items.productId') 

        await cart.save()
        res.status(200).json({
            success:true,
            message:"Product removed from cart",
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}