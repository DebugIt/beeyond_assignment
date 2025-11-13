const { fetch } = require("@/fetch");

const handleLogin = (body) => {
    return fetch({
        method: "POST",
        url: `/user/login`,
        data: body
    })
}

const handleRegister = (body) => {
    return fetch({
        method: "POST",
        url: `/user/register`,
        data: body
    })
}

const getdetails = () => {
    return fetch ({
        method: "GET",
        url: `/user/details/me`
    })
}

export { handleLogin, handleRegister, getdetails }