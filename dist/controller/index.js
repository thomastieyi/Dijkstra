let mongodb = require("../dbHelper");
let toTrans = require("../toTrans");
let gettokens = require("../oss.sts.serve");
let getwords = require("../ocr.kdxf.service");
let dataUtil = require("../dataUtil");
module.exports = {
    getShortInfo: async (ctx) => {
        let source = ctx.request.query.s;
        let target = ctx.request.query.t;
        let options = dataUtil.getStationByGroup();
        let map = await dataUtil.createGraph();
        let res = await dataUtil.getShort(map, source, target);
        console.log("info", res[1][1]);
        ctx.response.body = res[1];
    }
};
//# sourceMappingURL=index.js.map