import { log } from "console";
// import razorpayInstance from "../config/razorpay.js";
import { Cart } from "../models/cartModel.js";
import { Order } from '../models/orderModel.js'
import crypto from 'crypto'


export const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency } = req.body;
        const options = {
            amount: Math.round(Number(amount) * 100), //Convert to paise
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1
        }

        const razorpayOrder = await razorpayInstance.orders.create(options)

        // Save order in DB
        const newOrder = new Order({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency,
            status: "Pending",
            razorpayOrderId: razorpayOrder.id
        })

        await newOrder.save()

        res.json({
            success: true,
            order: razorpayOrder,
            dbOrder: newOrder
        })

    } catch (error) {
        console.error("❌ Error is create Order", error);
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

export const verifiedPayment = async (req, res) => {
    try {
        const userId = req.user._id
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed } = req.body;
        if (paymentFailed) {
            const order = await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: "Failed" }, { new: true })
            return res.status(400).json({ success: false, message: "Payment Failed", order })
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
        crypto.createHmac('sha254', process.env.RAZORPAY_API_SECRET)
            .update(sign.toString())
            .digest('hex')

        if (expectedSignature === razorpay_signature) {
            const order = await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, {
                status: "Paid",
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature
            }, { new: true })

            await Cart.findOneAndUpdate({ userId }, { $set: { items: [], totalPrice: 0 } })

            return res.json({ success: true, message: "payment SuccessFully", order })
        } else {
            await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: "Failed" }, { new: true })
            return res.status(400).json({ success: false, message: "Invalid Signature" })
        }
    } catch (error) {
        console.error("❌ Error in verify Payment", error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getMyOrder = async (req, res) => {
    try {
        const userId = req.id;
        const orders = await Order.find({user:userId})
        .populate({path: "products.productId", select:"productName productPrice productImg"})
        .populate("user", "firstName lastName email")

        res.status(200).json({
            success:orders.length,
            orders
        })
    } catch (error) {
        console.error("Error fetching user order:", error);
        res.status(500).json({
            message:error.message
        })
        
    }
}
