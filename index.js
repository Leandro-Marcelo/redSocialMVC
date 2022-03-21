/* TZUZUL SABE BOOSTRAP, TAILWIND Y BULMA */

/* Cabe mencionar que muchas veces verán variaciones de este MVC o de esta arquitectura, por ejemplo, verán que en el controllers como ya se utiliza un ORM pues no se define un modelo y el ORM ya nos da toda la funcionalidad y todo, entonces ahí directamente se añade la información. Verán variaciones donde se hacen estas funcionalidades de readAll() en el controllers y nada mas en modelos se ocupan para validaciones que es otra cosa que se podría agregar. En las rutas lo mas recomendado es que lo dejen así, es decir, que se llame al controlador, se ejecute el controlador y listo, que no hagan ahí otro proceso, validen datos ni nada ya en el controlador es donde debería hacerse todo ello ya para el controlador hay diferentes versiones dependiendo cada empresa o problema */

const express = require("express");
const path = require("path");
/* Aquí lo mismo podría traerse config y usar config.Port pero bueno, en backend fundamentals utiliza {} */
/* aqui pondrías pensar de que deberia ser require("./config/index") pero por defecto JS agarra el index*/
const { port, secret } = require("./config");
console.log(port);
const { engine } = require("express-handlebars");
/* Instalo esta librería  */
const { DateTime, Interval } = require("luxon");
/* lo que hace es definir una cookie en el navegador y lo guarda en la req para que cuando se envie una petición, el servidor reciba esta cookie y compare el identificador que tenga con el que tiene en el session storage.  Digamos que este session es como un session storage pero creada por el servidor y manipulada por este mismo. OJO ALGO IMPORTANTE A SABER es que si se reinicia el servidor, todas las sessiones se pierden, es decir, para este caso se eliminaría este loggedIn = true que guardamos en el session. (Se podría ver como, el session storage se pierde si cerramos / reiniciamos el navegador o sea lo cerramos y abrimos. Y como este session es como un session storage del backend pasaría lo mismo, si se cierra el servidor o reiniciamos se pierde el session incluyendo su contenido xd OBVIO)*/
const session = require("express-session");

//Importando rutas
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const addSessionToTemplate = require("./middleware/addSessionToTemplate");

// engine.registerHelper("formatDate",(date)=>{
//     return DateTime.fromISO(date)
// })

const app = express();

app.use(express.static(path.join(__dirname, "static")));

//Middleware
app.use(express.urlencoded({ extended: true })); // Transforma de x-www-form-urlencoded a Object de JS`
/* utilizamos el middleware de la session para validar la sesión que tienen los usuarios, si queremos que la sesión sea secreta, es decir, que tenga algo de encriptación le agregamos la propiedad secret (la cual definimos en nuestras variables de entorno)*/
app.use(
  /* generalmente siempre lo pondrán así. Un secret, resave:false, saveUninitialized:false para express session */
  session({
    /* digamos que añade una forma para decifrar la información que se esta guardando en la sesión, recuerda que esa sesión se guarda en el servidor, digamos que es como para que solamente yo tenga acceso a la información que esta ahí */
    secret: secret,
    /* guardan las sesiones que no estan modificadas de regreso al store. Basicamente es como decirle cada vez que se reciba una petición que la vuelva a guardar en el store, pues eso puede causar problemas de rendimiento, por eso lo ponemos en false. Al indicarlo como false, solamente cuando algo en la sesión cambió, que vuelva a guardar esa sesión  */
    resave: false,
    /* Va muy relacionado con el punto anterior, esto dice que solo vamos a guardar la información que sea inisializado, esta opción nos asegura que si no se a inisializado una sesión que no se guarde. (si no se ha logeado o registrado, que no se guarde nada en el store) */
    saveUninitialized: false,
  })
);
/* AQUÍ ES IMPORTANTE EL ORDEN, si nosotros utilizamos este middleware addSession.... antes del middleware session, no tendría los datos de la sesión y no funcionaría. Por eso tiene que hacerse despues */
/* si la ejecutamos tira error, si abrimos parentesis es para pasarle una función que retorna algo, aunque si algo tira error siempre podes probar sin ejecutarla */
app.use(addSessionToTemplate);

/* otra forma de configurarlo
const { handlebars } = require("express-handlebars");

 const hbs = handlebars.create({
    defaultLayout:null,
    extname:"hbs",
    // layoutsDir:"templates"
    helpers:{
        formatDate:function(date){
            const newDate = new DateTime(date)
            return newDate.toFormat("yyyy-MM-dd")
        }
    }
})

app.engine("hbs", hbs.engine)

con eso ya configurariamos todo (es la forma de bluuweb pero con otros nombres xd) esta forma es buena si queremos usar hbs en otro lugar,  con otras de las propiedades que ya tiene disponibles también podemos hacerlo

*/

