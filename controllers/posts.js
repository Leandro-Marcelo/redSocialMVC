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
    const newPost = new Post(req.body);
    const validation = newPost.validate();
    if (validation.success) {
      const postSaved = await newPost.save();
      /* este else es una validación en caso de que, haya rellenado todos los campos, por lo que paso la primera validación sin embargo, no se pudo guardar en la base de datos por err.duplicate.entry por lo que gestionamos el error y lo mostramos en la UI */
      if (postSaved.success) {
        return res.redirect("/");
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
