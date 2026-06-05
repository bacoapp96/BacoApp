import mysql from 'mysql2/promise';


const pool = mysql.createPool({
    host: 'bacoapp-db',
    user: 'root',
    password: 'root123',
    database: 'bacoapp',
});

export default pool;