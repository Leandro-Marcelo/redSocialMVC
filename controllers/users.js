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
    console.log(`this`, req.session);

    /* console.log(req.session.idUser); */

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
    /* console.log(req.session.idUser); */
    const { search } = req.query;
    let userSearched = await User.likeName("users", search);
    let { people, peopleWithFriendRequest } = await User.iCanAddIt(
      req.session.idUser
    );
    let resData = {
      people,
      hasPeople: people.length > 0,
      peopleWithFriendRequest,
      hasPeopleWithFriendRequest: peopleWithFriendRequest.length > 0,
      userSearched,
      hasUserSearched: userSearched.length > 0,
    };

    if (req.session.loggedIn) {
      const friendRequests = await User.getFriendRequest(req.session.idUser);
      /*  gi(friendRequests); */
      resData.friendRequests = friendRequests;
      resData.hasFriendRequests = friendRequests.length > 0;
    }
    return res.render("home", resData);
  }
}

module.exports = UserController;
