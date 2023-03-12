[
    {
        "id": "245c490b3b292ecd",
        "type": "tab",
        "label": "fp1_fixer",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "431fe53d7f568b4e",
        "type": "ha-api",
        "z": "245c490b3b292ecd",
        "name": "",
        "server": "db1dce64.47b74",
        "version": 1,
        "debugenabled": false,
        "protocol": "websocket",
        "method": "get",
        "path": "",
        "data": "{\"type\":\"config/device_registry/list\"}",
        "dataType": "json",
        "responseType": "json",
        "outputProperties": [
            {
                "property": "payload",
                "propertyType": "msg",
                "value": "",
                "valueType": "results"
            }
        ],
        "x": 270,
        "y": 120,
        "wires": [
            [
                "e3591adf44492bb7"
            ]
        ]
    },
    {
        "id": "50e9737aec43775f",
        "type": "inject",
        "z": "245c490b3b292ecd",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "60",
        "crontab": "",
        "once": true,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 130,
        "y": 120,
        "wires": [
            [
                "431fe53d7f568b4e"
            ]
        ]
    },
    {
        "id": "c09095b73d4790bf",
        "type": "debug",
        "z": "245c490b3b292ecd",
        "name": "debug 12",
        "active": false,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 380,
        "y": 620,
        "wires": []
    },
    {
        "id": "e3591adf44492bb7",
        "type": "function",
        "z": "245c490b3b292ecd",
        "name": "function 30",
        "func": "let sensors = jsonpath.query(msg.payload,\"$..[?(@.model=='Aqara presence detector FP1 (RTCZCGQ11LM)')]\")\nlet q = []\nsensors.forEach(function(element) {\n    q.push({ \"type\": \"search/related\", \"item_type\": \"device\", \"item_id\": element.id})\n});\n\nmsg.q = q\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [
            {
                "var": "jsonpath",
                "module": "jsonpath"
            }
        ],
        "x": 410,
        "y": 220,
        "wires": [
            [
                "5963cbb0503faacb"
            ]
        ]
    },
    {
        "id": "5963cbb0503faacb",
        "type": "array-loop",
        "z": "245c490b3b292ecd",
        "name": "",
        "key": "al5963cbb0503faacb",
        "keyType": "msg",
        "reset": false,
        "resetValue": "value-null",
        "array": "q",
        "arrayType": "msg",
        "x": 210,
        "y": 300,
        "wires": [
            [],
            [
                "e98067cdd83de6c1",
                "747ec4264629e19a"
            ]
        ]
    },
    {
        "id": "e98067cdd83de6c1",
        "type": "delay",
        "z": "245c490b3b292ecd",
        "name": "",
        "pauseType": "delay",
        "timeout": "10",
        "timeoutUnits": "milliseconds",
        "rate": "1",
        "nbRateUnits": "1",
        "rateUnits": "second",
        "randomFirst": "1",
        "randomLast": "5",
        "randomUnits": "seconds",
        "drop": false,
        "allowrate": false,
        "outputs": 1,
        "x": 210,
        "y": 380,
        "wires": [
            [
                "5963cbb0503faacb"
            ]
        ]
    },
    {
        "id": "747ec4264629e19a",
        "type": "ha-api",
        "z": "245c490b3b292ecd",
        "name": "",
        "server": "db1dce64.47b74",
        "version": 1,
        "debugenabled": false,
        "protocol": "websocket",
        "method": "get",
        "path": "",
        "data": "payload",
        "dataType": "jsonata",
        "responseType": "json",
        "outputProperties": [
            {
                "property": "payload",
                "propertyType": "msg",
                "value": "",
                "valueType": "results"
            }
        ],
        "x": 390,
        "y": 320,
        "wires": [
            [
                "35ee1c6a40b93afb"
            ]
        ]
    },
    {
        "id": "35ee1c6a40b93afb",
        "type": "ha-get-entities",
        "z": "245c490b3b292ecd",
        "name": "",
        "server": "db1dce64.47b74",
        "version": 0,
        "rules": [
            {
                "property": "entity_id",
                "logic": "includes",
                "value": "payload.entity",
                "valueType": "jsonata"
            }
        ],
        "output_type": "array",
        "output_empty_results": false,
        "output_location_type": "msg",
        "output_location": "payload",
        "output_results_count": 1,
        "x": 450,
        "y": 420,
        "wires": [
            [
                "c134474593117b35"
            ]
        ]
    },
    {
        "id": "c134474593117b35",
        "type": "function",
        "z": "245c490b3b292ecd",
        "name": "function 31",
        "func": "msg.needs_reset = false\nmsg.payload.forEach(function (element) {\n    if (element.attributes.device_class == 'presence') {\n\n        if (element.state == 'on'\n            && element.attributes.presence_event.match(/(.*?leave$)|(away$)/) != null) {\n            msg.payload.forEach(function (e) {\n                if (e.entity_id.match(/.*reset_nopresence_status$/) != null)\n                {\n                    msg.payload = {\n                        \"domain\": \"select\",\n                        \"service\": \"select_option\",\n                        \"target\": {\n                            \"entity_id\": [e.attributes.entity_id]\n                        },\n                        \"data\": {\n                            \"option\": \"\"\n                        }\n                    }\n                    msg.needs_reset=true\n                }\n            });\n        }\n    }\n});\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 210,
        "y": 540,
        "wires": [
            [
                "c09095b73d4790bf",
                "0ed312fdb6a5a255"
            ]
        ]
    },
    {
        "id": "6510c943f0f541e5",
        "type": "api-call-service",
        "z": "245c490b3b292ecd",
        "name": "",
        "server": "db1dce64.47b74",
        "version": 5,
        "debugenabled": false,
        "domain": "",
        "service": "",
        "areaId": [],
        "deviceId": [],
        "entityId": [],
        "data": "",
        "dataType": "jsonata",
        "mergeContext": "",
        "mustacheAltTags": false,
        "outputProperties": [],
        "queue": "none",
        "x": 550,
        "y": 540,
        "wires": [
            []
        ]
    },
    {
        "id": "0ed312fdb6a5a255",
        "type": "switch",
        "z": "245c490b3b292ecd",
        "name": "",
        "property": "needs_reset",
        "propertyType": "msg",
        "rules": [
            {
                "t": "true"
            }
        ],
        "checkall": "true",
        "repair": false,
        "outputs": 1,
        "x": 390,
        "y": 540,
        "wires": [
            [
                "6510c943f0f541e5"
            ]
        ]
    },
    {
        "id": "db1dce64.47b74",
        "type": "server",
        "name": "Home Assistant",
        "version": 5,
        "rejectUnauthorizedCerts": true,
        "ha_boolean": "y|yes|true|on|home|open",
        "connectionDelay": true,
        "cacheJson": true,
        "heartbeat": false,
        "heartbeatInterval": 30,
        "areaSelector": "friendlyName",
        "deviceSelector": "friendlyName",
        "entitySelector": "friendlyName",
        "statusSeparator": "at: ",
        "statusYear": "hidden",
        "statusMonth": "short",
        "statusDay": "numeric",
        "statusHourCycle": "h23",
        "statusTimeFormat": "h:m",
        "enableGlobalContextStore": true
    }
]
