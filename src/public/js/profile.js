const form = document.getElementById('crearProd')

form.addEventListener('submit', async e => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    const response = await fetch('/api/products', {
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

const formu = document.getElementById('eliminarProd')

formu.addEventListener('submit', async e => {
    e.preventDefault()
    const data = new FormData(formu)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    const response = await fetch('/api/products/', {
        method: 'DELETE',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": 'application/json'
        }
    })
    const result = await response.json()
    console.log(result)
}
)