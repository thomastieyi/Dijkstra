define({ "api": [
  {
    "type": "get",
    "url": "/getShortInfo",
    "title": "getShortInfo",
    "description": "<p>getShortInfo</p>",
    "group": "BeijingSUbwayInfoSystem_APIs",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "s",
            "description": "<p>source station</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "t",
            "description": "<p>target station</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "m",
            "description": "<p>render the subway map(map for true)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "login:",
          "content": "https://subway-api.cherryhuang.cn/getShortInfo?s=五道口&t=苹果园&m=map",
          "type": "string"
        }
      ]
    },
    "version": "1.0.0",
    "error": {
      "examples": [
        {
          "title": "false:",
          "content": "[false]",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "true:",
          "content": "\n [25.616999999999997,\"五道口-->知春路--><换乘十号线>-->知春里-->海淀黄庄--><换乘四号线>-->人民大学-->魏公村-->国家图书馆--><换乘九号线>-->白石桥南-->白堆子-->军事博物馆--><换乘一号线>-->公主坟-->万寿路-->五棵松-->玉泉路-->八宝山-->八角游乐园-->古城-->苹果园\"]\n\nIF m == map\nyou'll get a map HTML",
          "type": "json"
        }
      ]
    },
    "filename": "controller/index.ts",
    "groupTitle": "BeijingSUbwayInfoSystem_APIs",
    "name": "GetGetshortinfo",
    "sampleRequest": [
      {
        "url": "https://subway-api.cherryhuang.cn:8087/getShortInfo"
      }
    ]
  }
] });
