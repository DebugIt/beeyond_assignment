const { fetch } = require("@/fetch");

// customer

const getProducts = (body) => {
    return fetch({
        method: "GET",
        url: `/user/product/catalogue?limit=${body.limit}&page=${body.page}&id=${body.id || ''}&search=${body.search || ''}`
    })
}

const placeorder = (items) => {
    return fetch({
        method: "POST",
        url: `/user/order/create`,
        data: items
    })
}

const getallOrders = (body) => {
    return fetch({
        method: "GET",
        url: `/user/order/get/all?limit=${body.limit}&page=${body.page}&id=${body.id || ''}`
    })
}

const trackOrder = (id) => {
    return fetch({
        method: "GET",
        url: `/user/order/track/${id}`
    })
}

// admin
const getallAdminOrders = (body) => {
    return fetch({
        method: "GET",
        url: `/user/orders/get?limit=${body.limit}&page=${body.page}&id=${body.id || ''}&status=${body.status || ''}`
    })
}

const AdminAddProduct = (body) => {
    return fetch({
        method: "POST",
        url: `/user/product/add/`,
        data: body
    })
}

const getallDeliveryPartners = (body) => {
    return fetch({
        method: "GET",
        url: `/user/deliverypartners/get?limit=${body.limit}&page=${body.page}&id=${body.id || ''}&search=${body.search || ''}`
    })
}

// delivery
const getallDeliveryOrders = (body) => {
    return fetch({
        method: "GET",
        url: `/user/order/getall?limit=${body.limit}&page=${body.page}&id=${body.id || ''}&status=${body.status || ''}&assigny=${body.assigny}`
    })
}

const acceptOrder = (body) => {
    return fetch({
        method: "PUT",
        url: `/user/order/accept/${body}`
    })
}

const updatestatus = (body) => {
    return fetch({
        method: "PUT",
        url: `/user/order/update/status/${body.id}`,
        data: body.data
    })
}

export { getProducts, placeorder, getallOrders, trackOrder, getallAdminOrders, AdminAddProduct, getallDeliveryPartners, getallDeliveryOrders, acceptOrder, updatestatus }