const isAdmin = require("../middlewares/isAdmin")
const isCustomer = require("../middlewares/isCustomer")
const isDelivery = require("../middlewares/isDelivery")
const authorizeRole = require("../middlewares/authorizeRole")
const authController = require("../controllers/authController")
const userController = require("../controllers/userController")
const handleAsync = require("../utils/handleAsync")

const userRouter = require("express").Router()

/*
    Common:
    - login 
    - register
*/
userRouter.post("/login", handleAsync(authController.login))
userRouter.post("/register", handleAsync(authController.register))
userRouter.get("/details/me", authorizeRole(['admin', 'customer', 'delivery']),  handleAsync(authController.getdetails))

/*
    Admin: 
    - Add products
    - view all orders
    - view all delivery partners
    - view live status
*/
// 
userRouter.post("/product/add", isAdmin, handleAsync(userController.addproducts))
userRouter.get("/orders/get", isAdmin, handleAsync(userController.fetchallOrders))
userRouter.get("/deliverypartners/get", isAdmin, handleAsync(userController.fetchallDeliveryPartners))

/*
    Customer:
    - place order
    - fetch all prev. orders
    - track order
    - view product catalog
*/
// 
userRouter.post("/order/create", isCustomer, handleAsync(userController.createOrder))
userRouter.get("/order/get/all", isCustomer, handleAsync(userController.fetchPrevOrders))
userRouter.get("/order/track/:id", isCustomer, handleAsync(userController.trackOrder))
userRouter.get("/product/catalogue", handleAsync(userController.viewProductCatalogue))

/*
    Deliveyr Partner:
    - accept/update order
    - get all orders ::: only show the ones without any assigny
    - 
*/
userRouter.put("/order/accept/:id", isDelivery, handleAsync(userController.acceptOrder))
userRouter.put("/order/update/status/:id", isDelivery, handleAsync(userController.updateOrderStatus))
userRouter.get("/order/getall", isDelivery, handleAsync(userController.fetchallUnassignOrders))


module.exports = userRouter