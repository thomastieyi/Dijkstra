let data = require("./data.json");
let nodes = data.nodes;
let links = data.links;
let stationNames: Array<string> = [];
let MAP: Array<Array<Array<any>>>;
let sideInfos: Array<Array<string>> = new Array(nodes.length);
for (let i = 0; i < sideInfos.length; i++) {
  sideInfos[i] = new Array(nodes.length);
}
for (let i = 0; i < sideInfos.length; i++) {
  for (let j = 0; j < sideInfos.length; j++) {
    sideInfos[i][j] = "null"; //i->j, 9999
  }
}
module.exports = {
  createGraph: () => {
    let Map: Array<Array<Array<any>>> = new Array(nodes.length);

    for (let i = 0; i < Map.length; i++) {
      Map[i] = new Array(nodes.length);
      for (let j = 0; j < Map[i].length; j++) {
        Map[i][j] = new Array(2);
      }
    }
    for (let i = 0; i < Map.length; i++) {
      for (let j = 0; j < Map.length; j++) {
        Map[i][j][0] = 9999; //i->j, 9999
      }
    }
    links.forEach((e: any) => {
      Map[getStationIndex(e.source)][getStationIndex(e.target)] = [
        e.value,
        e.line
      ];
      Map[getStationIndex(e.target)][getStationIndex(e.source)] = [
        e.value,
        e.line
      ];
    });
    links.forEach((e: any) => {
      sideInfos[getStationIndex(e.source)][getStationIndex(e.target)] = e.line;
      sideInfos[getStationIndex(e.target)][getStationIndex(e.source)] = e.line;
    });
    MAP = Map;
    return Map;
  },

  getShort: (
    Map: Array<Array<Array<any>>>,
    source: string,
    target: string,
    MODE: string
  ) => {
    let n = Map.length;
    let result = dijsktra(Map, getStationIndex(source), MODE);
    let between = [];
    let buf: Array<string> = String(result[1][getStationIndex(target)]).split(
      "->"
    );
    console.info("tag", buf);
    for (let i = 0; i < buf.length - 1; i++) {
      between.push(
        sideInfos[getStationIndex(buf[i])][getStationIndex(buf[i + 1])]
      );
    }

    for (let i = 0; i < between.length - 1; i++) {
      if (between[i + 1] != between[i]) {
        buf[i + 1] = buf[i + 1] + "--><换乘" + between[i + 1] + ">";
      }
    }

    let useful_res = [result[0][getStationIndex(target)], buf.join("-->")];
    let finall_name;
    return [result, useful_res];
  },
  getFee: (distance: number) => {
    let fee = 0;
    if (distance <= 6) {
      fee = 3;
    }
    if (6 < distance && distance <= 12) fee = 4;
    if (12 < distance && distance <= 32) {
      fee = Math.ceil(4 + (distance - 12) / 10);
    }
    if (32 < distance) {
      fee = Math.ceil(6 + (distance - 32) / 20);
    }
    return fee;
  },
  getStationByGroup: () => {
    let groupInfo = data.nodes;
    let lineNames: Array<string> = [];
    let lineInfos: Array<Array<JSON>> = [];
    let finall_buf: Array<Array<JSON>> = [];

    nodes.forEach((e: any) => {
      if (lineNames.length == 0 || !ifIn(lineNames, e.group)) {
        lineNames.push(e.group);
      }
    });

    nodes.forEach((e: any) => {
      stationNames.push(e.id);
    });

    return finall_buf;
  }
};

const getStationIndex = (name: string) => {
  let ret_buf: number;
  for (let i = 0; i < stationNames.length; i++) {
    if (stationNames[i] == name) {
      ret_buf = i;
      break;
    }
  }
  return ret_buf;
};

const ifIn = (arr: Array<String>, str: String) => {
  let i;
  for (i = 0; i < arr.length; i++) {
    if (str == arr[i]) return true;
  }
  return false;
};

let MAX = Number.MAX_VALUE;//不连通
let dijsktra = (
  weight: Array<Array<Array<any>>>,
  start: number,
  MODE: string
) => {
  console.log("tag", MODE);
  let n: number = weight.length; //获取邻接矩阵的阶数
  let shortPath: Array<number> = []; //创建最短路径数组
  let lineInfos = nodes[start].group;
  for (let i = 0; i < n; i++) {
    shortPath[i] = 0;
  }
  let path: Array<string> = new Array(n); //创建最短路径信息数组
  for (let i = 0; i < n; i++) {
    path[i] = stationNames[start] + "->" + stationNames[i];
  }

  let visited: Array<number> = new Array(n); //创建已遍历过的节点数组0->为未遍历，1->已遍历
  for (let i = 0; i < n; i++) {
    visited[i] = 0;
  }
  shortPath[start] = 0;
  visited[start] = 1;

  for (let count = 1; count <= n - 1; count++) {
    let k = -1;
    let dmin = MAX;
    for (let i = 0; i < n; i++) {
      if (visited[i] == 0 && weight[start][i][0] < dmin) {//判断松弛条件，既尚未遍历的点的距离与起点到此点距离的比较
        dmin = weight[start][i][0];
        k = i;
      }
    }
    shortPath[k] = dmin;
    visited[k] = 1;//k点已遍历
    for (let i = 0; i < n; i++) {
      if (
        visited[i] == 0 &&
        weight[start][k][0] + weight[k][i][0] < weight[start][i][0]
      ) {
        weight[start][i][0] = weight[start][k][0] + weight[k][i][0];
        if (nodes[k].group != weight[k][i][1]) {
          path[i] = path[k] + "->" + stationNames[i];
        } else path[i] = path[k] + "->" + stationNames[i];
      }
    }//在查找的最短距离的过程中记录到该点[i]的路径信息
  }

  return [shortPath, path];//返回起点到其他所有点的最短路径以及路径信息
};
