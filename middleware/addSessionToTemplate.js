function addSessionToTemplate(req, res, next) {
  /* los locals son como un provider de React, es decir, definimos la data que queramos en los local y como este middleware va a ser global porque estará en el archivo server.js En todos lados estará disponible esta data y para acceder a esta data tengo que poner session.loggedIn ó session.username*/
  res.locals.session = req.session;
  next();
}

module.exports = addSessionToTemplate;
