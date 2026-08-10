import 'dotenv/config';
import mysql from 'mysql2/promise';

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "EXISTE" : "NO EXISTE");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),

    connectTimeout: 10000,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

export default pool;