module.exports = {
  "nested": {
    "Login": {
      "nested": {
        "ClientNeedLogin_LC": {
          "fields": {}
        },
        "ClientLogin_CL": {
          "fields": {
            "Code": {
              "type": "string",
              "id": 1
            },
            "SessionId": {
              "type": "string",
              "id": 2
            }
          }
        },
        "LoginState_LC": {
          "fields": {
            "State": {
              "type": "LoginState",
              "id": 1
            },
            "SessionId": {
              "type": "int32",
              "id": 2
            }
          },
          "nested": {
            "LoginState": {
              "values": {
                "SUCCESS": 0,
                "CODE_ERROR": 1,
                "BUSY_ERROR": 2,
                "SESSION_ERROR": 3
              }
            }
          }
        }
      }
    }
  }
}