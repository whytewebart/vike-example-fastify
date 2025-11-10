import type { FastifyInstance } from "fastify";
import { usersTable } from "../schema/users.ts";
import { eq } from "drizzle-orm";

// DEFINE PAYLOAD
const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
};

const add = async (fastify: FastifyInstance, opts: any) => {
    const db = fastify.db;
    // INSERT DATA
    await db.insert(usersTable).values(user);
    console.log('New user created!');   
}

const select = async (fastify: FastifyInstance, opts: any) => {
    const db = fastify.db;
    const users = await db.select().from(usersTable);
    console.log('Getting all users from the database: ')
    fastify.log.info(users)
}

const update = async (fastify: FastifyInstance, opts: any) => {
    const db = fastify.db;
    
    await db
        .update(usersTable)
        .set({ age: 31 })
        .where(eq(usersTable.email, user.email));
        
    console.log('User info updated!')
    await db.delete(usersTable).where(eq(usersTable.email, user.email));
    console.log('User deleted!')
}

const execute = async (fastify: FastifyInstance, opts: any) => {
    await add(fastify, opts);
    await select(fastify, opts);
    await update(fastify, opts);
}

export default {
    add,
    select,
    update,
    execute
}