const express = require("express");
const UserController = require("../controllers/users");

const router = express.Router();

const userController = new UserController();

/* (Esto dependerá de si usamos modelo o no, si utilizamos un modelo y leemos la informacíon desde ahí, si funcionaría. Ahora si nosotros utilizamos en el mismo controlador las consultas a la DB y todo y luego lo unimos en otras elementos que son las vistas o que nos devuelven ya las vistas y hacen todas las demas decisiones y utilizamos this, aquí no funcionaría o sea en las routes. Conclusión si la definimos con un modelo funciona como esta puesta ahora, si no usamos un modelo tendríamos que utilizar bind, wrapear la función etc etc)
Controllers: 
async readAll(){
        return await query("SELECT * FROM users")
}

async getUsersView(req, res) {
    const data = await this.readAll();
    return res.render("home", {
      username: "tzuzulcode",
      data,
      hasUsers: data.length > 0,
    });
  }
No funciona, porque lo que hace esto es traerse la función getUsersView y ejecutarla acá, el problema es que en este scope no existe un this porque no estamos dentro de una clase entonces nos lanza error

routes: router.get("/", userController.getUsersView); 

una posible solución sería, aunque existe otra aquí abajo aplicando mas lógica de JS abstracta

Segun mi JS diría que ejecuta la función allá y acá simplemente devuelve un req y res xd, ademas de que acá ya no utilizamos await porque no necesitamos que se resuelva nada. Aquí toma el scope correctamente porque aquí ya estamos dentro del scope de una función dentro de ese scope de la función yo puedo hacer referencia al scope de la función original  esto es lo que se conoce como un wraper (buscalo como wrap) de la función para que tenga su scope originalmente que tenía esa función. Aquí lo que hacemos es ejecutarla directamente, ejecuto la función original.
routes: router.get("/", (req, res)=> {
  userController.getUsersView(req, res)
}); 

*/
/* Acá no ponemos parentesis en getUsersView() porque tendríamos que pasar req, res .... y pues no xd */
router.get("/", userController.getUsersView);
router.get("/addFriend/:idFriend", userController.addFriend);

/* Segunda posible solución 
lo que hace un bind es añadir o hacer que el this tome el valor de userController, entonces esa instrucción de bind(userController) le dice que el this ya no va a ser el this de este scope sino el this específico del userController 
router.get("/",userController.getUsersView.bind(userController))

Tercera posible solucíon
este es muy similar a la primera solución, pasa los argumentos que se reciben en la función que en este caso sería req y res tanto para el callback como para la siguiente función xd. Spread operator xd
 router.get("/",(...args)=>userController.getUsersView(...args))

*/

module.exports = router;
