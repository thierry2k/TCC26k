import { Router } from 'express'
import { db } from '../db/index.js'
import { tarefas } from '../db/schemas/tarefas.js'

const router = Router()

/**
 * @swagger
 * /tarefas:
 *   get:
 *     summary: Lista todas as tarefas
 *     responses:
 *       200:
 *         description: Lista de tarefas
 */
router.get('/', async (req, res) => {
  const lista = await db.select().from(tarefas)
  res.json(lista)
})

/**
 * @swagger
 * /tarefas:
 *   post:
 *     summary: Cria uma tarefa
 */
router.post('/', async (req, res) => {
  const { titulo, descricao, prazo, prioridade, categoria, usuarioId } = req.body
  const [nova] = await db
    .insert(tarefas)
    .values({ titulo, descricao, prazo, prioridade, categoria, usuarioId })
    .returning()
  res.status(201).json(nova)
})

export default router