import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { tarefas } from '../db/schemas/tarefas.js'

export async function listar() {
  return db.select().from(tarefas)
}

export async function criar(dados) {
  const [nova] = await db.insert(tarefas).values(dados).returning()
  return nova
}

export async function atualizar(id, dados) {
  const [atualizada] = await db
    .update(tarefas)
    .set(dados)
    .where(eq(tarefas.id, id))
    .returning()
  return atualizada
}

export async function excluir(id) {
  const [removida] = await db
    .delete(tarefas)
    .where(eq(tarefas.id, id))
    .returning()
  return removida
}