import {DataSourceOptions} from "typeorm";
import {config} from "dotenv";
config()
export const connectionDB: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ['dist/database/entities/*.entity.js'],
    migrations: ['dist/database/migrations/*.js'],
    migrationsTableName: 'migrations',
    migrationsRun: true,
    synchronize: false,
}
