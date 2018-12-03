const router = require("koa-router")();
const Controller = require("../controller");
module.exports = (app) => {
    app.use(router.routes());
    router.get("/getShortInfo", Controller.getShortInfo);
};
//# sourceMappingURL=index.js.map