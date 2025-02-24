import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        host: 'db.cvsolymnpaopcgtoxgke.supabase.co',
        port: 5432,
        user: 'postgres',     // Replace with your username
        password: '#vx9YqW5JmCxqpz', // Replace with your password
        database: 'postgres', // Replace with your database name
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    })
})