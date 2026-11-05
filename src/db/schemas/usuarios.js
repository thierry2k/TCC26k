import { pgTable, timestamp , uuid } from "drizzle-orm/pg-core";
import { SingleStoreChar } from "drizzle-orm/singlestore-core";
import { varchar } from "drizzle-orm/pg-core";

export const usuarios = pgTable('usuarios', {
    id: uuid('id' , {legth: 100}).primaryKey().defaultRandom(), 
    nome: varchar('nome', { length: 100 }).notNull(),
    email: varchar('email', {length :250 }).notNull(),
    senha: varchar('senha', {length : 50}).notNull(),

})








// '