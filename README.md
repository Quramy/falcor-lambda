# falcor-lambda [![Build Status](https://travis-ci.org/Quramy/falcor-lambda.svg?branch=master)](https://travis-ci.org/Quramy/falcor-lambda) [![npm version](https://badge.fury.io/js/falcor-lambda.svg)](https://badge.fury.io/js/falcor-lambda)

[![Greenkeeper badge](https://badges.greenkeeper.io/Quramy/falcor-lambda.svg)](https://greenkeeper.io/)

It creates AWS Lambda handler from Falcor's data source.

You can setup a Falcor endpoint on AWS API Gateway and Lambda using [serverless-falcor-starter](https://github.com/Quramy/serverless-falcor-starter). This project exposes the Falcor endponit using falcor-lambda.

## Usage

You can create a Lambda handler function. For example:

```js
/* handler.js */

import dataSourceHanlder from "falcor-lambda";
import Router from "falcor-router";

module.exports.handler = dataSourceHanlder(() => new Router([{
  route: "greeting",
  get: function() {
    return { path: ["greeting"], value: "Hello, world" };
  }
}]));
```

## API

#### function `dataSourceHanlder(sourceCreateFn: SourceCreateFn, option?: Option): LambdaHandlerFunction`

Creates a Lambda handler.

* `sourceCreateFn`: A function which returns a Falcor DataSource.

#### type `SourceCreateFn: (event?: any, context?: any) => DataSource`

* `event`: An event argument of the AWS Lambda function.
* `context`: A context argument of the AWS Lambda function.

#### type `Option: {debug?: boolean, eventToFalcorContext?: (event: any, context: any) => FalcorContext}`

* `debug`: Allows to output debug log.
* `eventToFalcorContext`: This function creates a `FalcorContext` object from the Lambda's event or context value. See also [Request and event mapping](#request-and-event-mapping)

#### type `FalcorContext: {method: string, jsonGraph?: JSONGraphEnvelope, callPath?: Path, arguments?: any[], pathSuffixes?: Pathset[], paths?: PathSet[]}`
`FalcorContext` represents Falcor DataSource's `get/set/call` arguments.

## Request and event mapping

If you integrate a Lambda handler with AWS API Gateway, you must create a mapping from request to Lambda events with [API Request Mapping](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html). falcor-lambda assumes that the request parameter of the GET/POST method will be mapped in the following way:

* GET

```json
"requestTemplates": {
  "application/json": {
    "method": "$input.params().querystring.method",
    "paths": "$util.escapeJavaScript($input.params().querystring.paths)"
  }
}
```

* POST

```json
"requestTemplates": {
  "application/json": {
    "method": "$input.json('$.method')",
    "jsonGraph": "$input.json('$.jsonGraph')",
    "callPath": "$input.json('$.callPath')",
    "arguments": "$input.json('$.arguments')",
    "pathSuffixes": "$input.json('$.pathSuffixes')",
    "paths": "$input.json('$.paths')"
  }
}
```

If you want the complete example, please see [falcor-lambda-example/falcor/model/s-function.json](https://github.com/Quramy/falcor-lambda/blob/master/examples/falcor-lambda-example/falcor/model/s-function.json)

By the default, falcor-lambda parses the each value of the event object using `JSON.parse` because assumption that they are stringified JSON parameter. If you use other mapping, witch is different from the above sample, you can pass through request values to your DataSource with customizing `eventToFalcorContext`.

## License
This software is released under the MIT License, see LICENSE.txt.

