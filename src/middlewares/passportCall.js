import passport from "passport"

const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return next(error)
            if (!user) {
                req.user = null
                // return res.status(401).send({ status: "error", error: info.message ? info.message : info.toString() })
                //le cambie el return error por el req.user = null porque se lo hbia agregado al inicio pero si no habia usuario logeado
                //no me dejaba ver la home porque me tiraba error de autnticacion.
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export default passportCall