let dataUtil = require("../dataUtil");
let templet = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>线路规划</title>
<script type="text/javascript" src="https://oss.cherryhuang.cn/map.js"></script>
<style type="text/css">
    #container{height:100%}
</style>
</head>
<body>
<div id="container"></div>
<script type="text/javascript">
    /**
     * 从所有城市列表中获取北京信息
     * 结果格式
     * {
     *     keyword: 'beijing',
     *     name: '北京',
     *     citycode: '131'
     * }
     */
     /* globals BMapSub */
    var subwayCityName = '北京';
    var list = BMapSub.SubwayCitiesList;
    var subwaycity = null;
    for (var i = 0; i < list.length; i++) {
        if (list[i].name === subwayCityName) {
            subwaycity = list[i];
            break;
        }
    }
    // 获取北京地铁数据-初始化地铁图
    var subway = new BMapSub.Subway('container', subwaycity.citycode);
    var zoomControl  = new BMapSub.ZoomControl({
        anchor: BMAPSUB_ANCHOR_BOTTOM_RIGHT,
        offset: new BMapSub.Size(10,100)
    });
    subway.addControl(zoomControl);
    subway.addEventListener('subwayloaded', function() {
        var drct = new BMapSub.Direction(subway);
        drct.search('####', '####');
    });
    subway.addEventListener('directioncomplete', function() {
        alert('可以自定义点击详情后的操作！');
    });
</script>
</body>
</html>`;
module.exports = {
  /**
   * @api  {get} /getShortInfo getShortInfo
   * @apiDescription getShortInfo
   * @apiGroup BeijingSUbwayInfoSystem APIs
   * @apiParam {String} s source station
   * @apiParam {String} t target station
   * @apiParam {String} m render the subway map(map for true)
   * @apiParamExample {string} login:
   *    https://subway-api.cherryhuang.cn/getShortInfo?s=五道口&t=苹果园&m=map
   *
   * @apiVersion 1.0.0
   * @apiErrorExample {json} false:
   *    [false]
   * @apiSuccessExample {json} true:
   *
   *  [25.616999999999997,"五道口-->知春路--><换乘十号线>-->知春里-->海淀黄庄--><换乘四号线>-->人民大学-->魏公村-->国家图书馆--><换乘九号线>-->白石桥南-->白堆子-->军事博物馆--><换乘一号线>-->公主坟-->万寿路-->五棵松-->玉泉路-->八宝山-->八角游乐园-->古城-->苹果园"]
   *
   * IF m == map
   * you'll get a map HTML
   *
   */
  getShortInfo: async (ctx: any) => {
    let source = ctx.request.query.s;
    let target = ctx.request.query.t;
    let mode = ctx.request.query.m;
    console.log("controller", mode);
    if (mode == "map") {
      let buf = templet.split("####");
      ctx.response.body = buf[0] + source + buf[1] + target + buf[2];
    } else {
      let options = dataUtil.getStationByGroup();
      let map = await dataUtil.createGraph();
      let res = await dataUtil.getShort(map, source, target, mode);
      console.log("info", res[1][1]);
      ctx.response.body = res[1];
    }
  }
};
