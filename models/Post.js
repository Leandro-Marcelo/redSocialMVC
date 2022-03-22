const { query, insert } = require("../config/database");

class Post {
  /* para que era este idUser? */
  idPost;
  /* nos tirará error: Column 'idUser' cannot be null' si no le enviamos un idUser porque yo le puse en la base de datos que no fuera nulo (not null) pero también tendría que hacer una validación en el backend no? */
  constructor(post) {
    /* console.log("parametros de constreuctor", post, idUser); */
    this.description = post.description;
    this.idUser = post.idUser;
    this.date = post.date;
  }

  static async readAll() {
    return await query(
      "SELECT * FROM users JOIN posts ON users.id=posts.idUser"
    );
  }

  static async commentPost(postNumber) {
    return await query(
      "SELECT * FROM users JOIN comments ON users.id = comments.idUser WHERE comments.idPost = ?",
      [postNumber]
    );
  }

  static async likes(idPost, idUser) {
    return await query("INSERT INTO likes(idPost, idUser) VALUES(?,?)", [
      idPost,
      idUser,
    ]);
  }

  static async comment(comment, idPost, idUser) {
    return await query(
      "INSERT INTO comments(comment, idPost, idUser) VALUES(?, ?, ?)",
      [comment, idPost, idUser]
    );
  }

  static async iCanAddIt(idUser) {
    /* filtrar al user de users y luego filtrar para que solo le devuelva a las personas que no les ha enviado solicitud de amistad */
    const people = await query(
      "SELECT * FROM users WHERE id !=? and id NOT IN (SELECT users.id FROM users JOIN friendship ON users.id=friendship.idFriend2 WHERE friendship.idFriend1=?)",
      [idUser, idUser]
    );

    /* Las personas que les he enviado solicitud de amistad */
    const peopleWithFriendRequest = await query(
      "SELECT * FROM users JOIN friendship ON users.id=friendship.idFriend2 WHERE friendship.idFriend1=?",
      [idUser]
    );

    return { people, peopleWithFriendRequest };
  }

  async save() {
    const newPost = await insert("posts", {
      description: this.description,
      idUser: this.idUser,
      date: this.date,
    });
    /* le asigna el id que devuelve la db a la propiedad idPost del objeto que acabamos de instanciar de la clase Post(si tenia la reemplaza si no tenía la crea)  */
    this.idPost = newPost.id;
    return newPost;
  }

  validate() {
    let result = { success: true, errors: [] };
    if (!this.description) {
      result.success = false;
      result.errors.push("Rellena todos los campos");
    }
    return result;
  }

  /* un search para el post  xd */
  /*   static async likeName(tableName, input) {
    const result = await query(
      `SELECT * FROM ${tableName} WHERE username LIKE "%${input}%"`
    );
    return result;
  } */
}

module.exports = Post;
