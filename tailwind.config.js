/* npx tailwindcss -i ./static/css/tailwindBase.css -o ./static/css/styles.css --watch este --watch es para que si hacemos algun cambio en un archivo de hbs que configuramos así en tailwind config que se actualice o se refresque y que compile el css necesario para agregar ese colorsito que le pusiste */
module.exports = {
  content: ["./views/**/*.hbs"],
  theme: {
    extend: {},
  },
  plugins: [],
};
