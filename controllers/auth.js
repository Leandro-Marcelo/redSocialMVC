const User = require("../models/User");

class AuthController {
  getLoginView(req, res) {
    /* console.log(req.session); =>  Session {
  cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }
} */
    /* este formCSS: true es para que se importe el CSS del formulario en el componente Main (conocido como el componente App en React)*/
    return res.render("login", { formCSS: true });
  }

  getSignUpView(req, res) {
    return res.render("signup", { formCSS: true });
  }

  logOut(req, res) {
    /* esto nos sirve para limpiar la sesíon del usuario y como se limpia, cuando pase por el middleware va a guardar nada por lo que no va a proveer nada xd porque estará eliminado */
    req.session.destroy();
    return res.redirect("/");
  }

  async logIn(req, res) {
    const credentials = req.body;
    const userData = await User.getByEmail(credentials.email);
    if (userData.length === 0) {
      /* como el success esta vacio, allá por tener la negación se pasa a true y muestra este errors */
      return res.render("login", {
        validation: { errors: ["Usuario no registrado"] },
      });
    }
    if (userData[0].password !== credentials.password) {
      return res.render("login", {
        validation: { errors: ["El usuario o la clave son incorrectos"] },
      });
    }

    /* el setHeader("Set-cookie","loggedIn=true") podemos agregarle fecha de expiración, etc. Basicamente, es lo mismo que hace una cookie, define un header y guarda la cookie */
    /* return res.setHeader("Set-Cookie", "loggedIn=true").redirect("/"); */
    /* Ahora utilizando el session, lo que hacemos acá es guardar la propiedad loggedIn en el session del usuario */
    req.session.loggedIn = true;
    req.session.username = userData[0].username;
    /* no se puede poner req.session.id porque al parecer express-session guarda un id de tipo objeto por lo que tira error */
    req.session.idUser = userData[0].id;
    console.log(req.session);
    return res.redirect("/");
  }

  /* este sería para el post */
  async signUp(req, res) {
    // req.body:
    // {
    //     username:"tzuzulcode",
    //     firstName:"Tzuzul",
    //     ...
    // }

    /* los datos que vienen de la petición post en formato json se le envia como data a la class User para que cree un usuario con estos datos y lo retorna, luego lo vemos por el log y nos redirecciona. Repasar POO xd */
    const newUser = new User(req.body);
    /* si imprimimos newUser ahora su date esta en formato de la DB */
    /* aca no usamos await porque no es un proceso asincrono, no va hacer una consulta a una db o hacer un fetch por lo que lo dejamos tal cual */
    /* Este validate() valida si todos los campos fueron rellenos y que la contraseña sea igual a repeated password */
    const validation = newUser.validate();
    if (validation.success) {
      const userSaved = await newUser.save();
      if (userSaved.success) {
        return res.redirect("/");
        /* este else es una validación en caso de que, haya rellenado todos los campos, por lo que paso la primera validación sin embargo, no se pudo guardar en la base de datos por err.duplicate.entry por lo que gestionamos el error y lo mostramos en la UI */
      } else {
        validation.errors = [userSaved.error];
        /* si es necesario ponerle el validation.success false porque se supone que si entro acá es porque era true */
        validation.success = false;
        /* validation = {success:false, errors:["el correo electrónico ya esta en uso"]} no se puede hacer porque definimos la variable como const */
      }
    }
    /* si hubo errores, le renderiza el signup y le pone los datos */
    /* este newUser es un objeto 
    {
      name = user.name;
    username = user.username;
    email = user.email;
    birthday = user.birthday;
    profilePic = user.profilePic;
    password = user.password;
    } */
    /* este return es para mostrar el error y rellenarle los campos */
    return res.render("signup", { validation, user: newUser });
  }
}

module.exports = AuthController;
