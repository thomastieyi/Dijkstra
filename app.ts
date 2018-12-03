let Koa = require("koa2");
const router = require("./router");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");
let router1 = require("./router");
const app = new Koa();

app.use(
  cors({
    origin: "*",
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"]
  })
);

app.use(
  bodyParser({
    enableTypes: ["json", "form", "text"],
    formLimit: "30mb",
    queryString: {
      parameterLimit: 1000000000000000000
    }
  })
);
router1(app);

app.listen(8087, () => {
  console.log("server is running at https://localhost:8087");
});
