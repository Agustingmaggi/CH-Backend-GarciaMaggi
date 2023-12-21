const form = document.getElementById('comprar')
form.addEventListener('submit', async e => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    const response = await fetch('/api/cart/purchase', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": 'application/json'
        }
    })
    const result = await response.json()
    console.log(result)
}
)