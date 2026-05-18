import { registerAs } from "@nestjs/config";
import { IDBConfig } from "../models";



export const dbConfig = registerAs("DB_CONFIG", (): IDBConfig => {
    return {
        name: process.env.DATABASE_NAME as string,
        host: process.env.DATABASE_HOST as string,
        port: Number(process.env.DATABASE_PORT as string),
        username: process.env.DATABASE_USER as string,
        password: process.env.DATABASE_PASSWORD as string,
        database: process.env.DATABASE_NAME as string,
    }
});

