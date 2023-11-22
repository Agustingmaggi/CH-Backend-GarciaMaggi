const form = document.getElementById('loginForm')

form.addEventListener('submit', async e => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    const response = await fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": 'application/json'
        }
    })
    const result = await response.json()
    console.log(result)
    if (response.status === 200) {
        window.location.replace('/')
    }
})

async function restorePassword() {
    Swal.fire({
        text: 'ingresa tu correo electronico y te enviamos un mail de restauracion',
        input: 'text',
        inputValidator: value => {
            return !value && "Es necesario un correo"
        }
    }).then(async result => {
        try {
            if (result.value) {
                const email = result.value
                const response = await fetch('/api/sessions/password', {
                    method: 'POST',
                    body: JSON.stringify({ email }),
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                Swal.fire({
                    status: 'success',
                    text: 'Si el usuario esta en nuestra base de datos, enviaremos un correo electronico con el link de restablecimiento'
                })
            }
        } catch (error) {
            console.log(error)
        }
    })
}
