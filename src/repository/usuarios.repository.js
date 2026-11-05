import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { usuarios } from '../db/schemas/usuarios.js'

export async function buscarPorEmail(email) {
  const [usuario] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, email))
  return usuario
}

export async function criar(dados) {
  const [novo] = await db
    .insert(usuarios)
    .values(dados)
    .returning({ id: usuarios.id, nome: usuarios.nome, email: usuarios.email })
  return novo
}