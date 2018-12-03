const router = require("koa-router")();
const Controller = require("../controller");
module.exports = (app: any) => {
  app.use(router.routes());
  router.get("/getShortInfo", Controller.getShortInfo);
};
