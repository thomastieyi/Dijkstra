let data = require("./data.json");
let nodes = data.nodes;
let links = data.links;
let stationNames = [];
module.exports = {
    createGraph: () => {
        let Map = new Array(nodes.length);
        for (let i = 0; i < Map.length; i++) {
            Map[i] = new Array(nodes.length);
        }
        for (let i = 0; i < Map.length; i++) {
            for (let j = 0; j < Map.length; j++) {
                Map[i][j] = 9999; //i->j, 9999
            }
        }
        links.forEach((e) => {
            Map[getStationIndex(e.source)][getStationIndex(e.target)] = e.value;
            Map[getStationIndex(e.target)][getStationIndex(e.source)] = e.value;
        });
        return Map;
    },
    getShort: (Map, source, target) => {
        let n = Map.length;
        let result = dijsktra(Map, getStationIndex(source));
        let useful_res = [
            result[0][getStationIndex(target)],
            result[1][getStationIndex(target)]
        ];
        let finall_name;
        return [result, useful_res];
    },
    getFee: (distance) => {
        let fee = 0;
        if (distance <= 6) {
            fee = 3;
        }
        if (6 < distance && distance <= 12)
            fee = 4;
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
        let lineNames = [];
        let lineInfos = [];
        let finall_buf = [];
        nodes.forEach((e) => {
            if (lineNames.length == 0 || !ifIn(lineNames, e.group)) {
                lineNames.push(e.group);
            }
        });
        nodes.forEach((e) => {
            stationNames.push(e.id);
        });
        return finall_buf;
    }
};
const getStationIndex = (name) => {
    let ret_buf;
    for (let i = 0; i < stationNames.length; i++) {
        if (stationNames[i] == name) {
            ret_buf = i;
            break;
        }
    }
    return ret_buf;
};
const ifIn = (arr, str) => {
    let i;
    for (i = 0; i < arr.length; i++) {
        if (str == arr[i])
            return true;
    }
    return false;
};
let MAX = Number.MAX_VALUE;
let dijsktra = (weight, start) => {
    let n = weight.length; //获取邻接矩阵的阶数
    let shortPath = []; //创建最短路径数组
    let lineInfos = nodes[start].group;
    for (let i = 0; i < n; i++) {
        shortPath[i] = 0;
    }
    let path = new Array(n); //创建最短路径信息数组
    for (let i = 0; i < n; i++) {
        path[i] = stationNames[start] + "->" + stationNames[i];
    }
    let visited = new Array(n); //创建已遍历过的节点数组0->为未遍历，1->已遍历
    for (let i = 0; i < n; i++) {
        visited[i] = 0;
    }
    shortPath[start] = 0;
    visited[start] = 1;
    for (let count = 1; count <= n - 1; count++) {
        let k = -1;
        let dmin = MAX;
        for (let i = 0; i < n; i++) {
            if (visited[i] == 0 && weight[start][i] < dmin) {
                dmin = weight[start][i];
                k = i;
            }
        }
        shortPath[k] = dmin;
        visited[k] = 1;
        for (let i = 0; i < n; i++) {
            if (visited[i] == 0 &&
                weight[start][k] + weight[k][i] < weight[start][i]) {
                weight[start][i] = weight[start][k] + weight[k][i];
                if (nodes[k].group != nodes[i].group)
                    path[i] =
                        path[k] + '">(换乘' + nodes[i].group + ")" + stationNames[i];
                else
                    path[i] = path[k] + "->" + stationNames[i];
            }
        }
    }
    return [shortPath, path];
};
//# sourceMappingURL=index.js.map