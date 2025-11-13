const User = require("../models/User");
const Handler = require("../utils/handlers");
const statusCodes = require("../utils/statusCodes");
const encryptPass = require("../utils/encryptPass")
const validatePass = require("../utils/validatePass")
const genToken = require("../utils/genToken");
const Product = require("../models/Product");
const Order = require("../models/Order");

/*
    Admin: 
    - Add products
    - view all orders
    - view all delivery partners
    - view live status
*/
module.exports.addproducts = async (req, res, next) => {
    try {
        const { name, description, price, image } = req.body
        if(!name || !price){
            return Handler(statusCodes.BAD_REQUEST, false, 'All details required', res, null) 
        }

        const newProduct = await new Product({
            name,
            description,
            price,
            image
        }).save()

        if(newProduct){
            return Handler(statusCodes.CREATED, true, 'Product Added', res, null) 
        }
        else{
            return Handler(statusCodes.BAD_REQUEST, false, 'Error adding product', res, null) 
        }

    } catch (error) {
        console.error("Error in adding product: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}

module.exports.fetchallOrders = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit
        const id = req.query.id
        const status = req.query.status

        let query = id ? {
            _id: id
        } : {}

        if(status){
            query.status = status
        }

        const totalOrders = await Order.countDocuments(query)
        const orders = await Order.find(query).sort({createdAt: -1}).skip(skip).limit(limit).select("-__v").populate("customer", "name email").populate("assigned", "name email")
        
        if(orders.length === 0){
            return Handler(statusCodes.NOT_FOUND, false, 'No Orders Found', res, null) 
        }
        else{
            return Handler(statusCodes.SUCCESS, true, 'Orders fetched', res, {
                data: orders,
                pagination: {
                    totalEnteries: totalOrders,
                    totalPages: Math.ceil(totalOrders/limit),
                    currentPage: page,
                    pageSize: orders.length
                }
            }) 
        }

    } catch (error) {
        console.error("Error fetcing all order: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}

module.exports.fetchallDeliveryPartners = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit
        const id = req.query.id
        const search = req.query.search

        let query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        } : {}

        query.role = "delivery"

        if(id){
            query._id = id
        }

        const totalPartners = await User.countDocuments(query)
        const partners = await User.find(query).sort({createdAt: -1}).skip(skip).limit(limit).select("-__v -password")
        
        if(partners.length === 0){
            return Handler(statusCodes.NOT_FOUND, false, 'No Delivery Partners Found', res, null) 
        }
        else{
            return Handler(statusCodes.SUCCESS, true, 'Delivery Partner(s) fetched', res, {
                data: partners,
                pagination: {
                    totalEnteries: totalPartners,
                    totalPages: Math.ceil(totalPartners/limit),
                    currentPage: page,
                    pageSize: partners.length
                }
            }) 
        }

    } catch (error) {
        console.error("Error fetcing all delivery partners: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}

/*
    Customer:
    - place order
    - fetch all prev. orders
    - track order
    - view product catalog
*/

module.exports.fetchPrevOrders = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit

        let query = {
            customer: req.user.id
        }


        const totalOrders = await Order.countDocuments(query)
        const orders = await Order.find(query).sort({createdAt: -1}).skip(skip).limit(limit).select("-__v").populate("customer", "name email").populate("assigned", "name email")
        
        if(orders.length === 0){
            return Handler(statusCodes.NOT_FOUND, false, 'No Orders Found', res, null) 
        }
        else{
            return Handler(statusCodes.SUCCESS, true, 'Orders fetched', res, {
                data: orders,
                pagination: {
                    totalEnteries: totalOrders,
                    totalPages: Math.ceil(totalOrders/limit),
                    currentPage: page,
                    pageSize: orders.length
                }
            }) 
        }
    } catch (error) {
        console.error("Error in fetching prev. orders: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}

module.exports.createOrder = async (req, res, next) => {
    try {
        const customer = req.user.id
        const { items } = req.body

        const formatItems = items?.map((item) => ({
            productid: item._id,
            qty: item.qty,
            price: item.price
        }));

        const newOrder = await new Order({
            customer,
            items: formatItems
        }).save()

        if(newOrder){
            req.io.emit("order_available", newOrder)
            return Handler(statusCodes.CREATED, true, 'Order Created', res, null) 
        }
        else{
            return Handler(statusCodes.BAD_REQUEST, false, 'Error creating order', res, null) 
        }

    } catch (error) {
        console.error("Error in Creating ordwer: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}

module.exports.trackOrder = async (req, res, next) => {
    try {
        const id = req.params.id
        const order = await Order.findOne({_id: id})
        if(!order){
            return Handler(statusCodes.NOT_FOUND, false, 'Order Not Found', res, null) 
        }
        return Handler(statusCodes.SUCCESS, true, 'Order fetched', res, order) 
    } catch (error) {
        console.error("Error fetching order info: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}

module.exports.viewProductCatalogue = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit
        const id = req.query.id
        const search = req.query.search
        
        let query = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ],
        } : {}

        if(id){
            query._id = id
        }

        const totalProducts = await Product.countDocuments(query)
        const products = await Product.find(query).skip(skip).limit(limit).select("-__v")
        
        if(products.length === 0){
            return Handler(statusCodes.NOT_FOUND, false, 'No Products Found', res, null) 
        }
        else{
            return Handler(statusCodes.SUCCESS, true, 'Products fetched', res, {
                data: products,
                pagination: {
                    totalEnteries: totalProducts,
                    totalPages: Math.ceil(totalProducts/limit),
                    currentPage: page,
                    pageSize: products.length
                }
            }) 
        }
    } catch (error) {
        console.error("Error in Fetching Product Catalogue: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}

/*
    Deliveyr Partner:
    - accept/update order
    - get all orders ::: only show the ones without any assigny
    - 
*/

module.exports.acceptOrder = async (req, res, next) => {
    try {
        const usrid = req.user.id
        const orderid = req.params.id

        const findOrder = await Order.findOne({ _id: orderid, assigned: null })
        if(!findOrder){
            return Handler(statusCodes.NOT_FOUND, false, 'Order Not Found', res, null) 
        }
        const acceptOrder = await Order.findByIdAndUpdate(
            orderid,
            {
                assigned: usrid,
                status: "accepted"
            },
            {new: true}
        )

        if(acceptOrder){
            req.io.emit("order_accepted", { orderId: acceptOrder._id });
            return Handler(statusCodes.SUCCESS, true, 'Order Accepted', res, null);
        }


    } catch (error) {
        console.error("Error in Updating Order status: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}

module.exports.updateOrderStatus = async (req, res, next) => {
    try {
        const usrid = req.user.id
        const orderid = req.params.id
        const { status } = req.body

        const findOrder = await Order.findOne({
            _id: orderid,
            assigned: usrid
        })

        if(!findOrder){
            return Handler(statusCodes.NOT_FOUND, false, 'Order Not Found', res, null) 
        }
        
        if(!status){
            return Handler(statusCodes.FORBIDDEN, false, 'Status required', res, null) 
        }
        findOrder.status = status

        const orderUpdated = await findOrder.save()
        if(orderUpdated){
            req.io.emit("order_status_updated", {
                customerid: findOrder.customer,
                order: orderUpdated
            })
            return Handler(statusCodes.SUCCESS, true, 'Order Updated', res, null) 
        }
        

    } catch (error) {
        console.error("Error in Updating Order status: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}

module.exports.fetchallUnassignOrders = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit
        const id = req.query.id
        const meassigny = req.query.assigny

        let query = id ? {
            _id: id
        } : {}

        query.assigned = null
        if(meassigny && meassigny === "true"){
            query.assigned = req.user.id
        }

        const totalOrders = await Order.countDocuments(query)
        const orders = await Order.find(query).sort({createdAt: -1}).skip(skip).limit(limit).select("-__v").populate("customer", "name email").populate("assigned", "name email")
        
        if(orders.length === 0){
            return Handler(statusCodes.NOT_FOUND, false, 'No Orders Found', res, null) 
        }
        else{
            return Handler(statusCodes.SUCCESS, true, 'Orders fetched', res, {
                data: orders,
                pagination: {
                    totalEnteries: totalOrders,
                    totalPages: Math.ceil(totalOrders/limit),
                    currentPage: page,
                    pageSize: orders.length
                }
            }) 
        }

    } catch (error) {
        console.error("Error fetcing all order: ", error)
        return Handler(statusCodes.INTERNAL_SERVER_ERROR, false, 'Internal Server Error', res, null) 
    }
}