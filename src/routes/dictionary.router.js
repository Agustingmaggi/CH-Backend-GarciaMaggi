import { Router } from "express"

const router = Router()
router.param('word', (req, res, next, word) => {
    const isValidParam = /^[a-zA-Z]+$/.test(word)
    if (!isValidParam) return res.status({ status: "error", error: "Invalid Word" })
    req.word = word
    next()
})

router.get('/:word', async (req, res) => {
    res.send({ satus: 'success', payload: req.word })
})

router.get('*', (req, res) => {
    res.status(400).send({ status: "error", error: "Invalid Word, mira la ruta!" })
})

export default router