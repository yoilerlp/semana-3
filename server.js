/*en caso de  hacer uso con el directorio controlador se 
debe importar como se observa en la siguiente linea, con el nombre del archivo js
que contiene la logica */
//const controller = require('./controller/nombredelcontrollador.js');
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./models");
const user = require("./models/user");
const secretConfig = require("./secret/config");

const app = express();
const bodyParser = require("body-parser");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API ENDPOINTS
/*se debe contar un una ruta por medio de método post para el inicio de sesión de la siguiente manera:
'/api/auth/signin'
*/
app.get("/", async function (req, res) {
  console.log(db.user.name);

  console.log(db.user.tableName);
  res.sendStatus(200).send("todo bien");
});

app.post("/api/auth/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.user.findOne({
    where: {
      email: email,
    },
  });

  if (user !== null) {
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (isValidPassword) {
      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        secretConfig.secret,
        {
          expiresIn: "24h",
        }
      );

      res.status(200).json({ accessToken });
    } else {
      res.status(401).send({
        auth: false,
        accessToken: null,
        reason: "Invalid Password!",
      });
    }
  } else {
    res.status(404).send("User Not Found.");
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});

module.exports = app;
