const express = require("express");
const AuthController = require("../controllers/auth");

const router = express.Router();
const authController = new AuthController();

/* si usaramos la arquitectura handlebars sería views que dentro tiene carpeta pages luego una carpeta partials que dentro tendría los layouts y los includes y acá al momento de hacer render sería render("pages/login", {........}) */
/* router.get("/login", (req, res) => {
  return res.render("login", { formCSS: true });
}); */

router.get("/login", authController.getLoginView);
router.post("/login", authController.logIn);
router.get("/signup", authController.getSignUpView);
router.post("/signup", authController.signUp);
router.get("/logout", authController.logOut);

module.exports = router;
