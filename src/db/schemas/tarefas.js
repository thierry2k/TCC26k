
import { pgTable, varchar,  timestamp, text, boolean, integer, uuid } from "drizzle-orm/pg-core";
import {sql } from "drizzle-orm"
import { usuarios } from './usuarios.js';

export const tarefas = pgTable('tarefas',{
    id: uuid('id' , {legth: 100}).primaryKey().defaultRandom(), 
    titulo: text('titulo',).notNull(),
    prazo: timestamp('prazo',),
    prioridade: varchar('prioridade', { length: 10 }).default('media'),
    categoria: varchar('categoria', { length: 50 }).default('Geral'),
    concluida: boolean('concluida').default(false),
    usuarioId: integer('usuario_id').references(() => usuarios.id).notNull(),
    criadoEm: timestamp('criado_em').defaultNow(),
})

