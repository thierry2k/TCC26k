import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { usuarios } from '../db/schemas/usuarios.js'

const router = Router()

function senhaValida(senha) {
  // mínimo 8 caracteres, 1 maiúscula, 1 número e 1 símbolo
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
  return regex.test(senha)
}

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cadastra um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: E-mail já cadastrado
 */
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' })
    }

    if (!senhaValida(senha)) {
      return res.status(400).json({
        erro: 'A senha precisa ter 8+ caracteres, uma maiúscula, um número e um símbolo.'
      })
    }

    const existente = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))

    if (existente.length > 0) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const [novo] = await db
      .insert(usuarios)
      .values({ nome, email, senha: senhaHash })
      .returning({ id: usuarios.id, nome: usuarios.nome, email: usuarios.email })

    res.status(201).json(novo)
  } catch (erro) {
    console.error(erro)
    res.status(500).json({ erro: 'Erro interno no servidor.' })
  }
})

export default router