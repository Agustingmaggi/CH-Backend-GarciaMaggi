async function addProduct(id) {
    const cart = getCookie('cart')
    const product = {
        pid: id
    }
    if (cart) {
        const response = await fetch(`api/cart/products`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })
        const result = await response.json()
        console.log(result)
    } else {
        const response = await fetch(`api/cart/products`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
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
    console.log('boton de logout clickeado')
    const authCookieValue = getCookie('authCookie');
    console.log(authCookieValue)
    event.preventDefault()
    document.cookie = 'authCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = '/login'
})