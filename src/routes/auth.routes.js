import { Router } from 'express'
import { login } from '../controllers/auth.controller.js'

const router = Router()

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Faz login e devolve um token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login feito, token devolvido
 *       401:
 *         description: E-mail ou senha incorretos
 */
router.post('/', login)

export default router