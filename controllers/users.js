const User = require("../models/User");
/* acá como no estamos usando un ORM como mongoose, tenemos que llamar al models y crear una instancia de ese modelo para recién poder usar sus métodos estaticos cosa que en mongoose simplemente lo importas e inmediatamente podes usar sus métodos ya definidos */
/* esto lo comentamos porque ahora readAll es static
const userModel = new User(); */

/* Podemos llamarlo UserController ó simplemente User.
en la arquitectura orientada a servicios le pondría Users y allá arriba le pondría
const UserModel = require(".......") pero no haría userModel new User()
 */
class UserController {
  // async readAll(){
  //     const users = await query("SELECT * FROM users")
  //     return users
  // }
  /* xd */
  async getUsersView(req, res) {
    let resData;
    /* este if nos sirve para filtrar al usuario de user y ademas de filtrar a los que le hemos enviado solicitud (PERO NO HEMOS FILTRADO LAS SOLICITUDES QUE RECIBIMOS, faltaría agregar eso) */
    if (req.session.loggedIn) {
      const { people, peopleWithFriendRequest } = await User.iCanAddIt(
        req.session.idUser
      );
      resData = {
        people,
        hasPeople: people.length > 0,
        peopleWithFriendRequest,
        hasPeopleWithFriendRequest: peopleWithFriendRequest.length > 0,
      };
    } else {
      const users = await User.readAll();
      resData = {
        people: users,
        hasPeople: users.length > 0,
        hasPeopleWithFriendRequest: false,
      };
    }

    if (req.session.loggedIn) {
      const friendRequests = await User.getFriendRequest(req.session.idUser);
      /*  gi(friendRequests); */
      resData.friendRequests = friendRequests;
      resData.hasFriendRequests = friendRequests.length > 0;
    }
    /* if (req.session.loggedIn) {
      // al renderizar el home y pasarles estas propiedades, también tendrán acceso los componentes como el footer y navbar
      return res.render("home", {
        users,
        hasUsers: users.length > 0,
        username: req.session.username,
        // nos va a servir para cambiarle el nombre de log in del navbar a logout
        loggedIn: true,
      });
    } */
    return res.render("home", resData);
  }

  async addFriend(req, res) {
    const idFriend = req.params.idFriend;

    await User.addFriend(req.session.idUser, idFriend);

    res.redirect("/");
  }

  /* el idFriend1 es quien envio y el idFriend2 es quien recibio la wea, pero tambien el que va a aceptar */
  async acceptFriend(req, res) {
    const sender = req.params.idFriend;

    /* me es req.session.idUser */
    await User.acceptFriend(sender, req.session.idUser);

    res.redirect("/");
  }

  /* SEARCH */
  async search(req, res) {
    const { search } = req.query;
    /* console.log(search); */
    let user = await User.likeName("users", search);
    /*  console.log(user); */
    return user;
  }

  /* LIKE  */

  /*  async like(req, res) {
    const { id } = req.params;
    //le envio el id del post que quiero likear/deslikear y mi id
    const response = await postsService.likeDisLike(id, req.body);
    return res.status(200).json(response);
  } */
}

module.exports = UserController;

/* 
const {query} = require("../config/database")

async function getUsers(req, res){
  const del = await query("DELETE FROM users")
  const users  = await query("SELECT * FROM users")
  return res.render("home", {
    username:"tzuzulcode",
    users,
    hasUsers:users.length > 0
  })
}

module.export = {getUsers}

 y en el router simplemente utilizan getUsers

 CONCLUSIÓN: EN EL ROUTER ESTA CORRECTO, sin embargo, acá en el controllers no esta correcto aparte de devolver render y todo, debería de dividir la funcionalidad a lo mejor quiero leer esos usuarios en alguna otra función o en alguna otra parte de la app, entonces no debería tener esta funcionalidad:    const del = await query("DELETE FROM users")
  const users  = await query("SELECT * FROM users")
 
 anidada junto con un render, tendría que dividir de mejor forma eso. Entonces que se sugiere en los controllers? en los controllers se suguiere que nosotros creemos una clase pero acá vamos a implementar algunas funcionalidades extras 

*/
