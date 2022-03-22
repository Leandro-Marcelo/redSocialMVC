const Post = require("../models/Post");

class PostController {
  async getPostsView(req, res) {
    /* console.log(req.session); */
    let resData;
    const posts = await Post.readAll();
    resData = {
      posts,
      hasPosts: posts.length > 0,
    };

    return res.render("homePost", resData);
  }

  getCreatePost(req, res) {
    return res.render("createPost", { formCSS: true });
  }

  async createPost(req, res) {
    /* si bien esta forma es valida, tambien podemos agregarle el idUser de la session al req.body como otra propiedad
    const newPost = new Post(req.body, req.session.idUser); */
    req.body.idUser = req.session.idUser;

    const date = new Date();
    /* tendría que saber como es a las 12, si es que utiliza 12 o 00 con el date.toLocateString()*/
    /* Me da esto: 3/21/2022, 1:05:15 AM */
    /* Y tengo que llegar a esto: 2022-03-21T00:50 */
    /* No sé que significa la T xd */
    const fechaActual = date.toLocaleString();
    let [month, day, year] = fechaActual.split(",")[0].split("/");
    month = month < 10 ? "0" + month : month;
    const partOne = `${year}-${month}-${day}T`;
    /* no importa los seconds porque le dirá hace 0 minutos, osea que lo interpretamos como que es de ahora recien pero en un futuro puedo MEJORARLO  */
    let [hour, minutes] = fechaActual.split(",")[1].trim().split(":");
    console.log(typeof Number(hour));
    hour = Number(hour);
    hour = hour < 10 ? "0" + hour : hour;
    const partTwo = `${hour}:${minutes}`;
    const fechaParaDataBase = partOne + partTwo;
    console.log(fechaParaDataBase);
    /* 2022-03-21T01:59 */
    req.body.date = fechaParaDataBase;

    const newPost = new Post(req.body);

    const validation = newPost.validate();
    if (validation.success) {
      const postSaved = await newPost.save();
      /* este else es una validación en caso de que, haya rellenado todos los campos, por lo que paso la primera validación sin embargo, no se pudo guardar en la base de datos por err.duplicate.entry por lo que gestionamos el error y lo mostramos en la UI */
      if (postSaved.success) {
        return res.redirect("/homePost");
      } else {
        validation.errors = [postSaved.error];
        validation.success = false;
      }
    }
    /* signup */
    return res.render("createPost", { validation, post: newPost });
  }
}

module.exports = PostController;
