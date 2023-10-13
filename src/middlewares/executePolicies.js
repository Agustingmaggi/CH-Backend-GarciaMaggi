const executePolicies = (policies) => {
    return (req, res, next) => {
        if (policies[0] === "PUBLIC") return next()
        if (policies[0] === "NO_AUTH" && !req.user) return next()
        if (policies[0] === "NO_AUTH" && req.user) return res.sendUnauthorized("Already logged in")
        if (policies[0] === 'AUTH' && req.user) return next()
        if (policies[0] === "AUTH" && !req.user) return res.sendUnauthorized('Not logged in')
        if (!policies.includes(req.user.role.toUpperCase())) {
            return res.sendForbidden("No puedes tener acceso aqui")
        }
        next()
    }
}

export default executePolicies