const { query, insert } = require("../config/database");

/* si bien al constructor le podemos poner todo esto
constructor(
    firstName,
    lastName,
    username,
    email,
    birthday,
    profilePic,
    idUser
  )
normalmente le pasaremos un objeto y ya sería como la forma corta de codearlo
*/
class User {
  /* aprender de propiedades privadas ES7 ES8 ya fue */
  /* ahora esta comentada porque solamente la puso privada para probar y mostrar que se puede hacer en JS */
  /* #idUser; */
  /* ahora lo dejó así supongo que significa publica y no tiene valor entonces no se la asigna abajo y empieza como undefined para luego cuando se haga la consulta a la DB se le reasigne el valor para que si en otro procedimiento requeriemos el id del usuario ya lo tendríamos */
  idUser;
  /* recordar que no tenemos firstName ni lastName en la DB tendríamos que refactorizar la tabla/collection de la DB */
  constructor(user) {
    /* para restringir los atributo de una clase, es decir, hacerlos privado tendríamos que ponerle un signo de gato al principio de la propiedad (yo recuerdo que era un _ pero era simplemente convención, como sea, el es senior xd) */
    this.name = user.name;
    this.username = user.username;
    this.email = user.email;
    this.birthday = user.birthday;
    this.profilePic = user.profilePic;
    this.password = user.password;
    /* este de acá abajo, no lo guardamos en la DB, nada mas es para validarlo */
    this.passwordRepeated = user.passwordRepeated;
    /* quizas no debería ponerle un id (porque cuando envie el req.body este no tendrá id), ya que la DB lo hará, pero tambien podemos hacerlo y luego cambiarle el valor una ves lo crea ya en la DB */
    /* this.#idUser = user.idUser; */
  }

  //En algunos casos verán que este readAll se define como estatico, justamente para no tener que crear o pasarle propiedades dentro de los parentesis => new User()    Eso acá simplemente esta implementado como método simple.
  /*   async readAll() {
    return await query("SELECT * FROM users");
  } */
  /* Recordando sobre los métodos estaticos es que no necesitan ser instanciadas para utilizar ese método. De hecho, si nos damos cuenta al momento de utilizar estos metodos en routes, importamos el model y luego instanciamos de la clase para recién utilizar los metodos el problema de esto es que estamos creando un usuario con propiedades undefined, entonces no me sirve de nada crear un user del modelo User si no estoy guardando ningun usuario entonces yo necesito que eso se retire. Ahora es static ya que le acabo de agregar static antes del sync */
  static async readAll() {
    return await query("SELECT * FROM users");
  }
  /* Hacer un filtro de los usuarios para retirarnos a nosotros */
  static async readFilteredUser(idUser) {
    return await query("SELECT * FROM users");
  }

  /* si yo al insert le paso como argumento this, le estaría pasando todas las propiedades incluyendo el passwordRepeated como los métodos, en ciertos casos funcionaria pero no es lo correcto, entonces mejor hago un objeto de lo que le quiero pasar como data a la DB*/
  async save() {
    const newUser = await insert("users", {
      name: this.name,
      email: this.email,
      username: this.username,
      birthday: this.birthday,
      profile_pic: this.profilePic,
      password: this.password,
    });
    /* le asigna el id que devuelve la db a la propiedad idUser(si tenia la reemplaza si no tenía la crea) de la instancia User  */
    this.idUser = newUser.id;
    return newUser;
  }

  static async addFriend(idFriend1, idFriend2) {
    return await query(
      "INSERT INTO friendship(idFriend1, idFriend2) VALUES(?,?)",
      [idFriend1, idFriend2]
    );
  }
  static async getFriendRequest(idUser) {
    return await query(
      "SELECT name, profile_pic,username FROM friendship JOIN users ON users.id=friendship.idFriend1 WHERE idFriend2 = ? AND status=0;",
      [idUser]
    );
  }

  async update(newUser) {
    const id = await query("UPDATE users SET ? WHERE idUser ?", [
      newUser,
      this.idUser,
    ]);
  }

  /* no estoy usando delete, pero me tira error por tener this.#idUser en el corchete xd */
  async delete() {
    await query("DELETE FROM users WHERE idUser = ?", [this.idUser]);
  }

  static async getByEmail(email) {
    const userData = await query("SELECT * FROM users WHERE email=?", [email]);
    return userData;
  }

  validate() {
    /* cuando trabajen como fullstack deben hacer validaciones tanto en frontend como en backend, de hecho si un campo es requerido y solo la validación existe en el lado del front que para mi punto de vista es el mas expuesto, podría irse a inspeccionar elementos, borrar el required y enviar los datos. Por eso necesitamos una validación también en el backend y las que hagan falta obvio. */
    let result = { success: true, errors: [] };
    if (
      !(
        this.name &&
        this.username &&
        this.email &&
        this.password &&
        this.passwordRepeated
      )
    ) {
      result.success = false;
      result.errors.push("Rellena todos los campos");
    }
    if (this.password !== this.passwordRepeated) {
      result.success = false;
      result.errors.push("Las contraseñas no coinciden");
    }
    return result;
  }
}

module.exports = User;
