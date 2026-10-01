import {drizzle} from 'drizzle-orm/neon-http'
import {neon} from '@neondatabase/serverless'
import 'dotenv/config'


const sql = drizzle(process.env.DATABASE_URL);
export const db = drizzle (sql)

