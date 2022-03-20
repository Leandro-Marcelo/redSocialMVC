const mysql = require("mysql2");
/* También podrías traerte config y luego colocar config.dbHost, config.Port etc etc */
const { dbName, dbPort, dbUser, dbPassword, dbHost } = require(".");

const connection = mysql.createConnection({
  host: dbHost,
  port: dbPort,
  user: dbUser, // 'root'
  password: dbPassword,
  database: dbName,
});

// Encapsulando con promesas:
function query(sql, data) {
  return new Promise((resolve, reject) => {
    connection.query(sql, data, function (error, result) {
      //Error first callback
      if (error) {
        /* segun tzuzul el 1062 siempre es el err.duplicateEntry */
        if (error.errno === 1062) {
          /* console.log(error.sqlMessage) Duplicate entry 'leandrokadoa' for key 'users.userName_UNIQUE'; */
          const errorData = error.sqlMessage.split("'");
          const value = errorData[1];
          const field = errorData[3].split(".")[1].split("_")[0];
          /* no sé porque me imprime userName y no username cuando ya lo cambié en la DB */
          const message = `El ${field} '${value}' ya esta en uso`;
          reject(message);
        }
        reject(error.sqlMessage);
      } else {
        resolve(result);
      }
    });
  });
}

/* En la documentación de npm mysql2 podemos ver que devuelve cada consulta (al final creo que no dice segun la busqueda de tzuzul, pero en muchas dicen), por si no quieres hacer un console.log  */
async function insert(tableName, data) {
  try {
    const result = await query(`INSERT INTO ${tableName}(??) VALUES(?)`, [
      Object.keys(data),
      Object.values(data),
    ]);
    /* esto imprimiria ResultSetHeader{fieldCount:0, affectedRows:1, insertId:54, info:"", serverStatus:2, warningStatus:0} como podemos ver, podemos ver el id que le puso al usuario*/
    /* console.log(result); */
    /* devolvemos el id que le asigno al momento de crear al usuario */
    return { success: true, id: result.insertId };
  } catch (error) {
    return { error, success: false };
  }
}

//No podemos usar delete: palabra reservada
async function del(tableName, data) {
  try {
    await query(`DELETE FROM ${tableName} WHERE id=?`, [data]);
    return data;
  } catch (error) {
    return error;
  }
}

// Exportamos un objeto
module.exports = { query, insert, del };
