import { timestamp } from "drizzle-orm/gel-core";
import { varchar } from "drizzle-orm/mysql-core";
import { pgTable } from "drizzle-orm/pg-core";
import { SingleStoreChar } from "drizzle-orm/singlestore-core";


export const usuarios = pgTable('usuarios', {
    nome: varchar('nome', { length: 100 }).notNull(),
    email: varchar('email', {length :250 }).notNull(),
    senha: varchar('senha', {length : 50}).notNull(),

})

export const tarefas = pgTable('tarefas',{
    id: varchar('id' , {legth: 100}).notNull(),
    titulo: text('titulo',).notNull(),
    prazo: timestamp('prazo',),
    prioridade: varchar('prioridade', { length: 10 }).default('media'),
    
})








// '