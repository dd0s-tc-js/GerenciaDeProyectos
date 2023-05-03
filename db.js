const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tu-contraseña',
  database: 'proyecto_bancario',
});

module.exports = connection;