/* si lo dejamos como app.engine("hbs", engine()) usará la configuración por defecto que sería .handlebars en cada archivo de home, footer, header, etc. En este caso lo estamos configurando */
app.engine(
  "hbs",
  engine({
    /* aquí le estamos diciendo que no use el defaultLayout, sin embargo, si le quitamos esta propiedad utilizará el layout por defecto el main.handlebars en nuestro caso main.hbs */
    /* defaultLayout: null, */
    extname: "hbs",
    /* si en vez de utilizar la carpeta layouts quisiera utilizar otra por defecto, pongo la configuración de abajo. Podría ser layoutsDir: app.hbs      como si fuera React */
    // layoutsDir:"templates"
    /* acá estamos diciendo que use componentes pero en la estructura clasica se le conoce como partials y se almacenan en una carpeta llamada includes que son elementos que podemos incluir como componentes. Otra cosa que tambien se realiza mucho en las vistas es poner el home y login dentro de una carpeta llamada pages. Si vieramos una estructua de handlebars sería views que dentro tiene carpeta pages luego una carpeta partials que dentro tendría los layouts y los includes  */
    partialsDir: path.join(__dirname, "views", "components"),
    /* Acá podríamos formatear la fecha como lo habíamos hecho ó utilizar una librería que es muy popular que se llama:  */
    /* este helper podría mandarse como props a los componentes sin embargo, acá lo estamos haciendo global */
    helpers: {
      formatDate: function (date) {
        /* como este parametro date no lo reconoce el DateTime pone a todos con la fecha de hoy  const newDate = new DateTime(date); La forma correcta de hacerlo sería */
        const newDate = DateTime.fromJSDate(date);
        return newDate.toFormat("yyyy-MM-dd");
      },
      formatHour: function (date) {
        /* como este parametro date no lo reconoce el DateTime pone a todos con la fecha de hoy  const newDate = new DateTime(date); La forma correcta de hacerlo sería */
        /* const newDate = DateTime.fromJSDate(date);
        return newDate.toFormat("HH:mm"); */
        /* queremos sacar el tiempo que ha pasado desde que se creo el usuario */
        const newDate = DateTime.fromJSDate(date);
        /* lo transforma en objeto, para trabajarlo de mejor manera */
        const diff = newDate.diffNow(["minutes", "hours", "days"]).toObject();
        if (diff.days < 0) {
          return `Hace ${-1 * diff.days} días`;
        } else if (diff.hours < 0) {
          return `Hace ${-1 * diff.hours} horas`;
        } else if (diff.minutes < 0) {
          return `Hace ${Number.parseInt(-1 * diff.minutes)} minutos`;
        }
      },
      toBoolean: function (number) {
        /* no ponemos tres igual por si nos devuelve un 1 en formato String */
        return number == 1;
        /* eso que esta arriba es mejor que number == 1 ? true : false, su lógica esta a otro nivel */
      },
    },
  })
);

app.set("view engine", "hbs");
app.set("views", "views");

/* Bluuweb 
const { create } = require("express-handlebars");
  Tzuzul
const {engine} = require("express-handlebars")

  Bluuweb (crea una constante hbs para las configuraciones y luego las utiliza abajo)
const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"],
});

  Aquí Bluuweb utiliza las configuracionesn haciendo referencia a la constante hbs como hbs.engine
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

Tzuzul hace todo en la misma linea
app.engine(
  "hbs",
  engine({
    defaultLayout: null,
    extname: "hbs",
    // layoutsDir:"templates"
    helpers: {
      formatDate: function (date) {
        const newDate = new DateTime(date);
        return newDate.toFormat("yyyy-MM-dd");
      },
    },
  })
);
*/

/* Ahora este route esta en routes/users */
/* app.get("/", async (req, res) => {
  // const del = await query("DELETE FROM users"); 
  const users = await query("SELECT * FROM users");
  console.log(users);
  console.log(users.length > 0);
  return res.render("home", {
    username: "tzuzulcode",
    users,
    hasUsers: users.length > 0,
    // este helpers podemos mandarlo como props aunque podemos hacerlo global como esta arriba
    //helpers: {
    //formatDate: function (date) {
    // const newDate = new DateTime(date);
    //return newDate.toFormat("yyyy-MM-dd");
    //  },
    //},
  });
}); */

app.use(userRouter);
app.use(authRouter);

/* la razon de usar .env es que al momento de hacer deploy, el mismo heroku, netlify nos va a tirar un host y la idea es que nosotros lo tomemos y lo utilicemos. Es decir, que sea dinamico y no estatico igual para la configuración de la DB (porque asi son mas seguras de guardarlas y sobre todo si luego compartimos nuestro proyecto esos detalles de la configuración se cambiaría muy facilmente desde el archivo .env, entonces normalmente nosotros lo hacemos en las variables de entorno tambien porque son privadas para tener acceso a las variables de entorno tendríamos que tener acceso a la computadora real física donde esta definido o conectarnos desde ssh o algo así y para eso necesitamos código de encriptación, inclusive podemos tener variables de entorno encriptadas ). Digamos que desplegamos la aplicación en un servicio en la nube que ya nos dio un puerto y ahora para utilizarlo tenemos que llamarlo de las variables de entorno que sería tipo así: process.env.PORT de hecho esto hacemos para desployear en heroku*/
/* para esteblecer una variable de entorno en nuestro local pc hacemos export PORT=3500 y luego lo utilizamos con process.env.PORT lo que sucede es que esto no es práctico por eso trabajamos con una librería llamado dotenv que directamente nos carga todas las variables del entorno que definimos en un archivo */
app.listen(port, function () {
  console.log("Funcionando... http://localhost:" + port);
});
