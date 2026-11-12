
import { config } from 'dotenv'
import { resolve } from 'node:path'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as usuariosSchema from './schemas/usuarios.js'
import * as tarefasSchema from './schemas/tarefas.js'

// Localiza o .env na raiz TCC26k
config({ path: resolve(process.cwd(), '../../.env') })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não encontrada. Confira o arquivo .env.')
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, {
  schema: {
    ...usuariosSchema,
    ...tarefasSchema
  }
})
