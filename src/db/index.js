import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as usuariosSchema from './schemas/usuarios.js'
import * as tarefasSchema from './schemas/tarefas.js'

// procura o .env na raiz do projeto, não importa de qual pasta o servidor foi iniciado
config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não encontrada. Confira o arquivo .env na raiz do projeto.')
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, { schema: { ...usuariosSchema, ...tarefasSchema } })