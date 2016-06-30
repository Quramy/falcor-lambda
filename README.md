# falcor-lambda

creates AWS Lambda handler from Falcor's data source.

## Getting started 

Create Lambda handler function. For example:

```handler.js
import dataSourceHanlder from "falcor-lambda";
import Router from "falcor-router";

class MyRouter extends Router.createClass([
  {
    route: "greeting",
    get: function(pathset) {
      return {
        path: ["greeting"],
        value: "Hello, world",
      };
    },
    set: function(jsonGraph) {
      return {
        path: ["greeting"],
        value: jsonGraph.greeting,
      };
    }
  },
]) {

}

module.exports.handler = dataSourceHanlder(() => new MyRouter());
```

If you integrate the above handler with AWS API Gateway, you must configure [API Request Mapping](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html). The following JSON is a full example including the mapping(see `requestTemplates` object).

```json
{
  "name": "model",
  "runtime": "nodejs4.3",
  "description": "Serverless Lambda function for project: falcor-lambda-example",
  "customName": false,
  "customRole": false,
  "handler": "model/handler.handler",
  "timeout": 6,
  "memorySize": 1024,
  "authorizer": {},
  "custom": {
    "excludePatterns": [],
    "optimize": {
      "exclude": ["aws-sdk"],
      "debug": true,
      "transforms": [
        {
          "name": "babelify",
          "opts": {
            "presets": [ "es2015" ]
          }
        }
      ]
    }
  },
  "endpoints": [
    {
      "path": "model",
      "method": "GET",
      "type": "AWS",
      "authorizationType": "none",
      "authorizerFunction": false,
      "apiKeyRequired": false,
      "requestParameters": {},
      "requestTemplates": {
        "application/json": {
          "method": "$input.params().querystring.method",
          "paths": "$util.escapeJavaScript($input.params().querystring.paths)"
        }
      },
      "responses": {
        "400": {
          "statusCode": "400"
        },
        "default": {
          "statusCode": "200",
          "responseParameters": {},
          "responseModels": {
            "application/json;charset=UTF-8": "Empty"
          },
          "responseTemplates": {
            "application/json;charset=UTF-8": ""
          }
        }
      }
    }, {
      "path": "model",
      "method": "POST",
      "type": "AWS",
      "authorizationType": "none",
      "authorizerFunction": false,
      "apiKeyRequired": false,
      "requestParameters": {},
      "requestTemplates": {
        "application/json": {
          "method": "$input.json('$.method')",
          "jsonGraph": "$input.json('$.jsonGraph')",
          "callPath": "$input.json('$.callPath')",
          "arguments": "$input.json('$.arguments')",
          "pathSuffixes": "$input.json('$.pathSuffixes')",
          "paths": "$input.json('$.paths')"
        }
      },
      "responses": {
        "400": {
          "statusCode": "400"
        },
        "default": {
          "statusCode": "200",
          "responseParameters": {},
          "responseModels": {
            "application/json;charset=UTF-8": "Empty"
          },
          "responseTemplates": {
            "application/json;charset=UTF-8": ""
          }
        }
      }
    }
  ],
  "events": [],
  "environment": {
    "SERVERLESS_PROJECT": "${project}",
    "SERVERLESS_STAGE": "${stage}",
    "SERVERLESS_REGION": "${region}"
  },
  "vpc": {
    "securityGroupIds": [],
    "subnetIds": []
  }
}
```
