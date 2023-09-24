import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    // Ruta a tus certificados
    ca: '/ruta/a/ca-cert.pem',
    key: '/ruta/a/client-key.pem',
    cert: '/ruta/a/client-cert.pem'
  }
});

export async function query(queryString, values = null) {
  const [rows] = await pool.execute(queryString, values);
  return rows;
}
