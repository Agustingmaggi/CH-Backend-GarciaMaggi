async function addProduct(id) {
    const cart = getCookie('cart')
    if (cart) {
        const response = await fetch(`api/cart/${cart}/products/${id}`, {
            method: 'PUT'
        })
        const result = await response.json()
        console.log(result)
    } else {
        const response = await fetch(`/api/cart/products/${id}`, {
            method: 'PUT'
        })
        const result = await response.json()
        console.log(result)
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
}

const logoutButton = document.getElementById('logoutButton')
logoutButton.addEventListener('click', (event) => {
    event.preventDefault()
    document.cookie = 'authCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/login'
})